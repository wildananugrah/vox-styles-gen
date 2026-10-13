// npm run textures
// One-time: renders the paper, grain and stamp-mask textures into public/textures/.
// Deterministic (seeded PRNG), so re-running gives the same images.
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { ROOT } from './lib.mjs';

const outDir = path.join(ROOT, 'public/textures');
mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.join(ROOT, 'src/index.ts') });
for (const name of ['paper', 'grain', 'stampmask']) {
  const inputProps = { name };
  const composition = await selectComposition({ serveUrl, id: 'Texture', inputProps });
  await renderStill({ composition, serveUrl, inputProps, imageFormat: 'png', output: path.join(outDir, `${name}.png`) });
  console.log(`${name}.png ${composition.width}x${composition.height}`);
}
