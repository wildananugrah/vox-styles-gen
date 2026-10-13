// Shared helpers for the npm scripts. Run them from the remotion/ folder.
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

/** videos/<slug>/content.json for a slug argument, or exit with the expected path. */
export function videoPaths(slug) {
  if (!slug) {
    console.error('usage: npm run <script> -- <slug>   (a folder under videos/)');
    process.exit(1);
  }
  const dir = path.join(ROOT, 'videos', slug);
  const content = path.join(dir, 'content.json');
  return { dir, content, exists: existsSync(content) };
}

export function loadContent(slug) {
  const p = videoPaths(slug);
  if (!p.exists) {
    console.error(`missing ${path.relative(process.cwd(), p.content)}. Create it with: npm run new -- ${slug}`);
    process.exit(1);
  }
  return { ...p, props: JSON.parse(readFileSync(p.content, 'utf8')) };
}

/** A src/ module compiled on the fly (Node 20 can't import TypeScript), so scripts and video share one schedule and schema. */
async function loadTs(file) {
  const { build } = await import('esbuild');
  const { outputFiles } = await build({ entryPoints: [path.join(ROOT, file)], bundle: true, format: 'esm', platform: 'node', write: false, logLevel: 'silent' });
  return import('data:text/javascript;base64,' + Buffer.from(outputFiles[0].text).toString('base64'));
}

/** Which engine a content.json targets: "style": "textbook" / "papercraft" / "collage" or the default Vox paper style. */
export const engineOf = (props) =>
  props?.style === 'collage'
    ? { id: 'Collage', timeline: 'src/collage/timeline.ts', schema: 'src/collage/schema.ts' }
    : props?.style === 'textbook'
    ? { id: 'Textbook', timeline: 'src/textbook/timeline.ts', schema: 'src/textbook/schema.ts' }
    : props?.style === 'papercraft'
      ? { id: 'Papercraft', timeline: 'src/textbook/timeline.ts', schema: 'src/papercraft/schema.ts' }
      : { id: 'VoxVideo', timeline: 'src/timeline.ts', schema: 'src/schema.ts' };

export const loadTimeline = (props) => loadTs(engineOf(props).timeline);

/**
 * Validates content.json against src/schema.ts and exits with every issue (field path + rule).
 * The renderer's Node API does not run the composition schema, so the scripts do it here.
 */
export async function validate(props, file) {
  const { contentSchema } = await loadTs(engineOf(props).schema);
  const r = contentSchema.safeParse(props);
  if (r.success) return r.data;
  console.error(`invalid ${path.relative(process.cwd(), file)}:`);
  for (const i of r.error.issues) console.error(`  ${i.path.join('.')}: ${i.message}`);
  process.exit(1);
}

/** Pull `--name value` out of argv. */
export function opt(argv, name, def = null) {
  const i = argv.indexOf(name);
  if (i < 0) return def;
  const v = argv[i + 1];
  argv.splice(i, 2);
  return v;
}
