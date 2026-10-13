import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { contentSchema } from '../src/collage/schema';
import { durationInFrames, T, timeline } from '../src/collage/timeline';

const example = JSON.parse(readFileSync(new URL('../videos/yoris-kreatif/content.json', import.meta.url), 'utf8'));

describe('collage timeline', () => {
  const tl = timeline(example);

  test('6 lessons: intro at 4.4, lessons every 7.4 s from 10.2, 68.4 s total', () => {
    expect(tl.intro).toBeCloseTo(4.4);
    expect(tl.lessons.map((s) => +s.toFixed(2))).toEqual([10.2, 17.6, 25, 32.4, 39.8, 47.2]);
    expect(tl.bonus).toBeCloseTo(54.6);
    expect(tl.end).toBeCloseTo(62.2);
    expect(tl.dur).toBeCloseTo(68.4);
    expect(durationInFrames(example)).toBe(2052);
  });

  test('pages are increasing and every "full at" sits inside its own page', () => {
    expect(tl.pages).toEqual([...tl.pages].sort((a, b) => a - b));
    tl.chapters.forEach((c, i) => {
      const start = i < tl.lessons.length ? tl.lessons[i] : tl.bonus;
      expect(c.fullAt).toBeGreaterThan(start + T.SLIDE);
      expect(c.fullAt).toBeLessThan(tl.pages[tl.pages.indexOf(start) + 1]);
    });
  });
});

describe('collage schema', () => {
  test('the example is valid', () => {
    expect(contentSchema.safeParse(example).success).toBe(true);
  });

  test('more than 2 highlights in a caption is rejected', () => {
    const bad = structuredClone(example);
    bad.lessons[0].caption = '==a== ==b== ==c==';
    const r = contentSchema.safeParse(bad);
    expect(r.success).toBe(false);
  });

  test('a strip too long for the stage is rejected', () => {
    const bad = structuredClone(example);
    bad.lessons[0].title[1] = 'X'.repeat(18);
    expect(contentSchema.safeParse(bad).success).toBe(false);
  });
});
