#!/usr/bin/env node
// Node port of web-app-promo-video/scripts/render.py (same page contract:
// window.ready, window.seek(t), window.DUR).
//
//   node render.mjs stills promo.html dbg 1.0 5.5 12
//   node render.mjs video  promo.html out.mp4 [--fps 30] [--size 1080x1920] [--from 0 --to 10]
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import os from 'node:os';

const argv = process.argv.slice(2);
const opt = (name, def) => { const i = argv.indexOf(name); if (i < 0) return def; const v = argv[i + 1]; argv.splice(i, 2); return v; };
const fps = +opt('--fps', 30);
const [W, H] = opt('--size', '1080x1920').split('x').map(Number);
const from = opt('--from', null), to = opt('--to', null);
const [mode, html, out, ...times] = argv;

const exe = path.join(os.homedir(), '.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell');
const b = await chromium.launch({ executablePath: exe, args: ['--force-color-profile=srgb', '--font-render-hinting=none'] });
const pg = await b.newPage({ viewport: { width: W, height: H } });
pg.on('console', m => console.log('console:', m.text()));
pg.on('pageerror', e => console.log('PAGEERROR:', e.message));
await pg.goto(pathToFileURL(path.resolve(html)).href);
await pg.evaluate('window.ready');
const dur = await pg.evaluate('window.DUR');

if (mode === 'stills') {
  mkdirSync(out, { recursive: true });
  for (const t of times.map(Number)) {
    await pg.evaluate(`seek(${t})`);
    await pg.screenshot({ path: path.join(out, `t${t.toFixed(2).padStart(5, '0')}.png`) });
  }
  console.log('stills:', times.length, 'DUR', dur);
} else {
  const f0 = Math.round((from ? +from : 0) * fps), f1 = Math.round((to ? +to : dur) * fps);
  // JPEG frames are far cheaper to capture than PNG; x264 limited to one thread to keep CPU load low.
  // veryfast/crf 23: ~4x faster encode than medium and ~2.5x smaller than crf 18 (the grain makes crf 18 huge)
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-threads', '1', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-threads', '1', '-preset', 'veryfast', '-crf', '23', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let f = f0; f < f1; f++) {
    await pg.evaluate(`seek(${f / fps})`);
    const buf = await pg.screenshot({ type: 'jpeg', quality: 93 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if ((f - f0) % 60 === 0) console.log(f - f0, f1 - f0, Math.round((Date.now() - t0) / 1000));
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  console.log('done', Math.round((Date.now() - t0) / 1000));
}
await b.close();
