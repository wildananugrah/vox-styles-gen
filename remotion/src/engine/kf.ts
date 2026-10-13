// Keyframes in seconds, with the same semantics as val() in the old promo.html engine:
// hold the first value before the first key, the last value after the last key, and ease
// each segment with the easing named on its end key ('out' when none is given).
export const E = {
  lin: (p: number) => p,
  out: (p: number) => 1 - Math.pow(1 - p, 3),
  inout: (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
  expo: (p: number) => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p)),
  back: (p: number) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
  },
};
export type Ease = keyof typeof E;
export type Key = [number, number, Ease?];

export function kf(t: number, keys: Key[]): number {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t < b[0]) {
      const p = (t - a[0]) / (b[0] - a[0]);
      return a[1] + (b[1] - a[1]) * E[b[2] || 'out'](p);
    }
  }
  return keys[keys.length - 1][1];
}
