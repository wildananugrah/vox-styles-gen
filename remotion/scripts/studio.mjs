// npm run studio [-- <slug>]
// Live preview with a scrubber. With a slug, the Studio opens that video's content.json.
import { spawn } from 'node:child_process';
import path from 'node:path';
import { loadContent, ROOT } from './lib.mjs';

const slug = process.argv[2];
const args = ['remotion', 'studio'];
if (slug) args.push(`--props=${path.relative(ROOT, loadContent(slug).content)}`);
spawn('npx', args, { cwd: ROOT, stdio: 'inherit' }).on('close', (code) => process.exit(code ?? 0));
