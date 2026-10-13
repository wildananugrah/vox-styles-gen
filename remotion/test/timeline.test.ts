import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { durationInFrames, timeline } from '../src/timeline';

const example = JSON.parse(readFileSync(new URL('../videos/creator-shortlist/content.json', import.meta.url), 'utf8'));

describe('timeline', () => {
  const tl = timeline(example);

  test('total duration matches the old engine (74.3 s for 18 cards in 5 chapters)', () => {
    expect(tl.dur).toBeCloseTo(74.3);
  });

  test('hook starts at 0, title at 5.7, first chapter at 11.6', () => {
    expect(tl.hook).toBe(0);
    expect(tl.title).toBeCloseTo(5.7);
    expect(tl.chapters[0].start).toBeCloseTo(11.6);
  });

  test('chapter starts follow 1.6 + 2.45 per card + 1.0', () => {
    expect(tl.chapters.map((c) => +c.start.toFixed(2))).toEqual([11.6, 21.55, 33.95, 43.9, 56.3]);
    expect(tl.end).toBeCloseTo(68.7);
  });

  test('card times, summary and "full at" for the first chapter', () => {
    const c = tl.chapters[0];
    expect(c.cards.map((t) => +t.toFixed(2))).toEqual([13.2, 15.65, 18.1]);
    expect(c.sumT).toBeCloseTo(20.55);
    expect(c.fullAt).toBeCloseTo(21.15);
    expect(c.headerAt).toBeCloseTo(13.2);
  });

  test('sheets list every scene in order with its start time', () => {
    expect(tl.sheets.map((s) => s.id)).toEqual(['hook', 'title', 'ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'end']);
    expect(tl.sheets[2].t).toBeCloseTo(11.6);
  });

  test('durationInFrames rounds like the old renderer', () => {
    expect(durationInFrames(example)).toBe(1783);
  });
});
