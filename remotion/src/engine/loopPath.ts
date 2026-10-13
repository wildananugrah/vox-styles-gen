import type { Box } from './measure';

/** A loose hand-drawn marker loop around a box (stage coordinates). */
export function loopPath(b: Box, padX: number, padY: number): string {
  const cx = b.x + b.w / 2, cy = b.y + b.h / 2, rx = b.w / 2 + padX, ry = b.h / 2 + padY;
  let d = '';
  for (let k = 0; k <= 46; k++) {
    const a = -1.9 + (k / 46) * (Math.PI * 2 + 0.55);
    const wob = 1 + 0.045 * Math.sin(k * 1.7) + 0.03 * Math.cos(k * 0.9) - k * 0.0012;
    d += (k ? ' L' : 'M') + (cx + Math.cos(a) * rx * wob).toFixed(1) + ' ' + (cy + Math.sin(a) * ry * wob).toFixed(1);
  }
  return d;
}

/** The marker underline drawn under a word. */
export const underlinePath = (b: Box) =>
  `M${b.x - 6} ${b.y + b.h - 2} C ${b.x + b.w * 0.3} ${b.y + b.h + 14}, ${b.x + b.w * 0.6} ${b.y + b.h - 10}, ${b.x + b.w + 14} ${b.y + b.h + 4}`;
