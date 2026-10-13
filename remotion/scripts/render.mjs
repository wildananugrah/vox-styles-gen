// npm run render -- <slug> [--from 20 --to 30] [--concurrency 2]
// Renders videos/<slug>/<slug>.mp4 (or <slug>-<from>-<to>.mp4 for a section).
import { spawn } from 'node:child_process';
import path from 'node:path';
import { engineOf, loadContent, loadTimeline, opt, ROOT, validate } from './lib.mjs';

const argv = process.argv.slice(2);
const from = opt(argv, '--from'), to = opt(argv, '--to');
const concurrency = opt(argv, '--concurrency', '2');
const slug = argv[0];
const { dir, content, props } = loadContent(slug);
await validate(props, content);
const { timeline } = await loadTimeline(props);
const fps = props.fps ?? 24;
const last = Math.round(timeline(props).dur * fps) - 1;

const out = path.join(dir, from || to ? `${slug}-${from ?? 0}-${to ?? 'end'}.mp4` : `${slug}.mp4`);
const args = [
  'remotion', 'render', engineOf(props).id, out,
  `--props=${content}`,
  `--concurrency=${concurrency}`,
  '--codec=h264', '--crf=23', '--x264-preset=veryfast', '--pixel-format=yuv420p',
];
if (from || to) args.push(`--frames=${Math.round((+from || 0) * fps)}-${to ? Math.min(last, Math.round(+to * fps) - 1) : last}`);

const t0 = Date.now();
spawn('npx', args, { cwd: ROOT, stdio: 'inherit' }).on('close', (code) => {
  console.log(code === 0 ? `done in ${Math.round((Date.now() - t0) / 1000)} s: ${path.relative(process.cwd(), out)}` : `render failed (${code})`);
  process.exit(code ?? 1);
});
