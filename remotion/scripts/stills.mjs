// npm run stills -- <slug> [extra seconds…]
// Renders stills at the key moments (hook, title + TOC, each chapter's "full at", end card)
// into videos/<slug>/dbg/, and builds dbg/sheet.png. The layout diagnostics from the page
// ("chapter N card font …", "hook strip N right edge …") are echoed by the renderer.
import { bundle } from '@remotion/bundler';
import { openBrowser, renderStill, selectComposition } from '@remotion/renderer';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { engineOf, loadContent, loadTimeline, ROOT, validate } from './lib.mjs';

const [slug, ...extra] = process.argv.slice(2);
const { dir, content, props } = loadContent(slug);
await validate(props, content);
const { timeline } = await loadTimeline(props);
const tl = timeline(props);
const fps = props.fps ?? 24;
const times = [3, 9.5, ...tl.chapters.map((c) => +c.fullAt.toFixed(2)), +(tl.dur - 2).toFixed(2), ...extra.map(Number)];

const dbg = path.join(dir, 'dbg');
rmSync(dbg, { recursive: true, force: true });
mkdirSync(dbg, { recursive: true });

console.log('bundling…');
const serveUrl = await bundle({ entryPoint: path.join(ROOT, 'src/index.ts') });
const composition = await selectComposition({ serveUrl, id: engineOf(props).id, inputProps: props, logLevel: 'error' });
const browser = await openBrowser('chrome', { logLevel: 'error' });

const files = [];
for (const t of times) {
  const file = path.join(dbg, `t${t.toFixed(2).padStart(5, '0')}.png`);
  await renderStill({ composition, serveUrl, inputProps: props, frame: Math.min(Math.round(t * fps), composition.durationInFrames - 1), output: file, puppeteerInstance: browser, logLevel: 'error' });
  files.push(file);
}
await browser.close({ silent: true });

const sheet = path.join(dbg, 'sheet.png');
execFileSync('ffmpeg', ['-v', 'error', '-y', '-pattern_type', 'glob', '-i', path.join(dbg, 't*.png'), '-vf', `scale=360:-1,tile=${files.length}x1:padding=8`, '-frames:v', '1', sheet]);
console.log(`stills at ${times.join(', ')} s  DUR ${tl.dur.toFixed(1)} s`);
console.log(`contact sheet: ${path.relative(process.cwd(), sheet)}`);
