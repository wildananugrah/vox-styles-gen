// Inline markup in content.json strings:
//   ==text==   yellow highlighter sweep
//   __text__   red hand-drawn underline
//   {count}    total number of cards, circled in red
//   {chapters} number of chapters (plain text)
export type SegKind = 'plain' | 'hl' | 'ul' | 'count';
export type Seg = { kind: SegKind; text: string };
export type Vars = { count: number; chapters: number };

const TOKEN = /==(.+?)==|__(.+?)__|\{count\}/g;

export function parseMarkup(s: string, vars: Vars): Seg[] {
  const out: Seg[] = [];
  const plain = (text: string) => {
    if (!text) return;
    text = text.replace(/\{chapters\}/g, String(vars.chapters));
    const last = out[out.length - 1];
    if (last?.kind === 'plain') last.text += text;
    else out.push({ kind: 'plain', text });
  };
  let i = 0;
  for (const m of s.matchAll(TOKEN)) {
    plain(s.slice(i, m.index));
    if (m[1] !== undefined) out.push({ kind: 'hl', text: m[1] });
    else if (m[2] !== undefined) out.push({ kind: 'ul', text: m[2] });
    else out.push({ kind: 'count', text: String(vars.count) });
    i = m.index! + m[0].length;
  }
  plain(s.slice(i));
  return out;
}

export const visibleText = (s: string, vars: Vars) => parseMarkup(s, vars).map((g) => g.text).join('');

export const countHighlights = (s: string) => (s.match(/==(.+?)==/g) || []).length;

/** One entry per animated word: plain text splits on spaces, marked spans stay whole. */
export function toWords(segs: Seg[]): Seg[] {
  return segs.flatMap((g) =>
    g.kind === 'plain' ? g.text.split(/\s+/).filter(Boolean).map((text) => ({ kind: 'plain' as const, text })) : [g],
  );
}
