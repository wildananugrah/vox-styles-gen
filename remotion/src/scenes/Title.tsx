import React, { useRef } from 'react';
import { Ink, InkLayer, RiseWord, tf } from '../engine/anim';
import { kf } from '../engine/kf';
import { loopPath } from '../engine/loopPath';
import { layoutBox, useMeasure } from '../engine/measure';
import { parseMarkup, toWords, visibleText, type Vars } from '../markup';

const nn = (n: number) => String(n).padStart(2, '0');

// 5.7 - 11.6 s: kicker, three rising headline rows with the item count circled, table of contents.
export const Title: React.FC<{
  t: number; kicker: string; head: string[]; toc: { toc: string; n: number }[]; item: string; vars: Vars;
}> = ({ t, kicker, head, toc, item, vars }) => {
  const root = useRef<HTMLDivElement>(null);
  const countEl = useRef<HTMLSpanElement>(null);
  const m = useMeasure(() => ({ count: countEl.current ? layoutBox(countEl.current, root.current!) : null }), 'title');

  let wi = 0, hi = 0;
  return (
    <div ref={root} style={{ position: 'absolute', inset: 0 }}>
      <div className="abs kicker t-kicker" style={{ opacity: kf(t, [[6.3, 0], [6.7, 1]]) }}>{visibleText(kicker, vars)}</div>
      <div className="t-head">
        {head.map((row, ri) => (
          <span key={ri} className="row">
            {toWords(parseMarkup(row, vars)).map((seg, k) => {
              const i = wi++;
              const sweep: [number, number] | undefined = seg.kind === 'hl' ? [7.35 + hi * 0.3, [0.35, 0.3][hi++] ?? 0.3] : undefined;
              return (
                <React.Fragment key={k}>
                  {k > 0 && ' '}
                  <RiseWord ref={seg.kind === 'count' ? countEl : undefined} seg={seg} t={t} t0={6.4 + i * 0.13} dist={180} sweep={sweep} />
                </React.Fragment>
              );
            })}
          </span>
        ))}
      </div>
      {m?.count && (
        <InkLayer>
          <Ink t={t} t0={7.9} t1={8.5} d={loopPath(m.count, 26, 6)} width={9} />
        </InkLayer>
      )}
      <div className="toc">
        {toc.map((c, i) => {
          const t0 = 8.3 + i * 0.2;
          const cell = { opacity: kf(t, [[t0 + 0.15, 0], [t0 + 0.45, 1]]), transform: tf(kf(t, [[t0 + 0.15, -24], [t0 + 0.6, 0, 'expo']])) };
          return (
            <div key={i} className="toc-row">
              <div className="toc-rule" style={{ transform: `scaleX(${kf(t, [[t0, 0], [t0 + 0.5, 1, 'inout']])})` }} />
              <div className="toc-n" style={cell}>{nn(i + 1)}</div>
              <div className="toc-t" style={cell}>{c.toc}</div>
              <div className="toc-c" style={cell}>{c.n} {item}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
