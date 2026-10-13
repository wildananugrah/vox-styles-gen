import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { contentSchema } from '../src/schema';

const load = () => JSON.parse(readFileSync(new URL('../videos/creator-shortlist/content.json', import.meta.url), 'utf8'));
const issues = (c: unknown) => {
  const r = contentSchema.safeParse(c);
  return r.success ? [] : r.error.issues.map((i) => i.path.join('.') + ': ' + i.message);
};

describe('contentSchema', () => {
  test('accepts the creator-shortlist example', () => {
    expect(issues(load())).toEqual([]);
  });

  test('rejects a hook strip longer than 28 characters', () => {
    const c = load();
    c.hook.strips[1] = 'Doctors really hate this trick'; // 30 chars
    expect(issues(c)).toEqual([expect.stringMatching(/^hook\.strips\.1: /)]);
  });

  test('rejects a chapter with 5 cards', () => {
    const c = load();
    c.chapters[0].cards.push(c.chapters[0].cards[0], c.chapters[0].cards[1]);
    expect(issues(c)).toEqual([expect.stringMatching(/^chapters\.0\.cards: /)]);
  });

  test('rejects 3 highlights on one line', () => {
    const c = load();
    c.end.head[0] = '==Pick== ==one== ==topic.==';
    expect(issues(c)).toEqual([expect.stringMatching(/^end\.head\.0: .*highlight/)]);
  });

  test('rejects a title head without {count}', () => {
    const c = load();
    c.titleCard.head[0] = '18 creators';
    expect(issues(c)).toEqual([expect.stringMatching(/^titleCard\.head: .*\{count\}/)]);
  });
});
