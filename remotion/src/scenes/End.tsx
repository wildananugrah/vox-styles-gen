import React, { useRef } from 'react';
import { Ink, InkLayer, RiseWord, tf } from '../engine/anim';
import { kf } from '../engine/kf';
import { useMeasure } from '../engine/measure';
import { parseMarkup, toWords, visibleText, type Vars } from '../markup';

// Last 5.6 s on a dark sheet: takeaway rises, highlighted words turn ink-coloured as the marker
// reaches them, then the handwritten save CTA with its arrow and the comment ask.
const ARROW = ['M720 1150 C 860 1140, 930 1190, 940 1300', 'M905 1268 L940 1306 L968 1262'];
const SAVE_LEFT = 84, MIN_GAP = 30, ARROW_X = 720;

export const End: React.FC<{
  t: number; TE: number; kicker: string; head: string[]; save: string; ask: string; vars: Vars;
}> = ({ t, TE, kicker, head, save, ask, vars }) => {
  const saveEl = useRef<HTMLDivElement>(null);
  // the arrow stays where the old template drew it, and only moves right when a longer CTA would run into it
  const m = useMeasure(() => ({ dx: Math.max(0, SAVE_LEFT + saveEl.current!.offsetWidth + MIN_GAP - ARROW_X) }), 'end card');

  let wi = 0, hi = 0;
  return (
    <>
      <div className="abs kicker e-kicker" style={{ opacity: kf(t, [[TE + 0.7, 0], [TE + 1.0, 1]]) }}>{visibleText(kicker, vars)}</div>
      <div className="e-head">
        {head.map((row, ri) => (
          <span key={ri} className="row">
            {toWords(parseMarkup(row, vars)).map((seg, k) => {
              const i = wi++;
              let sweep: [number, number] | undefined, color: string | undefined;
              if (seg.kind === 'hl') {
                const t0 = TE + 1.35 + hi++ * 0.4;
                sweep = [t0, 0.3];
                color = t > t0 + 0.12 ? 'var(--ink)' : '#F3ECDD';
              }
              return (
                <React.Fragment key={k}>
                  {k > 0 && ' '}
                  <RiseWord seg={seg} t={t} t0={TE + 0.8 + i * 0.12} dist={150} sweep={sweep} color={color} />
                </React.Fragment>
              );
            })}
          </span>
        ))}
      </div>
      <div
        ref={saveEl}
        className="abs e-save"
        style={{ opacity: kf(t, [[TE + 2.5, 0], [TE + 2.7, 1]]), transform: tf(0, 0, 1, kf(t, [[TE + 2.5, -8], [TE + 2.9, -3, 'expo']])) }}
      >
        {save}
      </div>
      {m && (
        <InkLayer className="e-ink" style={{ transform: `translateX(${m.dx}px)` }}>
          {ARROW.map((d, i) => <Ink key={i} t={t} t0={TE + 2.8 + i * 0.35} t1={TE + 3.15 + i * 0.3} d={d} width={8} />)}
        </InkLayer>
      )}
      <div className="abs e-ask" style={{ opacity: kf(t, [[TE + 3.3, 0], [TE + 3.7, 1]]), transform: tf(0, kf(t, [[TE + 3.3, 20], [TE + 3.9, 0, 'expo']])) }}>
        {ask}
      </div>
    </>
  );
};
