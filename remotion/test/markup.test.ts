import { describe, expect, test } from 'vitest';
import { countHighlights, parseMarkup, toWords, visibleText } from '../src/markup';

const vars = { count: 18, chapters: 5 };

describe('parseMarkup', () => {
  test('plain text is one plain segment', () => {
    expect(parseMarkup('Start there.', vars)).toEqual([{ kind: 'plain', text: 'Start there.' }]);
  });

  test('==text== is a highlight', () => {
    expect(parseMarkup('Pick ==one== topic.', vars)).toEqual([
      { kind: 'plain', text: 'Pick ' },
      { kind: 'hl', text: 'one' },
      { kind: 'plain', text: ' topic.' },
    ]);
  });

  test('a highlight may span several words', () => {
    expect(parseMarkup("So who's ==worth== ==learning from?==", vars)).toEqual([
      { kind: 'plain', text: "So who's " },
      { kind: 'hl', text: 'worth' },
      { kind: 'plain', text: ' ' },
      { kind: 'hl', text: 'learning from?' },
    ]);
  });

  test('__text__ is a red underline', () => {
    expect(parseMarkup('Most of it is __noise.__', vars)).toEqual([
      { kind: 'plain', text: 'Most of it is ' },
      { kind: 'ul', text: 'noise.' },
    ]);
  });

  test('{count} becomes its own circled segment', () => {
    expect(parseMarkup('{count} creators', vars)).toEqual([
      { kind: 'count', text: '18' },
      { kind: 'plain', text: ' creators' },
    ]);
  });

  test('{chapters} is substituted into plain text', () => {
    expect(parseMarkup('The shortlist / {chapters} topics', vars)).toEqual([
      { kind: 'plain', text: 'The shortlist / 5 topics' },
    ]);
  });
});

describe('helpers', () => {
  test('visibleText strips markup and fills placeholders', () => {
    expect(visibleText("So who's ==worth== ==learning from?==", vars)).toBe("So who's worth learning from?");
    expect(visibleText('{count} creators', vars)).toBe('18 creators');
  });

  test('countHighlights counts ==…== spans', () => {
    expect(countHighlights('==a== b ==c==')).toBe(2);
    expect(countHighlights('nothing here')).toBe(0);
  });

  test('toWords splits plain text on spaces but keeps marked spans whole', () => {
    expect(toWords(parseMarkup('Follow ==one== creator.', vars))).toEqual([
      { kind: 'plain', text: 'Follow' },
      { kind: 'hl', text: 'one' },
      { kind: 'plain', text: 'creator.' },
    ]);
    expect(toWords(parseMarkup('{count} creators', vars))).toEqual([
      { kind: 'count', text: '18' },
      { kind: 'plain', text: 'creators' },
    ]);
  });
});
