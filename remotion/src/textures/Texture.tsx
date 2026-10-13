import React, { useLayoutEffect, useRef } from 'react';
import { z } from 'zod';

// One-time texture generator (port of the old textures.mjs, same seeded PRNG, so re-runs give
// identical images). Rendered to public/textures/ by `npm run textures`, not part of the video.
export const textureSchema = z.object({ name: z.enum(['paper', 'grain', 'stampmask']) });
export type TextureName = z.infer<typeof textureSchema>['name'];
export const TEXTURE_SIZE: Record<TextureName, [number, number]> = { paper: [1080, 1920], grain: [512, 512], stampmask: [256, 256] };

// each texture continues the PRNG where the previous one stopped, exactly like the old script
const ORDER: TextureName[] = ['paper', 'grain', 'stampmask'];

function drawAll(target: TextureName): HTMLCanvasElement {
  let s = 1234567;
  const rnd = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
  const mk = (w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] => {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    return [c, c.getContext('2d', { willReadFrequently: true })!];
  };
  const out: Partial<Record<TextureName, HTMLCanvasElement>> = {};

  for (const name of ORDER) {
    if (name === 'paper') {
      // warm newsprint with soft blotches, fibres and fine tooth
      const [pc, p] = mk(1080, 1920);
      p.fillStyle = '#F2EBDC'; p.fillRect(0, 0, 1080, 1920);
      for (let i = 0; i < 70; i++) {
        const x = rnd() * 1080, y = rnd() * 1920, r = 80 + rnd() * 320;
        const g = p.createRadialGradient(x, y, 0, x, y, r);
        const dark = rnd() < 0.5;
        g.addColorStop(0, dark ? 'rgba(160,128,84,0.03)' : 'rgba(255,252,244,0.06)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        p.fillStyle = g; p.fillRect(x - r, y - r, 2 * r, 2 * r);
      }
      p.lineWidth = 1;
      for (let i = 0; i < 2600; i++) {
        const x = rnd() * 1080, y = rnd() * 1920, l = 4 + rnd() * 18, a = rnd() * Math.PI;
        p.strokeStyle = `rgba(110,90,60,${0.03 + rnd() * 0.05})`;
        p.beginPath(); p.moveTo(x, y);
        p.quadraticCurveTo(x + Math.cos(a) * l * 0.5 + rnd() * 3, y + Math.sin(a) * l * 0.5 + rnd() * 3, x + Math.cos(a) * l, y + Math.sin(a) * l);
        p.stroke();
      }
      const id = p.getImageData(0, 0, 1080, 1920), d = id.data;
      for (let i = 0; i < d.length; i += 4) { const n = (rnd() - 0.5) * 10; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
      p.putImageData(id, 0, 0);
      out.paper = pc;
    } else if (name === 'grain') {
      // transparent with dark/light specks, shifted every frame for film grain
      const [gc, g] = mk(512, 512);
      const gd = g.createImageData(512, 512);
      for (let i = 0; i < gd.data.length; i += 4) {
        const v = rnd(); const on = rnd() < 0.5;
        gd.data[i] = gd.data[i + 1] = gd.data[i + 2] = v < 0.5 ? 0 : 255;
        gd.data[i + 3] = on ? Math.round(Math.abs(v - 0.5) * 2 * 60) : 0;
      }
      g.putImageData(gd, 0, 0);
      out.grain = gc;
    } else {
      // mostly opaque with worn-ink holes, for the rubber-stamp monograms
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
      out.stampmask = mc;
    }
    if (name === target) break;
  }
  return out[target]!;
}

export const Texture: React.FC<{ name: TextureName }> = ({ name }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const src = drawAll(name);
    const ctx = ref.current!.getContext('2d')!;
    ctx.clearRect(0, 0, src.width, src.height);
    ctx.drawImage(src, 0, 0);
  }, [name]);
  const [w, h] = TEXTURE_SIZE[name];
  return <canvas ref={ref} width={w} height={h} style={{ display: 'block' }} />;
};
