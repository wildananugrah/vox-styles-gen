// node scripts/cutout.mjs <photo_nobg.png> <name> [faceX faceY faceSize]
// Prepares a background-removed photo for the collage style, into public/collage/:
//   <name>-cutout.png  high-contrast black and white, white sticker outline, 1000 px wide
//   <name>-face.png    a square face crop (source pixels) for the round badge
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { ROOT } from './lib.mjs';

const [src, name, fx, fy, fs] = process.argv.slice(2);
if (!src || !name) {
  console.error('usage: node scripts/cutout.mjs <photo_nobg.png> <name> [faceX faceY faceSize]');
  process.exit(1);
}
const out = path.join(ROOT, 'public/collage');
mkdirSync(out, { recursive: true });

const PAD = 34; // room for the sticker outline
const bw = "colorchannelmixer=.3:.59:.11:0:.3:.59:.11:0:.3:.59:.11:0,curves=all='0/0 0.18/0.06 0.5/0.52 0.8/0.94 1/1'";
const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'inherit' });

ff([
  '-i', src, '-filter_complex',
  `[0]scale=1000:-1,format=rgba,pad=iw+${PAD * 2}:ih+${PAD * 2}:${PAD}:${PAD}:color=0x00000000,split=3[a][b][c];` +
    // outline: blur the alpha, threshold it back to a hard edge ~14 px outside the figure
    `[b]alphaextract,gblur=sigma=7,lut=y='if(gt(val,28),255,0)',gblur=sigma=0.8[m];` +
    `[c]lutrgb=r=255:g=255:b=255[w];[w][m]alphamerge[outline];` +
    `[a]${bw}[g];[outline][g]overlay=format=auto`,
  '-frames:v', '1', path.join(out, `${name}-cutout.png`),
]);

if (fx) {
  ff(['-i', src, '-vf', `crop=${fs}:${fs}:${fx}:${fy},scale=420:420,format=rgba,${bw}`, '-frames:v', '1', path.join(out, `${name}-face.png`)]);
}
console.log(`wrote public/collage/${name}-cutout.png${fx ? ` and ${name}-face.png` : ''}`);
