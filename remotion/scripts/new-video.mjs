// npm run new -- <slug>
// Creates videos/<slug>/content.json from the creator-shortlist example.
import { copyFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { ROOT, videoPaths } from './lib.mjs';

const slug = process.argv[2];
if (slug && !/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
  console.error(`slug must be lowercase letters, digits and dashes: ${slug}`);
  process.exit(1);
}
const p = videoPaths(slug);
if (p.exists) {
  console.error(`refusing: ${path.relative(process.cwd(), p.content)} already exists`);
  process.exit(1);
}
mkdirSync(p.dir, { recursive: true });
copyFileSync(path.join(ROOT, 'videos/creator-shortlist/content.json'), p.content);
console.log(`ready: ${path.relative(process.cwd(), p.content)}`);
