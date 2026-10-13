// Generates the newsprint textures for the Vox-style look into assets/.
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const exe = path.join(os.homedir(), '.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell');
const b = await chromium.launch({ executablePath: exe });
const pg = await b.newPage();
mkdirSync('assets', { recursive: true });

const out = await pg.evaluate(() => {
  // deterministic PRNG so re-runs give identical textures
  let s = 1234567;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; };

  // 1. paper: warm newsprint with soft blotches, fibres and fine tooth
  const [pc, p] = mk(1080, 1920);
  p.fillStyle = '#F2EBDC'; p.fillRect(0, 0, 1080, 1920);
  for (let i = 0; i < 70; i++) {
    const x = rnd() * 1080, y = rnd() * 1920, r = 80 + rnd() * 320;
    const g = p.createRadialGradient(x, y, 0, x, y, r);
    const dark = rnd() < .5;
    g.addColorStop(0, dark ? 'rgba(160,128,84,0.03)' : 'rgba(255,252,244,0.06)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    p.fillStyle = g; p.fillRect(x - r, y - r, 2 * r, 2 * r);
  }
  p.lineWidth = 1;
  for (let i = 0; i < 2600; i++) {
    const x = rnd() * 1080, y = rnd() * 1920, l = 4 + rnd() * 18, a = rnd() * Math.PI;
    p.strokeStyle = `rgba(110,90,60,${0.03 + rnd() * 0.05})`;
    p.beginPath(); p.moveTo(x, y); p.quadraticCurveTo(x + Math.cos(a) * l * .5 + rnd() * 3, y + Math.sin(a) * l * .5 + rnd() * 3, x + Math.cos(a) * l, y + Math.sin(a) * l); p.stroke();
  }
  const id = p.getImageData(0, 0, 1080, 1920), d = id.data;
  for (let i = 0; i < d.length; i += 4) { const n = (rnd() - .5) * 10; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
  p.putImageData(id, 0, 0);

  // 2. grain tile: transparent with dark/light specks, shifted every frame for film grain
  const [gc, g] = mk(512, 512);
  const gd = g.createImageData(512, 512);
  for (let i = 0; i < gd.data.length; i += 4) {
    const v = rnd(); const on = rnd() < .5;
    gd.data[i] = gd.data[i + 1] = gd.data[i + 2] = v < .5 ? 0 : 255;
    gd.data[i + 3] = on ? Math.round(Math.abs(v - .5) * 2 * 60) : 0;
  }
  g.putImageData(gd, 0, 0);

  // 3. stamp mask: mostly opaque with worn-ink holes, for the rubber-stamp monograms
  const [mc, m] = mk(256, 256);
  m.fillStyle = '#000'; m.fillRect(0, 0, 256, 256);
  m.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 900; i++) {
    m.fillStyle = `rgba(0,0,0,${0.25 + rnd() * 0.75})`;
    m.beginPath(); m.arc(rnd() * 256, rnd() * 256, rnd() * rnd() * 3.2, 0, 7); m.fill();
  }
  for (let i = 0; i < 18; i++) {
    m.fillStyle = `rgba(0,0,0,${0.15 + rnd() * 0.3})`;
    m.beginPath(); m.ellipse(rnd() * 256, rnd() * 256, 6 + rnd() * 20, 2 + rnd() * 6, rnd() * 3, 0, 7); m.fill();
  }
  return [pc.toDataURL('image/png'), gc.toDataURL('image/png'), mc.toDataURL('image/png')];
});
['paper.png', 'grain.png', 'stampmask.png'].forEach((n, i) => writeFileSync(path.join('assets', n), Buffer.from(out[i].split(',')[1], 'base64')));
// promo.html links this; inlined so the mask works from file:// without CORS trouble
writeFileSync(path.join('assets', 'stampmask.css'), `.stamp .in{-webkit-mask-image:url(${out[2]})}\n`);
console.log('textures written');
await b.close();
