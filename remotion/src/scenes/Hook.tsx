import React, { useRef } from 'react';
import { Ink, InkLayer, Sweep, tf } from '../engine/anim';
import { kf } from '../engine/kf';
import { underlinePath } from '../engine/loopPath';
import { layoutBox, useMeasure } from '../engine/measure';
import { parseMarkup, type Vars } from '../markup';

// 0 - 5.7 s: clickbait strips slam in and get crossed out, then a taped card asks the question.
// Strip slots keep the old fixed positions and colours, in DOM (stacking) order.
const SLOTS = [
  { c: 'k', left: 56, top: 250 }, { c: 'y', left: 240, top: 420 }, { c: 'p', left: 50, top: 590 },
  { c: 'r', left: 640, top: 120 }, { c: 'p', left: 110, top: 1240 }, { c: 'y', left: 470, top: 1380 },
  { c: 'k', left: 60, top: 1500 },
];
const ROTS = [-6, 4, -3, 7, -4, -5, 3];
const CROSS = ['M40 300 L1010 350 L70 470 L1020 520 L60 620 L960 690', 'M50 1270 L1000 1300 L80 1410 L1010 1450 L70 1550 L980 1590'];
// each line is on the card from a to b (the last one stays)
const WINDOWS: [number, number][] = [[0.75, 2.6], [2.7, 4.05], [4.15, 99]];

export const Hook: React.FC<{ t: number; strips: string[]; lines: string[]; vars: Vars }> = ({ t, strips, lines, vars }) => {
  const drift = useRef<HTMLDivElement>(null);
  const stripEls = useRef<(HTMLDivElement | null)[]>([]);
  const ulEls = useRef<(HTMLSpanElement | null)[]>([]);

  const m = useMeasure(() => {
    stripEls.current.forEach((el, i) => {
      const right = el ? el.offsetLeft + el.offsetWidth : 0;
      if (right > 1080) console.warn(`hook strip ${i + 1} right edge at ${right} > 1080: shorten "${strips[i]}"`);
    });
    return { ul: ulEls.current.map((el) => (el ? layoutBox(el, drift.current!) : null)) };
  }, 'hook');

  return (
    <div ref={drift} style={{ position: 'absolute', inset: 0 }}>
      {SLOTS.map((s, i) => {
        const t0 = 0.1 + i * 0.17;
        return (
          <div
            key={i}
            ref={(el) => { stripEls.current[i] = el; }}
            className={`strip ${s.c}`}
            style={{
              left: s.left, top: s.top,
              opacity: kf(t, [[t0, 0], [t0 + 0.08, 1, 'lin'], [2.75, 1], [3.2, 0.32, 'inout']]),
              transform: tf(0, 0, kf(t, [[t0, 1.35], [t0 + 0.35, 1, 'expo']]), kf(t, [[t0, ROTS[i] * 2.2], [t0 + 0.35, ROTS[i], 'expo']])),
            }}
          >
            {strips[i]}
          </div>
        );
      })}
      <InkLayer>
        <g strokeWidth={16}>
          {CROSS.map((d, i) => <Ink key={i} t={t} t0={2.55 + i * 0.18} t1={2.95 + i * 0.18} d={d} />)}
        </g>
      </InkLayer>

      <div
        className="msg"
        style={{
          opacity: kf(t, [[0.55, 0], [0.7, 1, 'lin']]),
          transform: tf(0, 0, kf(t, [[0.55, 1.15], [1.0, 1, 'expo']]), kf(t, [[0.55, -4], [1.0, -1.2, 'expo']])),
        }}
      >
        <div className="tape" style={{ left: '50%', top: -26, marginLeft: -95, transform: 'rotate(-3deg)' }} />
        {lines.map((line, li) => {
          const [a, b] = WINDOWS[li];
          let hl = 0;
          return (
            <div
              key={li}
              className="line"
              style={{
                opacity: kf(t, [[a, 0], [a + 0.25, 1], [b - 0.2, 1], [b, 0, 'inout']]),
                transform: tf(0, kf(t, [[a, 40], [a + 0.5, 0, 'expo']])),
              }}
            >
              <div>
                {parseMarkup(line, vars).map((g, gi) => {
                  if (g.kind === 'hl') {
                    const k = hl++;
                    return <span key={gi} className="hlwrap">{g.text}<Sweep t={t} t0={a + 0.4 + k * 0.25} d={[0.3, 0.45][k]} /></span>;
                  }
                  if (g.kind === 'ul') return <span key={gi} className="hlwrap" ref={(el) => { ulEls.current[li] = el; }}>{g.text}</span>;
                  return <React.Fragment key={gi}>{g.text}</React.Fragment>;
                })}
              </div>
            </div>
          );
        })}
      </div>

      {m?.ul.map((box, li) => {
        if (!box) return null;
        const [a, b] = WINDOWS[li];
        return (
          <InkLayer key={li} style={{ opacity: kf(t, [[b - 0.2, 1], [b, 0]]) }}>
            <Ink t={t} t0={a + 0.45} t1={a + 0.85} d={underlinePath(box)} width={11} />
          </InkLayer>
        );
      })}
    </div>
  );
};
