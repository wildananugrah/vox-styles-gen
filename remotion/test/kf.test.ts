import { describe, expect, test } from 'vitest';
import { E, kf } from '../src/engine/kf';

// kf() must behave exactly like val() in the old promo.html engine, so timings port 1:1.
describe('kf', () => {
  test('holds the first value before the first key', () => {
    expect(kf(-1, [[0, 3], [1, 10]])).toBe(3);
    expect(kf(0, [[0, 3], [1, 10]])).toBe(3);
  });

  test('holds the last value after the last key', () => {
    expect(kf(5, [[0, 3], [1, 10]])).toBe(10);
  });

  test("segments ease with 'out' (cubic) when no easing is given", () => {
    expect(kf(0.5, [[0, 0], [1, 10]])).toBeCloseTo(8.75);
  });

  test('the easing of a segment is taken from its end key', () => {
    expect(kf(0.5, [[0, 0], [1, 10, 'lin']])).toBeCloseTo(5);
    expect(kf(1.5, [[0, 0], [1, 10, 'lin'], [2, 0, 'lin']])).toBeCloseTo(5);
  });

  test('a zero-length segment jumps without dividing by zero', () => {
    expect(kf(1, [[1, 0], [1, 1]])).toBe(0);
    expect(kf(1.01, [[1, 0], [1, 1]])).toBe(1);
  });

  test('easings match the old engine', () => {
    expect(E.lin(0.3)).toBeCloseTo(0.3);
    expect(E.out(0.5)).toBeCloseTo(0.875);
    expect(E.inout(0.25)).toBeCloseTo(0.0625);
    expect(E.inout(0.75)).toBeCloseTo(0.9375);
    expect(E.expo(0.5)).toBeCloseTo(0.96875);
    expect(E.expo(1)).toBe(1);
    expect(E.back(0.5)).toBeCloseTo(1.0876975);
  });
});
