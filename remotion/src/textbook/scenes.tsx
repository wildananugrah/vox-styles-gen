import React from 'react';
import { Img, staticFile } from 'remotion';
import { Ink, InkLayer, tf } from '../engine/anim';
import { kf, type Key } from '../engine/kf';
import { loopPath } from '../engine/loopPath';
import { fade, Ornament, Rise, ROMAN, RunningHead } from './parts';
import type { TextbookContent } from './schema';
import type { PlateTimes, Timeline } from './timeline';

type C = TextbookContent;

// ---------------------------------------------------------------- hook: a quiz question
// Fixed option boxes so the pencil loop needs no measuring.
const OPT_BOX = [{ x: 240, w: 300 }, { x: 540, w: 300 }];

export const Hook: React.FC<{ t: number; h: C['hook'] }> = ({ t, h }) => {
  const ans = OPT_BOX[h.answer];
  return (
    <>
      <div className="abs q-kick" style={fade(t, 0.05, 0.3)}>{h.kicker}</div>
      <div className="abs q-text">
        {h.question.map((line, i) => (
          <div key={i}><Rise t={t} t0={0.12 + i * 0.22} text={line} /></div>
        ))}
      </div>
      <div className="abs q-opts" style={{ gap: 0 }}>
        {h.options.map((o, i) => (
          <div key={i} className="q-opt" style={{ ...fade(t, 1.1 + i * 0.15), width: OPT_BOX[i].w, textAlign: 'center' }}>
            <i>({'AB'[i]})</i>{o}
          </div>
        ))}
      </div>
      <InkLayer>
        <Ink t={t} t0={2.0} t1={2.55} d={loopPath({ x: ans.x, y: 1004, w: ans.w, h: 76 }, 20, 22)} width={7} />
      </InkLayer>
      <div
        className="stamp"
        style={{
          width: 720, marginLeft: -360,
          opacity: kf(t, [[2.75, 0], [2.8, 0.88, 'lin']]),
          transform: tf(0, 0, kf(t, [[2.75, 1.7], [3.05, 1, 'expo']]), -7),
        }}
      >
        {h.stamp}
      </div>
    </>
  );
};

// ---------------------------------------------------------------- cover / title page
export const Cover: React.FC<{ t: number; t0: number; c: C['cover'] }> = ({ t, t0, c }) => {
  const reveal = kf(t, [[t0 + 2.7, -15], [t0 + 5.0, 115, 'lin']]);
  const mask = `linear-gradient(to bottom, #000 ${reveal}%, transparent ${reveal + 12}%)`;
  return (
    <>
      <div className="abs c-series" style={fade(t, t0 + 0.8)}>{c.series}</div>
      <div className="abs c-chap" style={fade(t, t0 + 0.95)}>{c.chapter}</div>
      <div className="abs c-title"><Rise t={t} t0={t0 + 1.0} text={c.title} dist={170} /></div>
      <div className="abs c-subtitle"><Rise t={t} t0={t0 + 1.35} text={c.subtitle} dist={110} /></div>
      <Ornament t={t} t0={t0 + 1.6} y={712} />
      <div className="abs c-sub" style={fade(t, t0 + 2.0)}>{c.sub}</div>
      <div className="abs c-ih" style={fade(t, t0 + 2.3)}>{c.introHead}</div>
      <div className="abs c-intro" style={{ WebkitMaskImage: mask, maskImage: mask }}>
        <span className="dropcap">{c.intro[0]}</span>
        {c.intro.slice(1)}
      </div>
    </>
  );
};

// ---------------------------------------------------------------- plates (Fig. + table)
export const FIG_W = 980, FIG_H = 381, SRC_W = 1024, SRC_Y0 = 150, S = FIG_W / SRC_W, ZOOM = 1.42;
export const toFig = ([x1, y1, x2, y2]: number[], pad = 5) => ({
  x: x1 * S - pad, y: (y1 - SRC_Y0) * S - pad, w: (x2 - x1) * S + pad * 2, h: (y2 - y1) * S + pad * 2,
});
const ROW_Y0 = 912, ROW_H = 118;

/** Camera on the plate: overview, then a push toward each item's focus point in turn. */
export function camera(t: number, focus: number[][], tm: PlateTimes) {
  const target = (f?: number[]) => {
    if (!f) return { s: 1, x: 0, y: 0 };
    const fx = f[0] * S, fy = (f[1] - SRC_Y0) * S;
    const clamp = (v: number, lo: number) => Math.min(0, Math.max(lo, v));
    return {
      s: ZOOM,
      x: clamp(fx + (FIG_W / 2 - fx) * 0.75 - fx * ZOOM, FIG_W - FIG_W * ZOOM),
      y: clamp(fy + (FIG_H / 2 - fy) * 0.75 - fy * ZOOM, FIG_H - FIG_H * ZOOM),
    };
  };
  const stops = [
    { at: tm.items[0] - 0.05, from: 0, v: target() },
    ...tm.items.map((ti, k) => ({ at: ti + 0.75, from: ti, v: target(focus[k]) })),
    { at: tm.tail + 0.8, from: tm.tail, v: target() },
  ];
  const keys = (sel: (v: { s: number; x: number; y: number }) => number): Key[] => {
    const out: Key[] = [[stops[0].at, sel(stops[0].v)]];
    for (const st of stops.slice(1)) out.push([st.from, out[out.length - 1][1]], [st.at, sel(st.v), 'inout']);
    return out;
  };
  return { s: kf(t, keys((v) => v.s)), x: kf(t, keys((v) => v.x)), y: kf(t, keys((v) => v.y)) };
}

export const Plate: React.FC<{ t: number; p: C['plates'][number]; tm: PlateTimes; idx: number; head: string; folio: number }> = ({
  t, p, tm, idx, head, folio,
}) => {
  const P = tm.start;
  const cam = camera(t, p.items.map((it) => it.focus), tm);
  const wipe = kf(t, [[P + 0.7, 100], [P + 1.5, 0, 'inout']]);
  const active = (k: number) => t >= tm.items[k] && t < (tm.items[k + 1] ?? tm.tail);
  return (
    <>
      <RunningHead t={t} t0={P + 0.5} left={head} folio={folio} />
      <div className="abs p-head">
        <span className="p-num" style={fade(t, P + 0.55)}>{ROMAN[idx]}.</span>
        <span className="p-title"><Rise t={t} t0={P + 0.6} text={p.title} dist={100} /></span>
      </div>
      <div className={`abs p-sub${p.warn ? ' warn' : ''}`} style={fade(t, P + 0.95)}>{p.sub}</div>

      <div className="fig-wrap" style={{ opacity: kf(t, [[P + 0.6, 0], [P + 0.75, 1]]) }}>
        <div className="fig" style={{ clipPath: `inset(0 ${wipe}% 0 0)` }}>
          <div className="fig-layer" style={{ transform: `translate(${cam.x}px,${cam.y}px) scale(${cam.s})` }}>
            <Img src={staticFile(p.image)} />
            {p.items.map((it, k) =>
              it.labels.map((r, j) => {
                const b = toFig(r);
                const on = t >= tm.items[k];
                return (
                  <div key={`${k}-${j}`} className="lab" style={{ left: b.x, top: b.y, width: b.w, height: b.h }}>
                    <b>{'abcdefg'[k]}</b>
                    <span style={{ opacity: on ? 1 : 0 }}>{it.fig}</span>
                  </div>
                );
              }),
            )}
            <InkLayer>
              {p.items.map((it, k) => {
                const t0 = tm.items[k] + 0.55;
                const off = tm.items[k + 1] ?? tm.tail;
                return (
                  <g key={k} style={{ opacity: kf(t, [[off - 0.15, 1], [off + 0.15, 0]]) }}>
                    {it.labels.map((r, j) => (
                      <Ink key={j} t={t} t0={t0} t1={t0 + 0.45} d={loopPath(toFig(r), 14, 12)} width={4.5} />
                    ))}
                  </g>
                );
              })}
            </InkLayer>
          </div>
        </div>
      </div>

      <div className="abs fig-cap" style={fade(t, P + 1.25)}>
        <span className="sc">Gbr. {idx + 1}.</span>{p.caption}
      </div>
      <div className="abs tab-head" style={fade(t, P + 1.4, 0.4, 0)}>
        <span>Tabel {idx + 1} · Bahan</span>
        <span>Serat / 100 g</span>
      </div>

      {p.items.map((it, k) => {
        const ti = tm.items[k];
        const dim = t < tm.tail && !active(k) ? 0.5 : 1;
        return (
          <div key={k} className="row" style={{ top: ROW_Y0 + k * ROW_H, opacity: kf(t, [[ti, 0], [ti + 0.3, 1]]) * dim }}>
            <div className="row-l1">
              <span className="row-let">{'abcdefg'[k]}</span>
              <span className="m"><span className="row-n w" style={{ transform: tf(0, kf(t, [[ti, 60], [ti + 0.6, 0, 'expo']])) }}>{it.n}</span></span>
              <span className="leader" style={{ transform: `scaleX(${kf(t, [[ti + 0.2, 0], [ti + 0.75, 1, 'inout']])})` }} />
              <span className="row-v" style={{ opacity: kf(t, [[ti + 0.65, 0], [ti + 0.9, 1]]) }}>{it.v}</span>
            </div>
            <div className="row-note" style={fade(t, ti + 0.5)}>{it.note}</div>
          </div>
        );
      })}
      <InkLayer>
        {p.items.map((_, k) => {
          const ti = tm.items[k], y = ROW_Y0 + k * ROW_H;
          const off = tm.items[k + 1] ?? tm.tail;
          return (
            <g key={k} style={{ opacity: kf(t, [[off - 0.1, 1], [off + 0.2, 0]]) }}>
              <Ink t={t} t0={ti + 0.15} t1={ti + 0.45} d={`M70 ${y - 4} C 58 ${y + 30}, 58 ${y + 70}, 70 ${y + 100}`} width={6} />
            </g>
          );
        })}
      </InkLayer>
    </>
  );
};

// ---------------------------------------------------------------- notes (misconceptions)
const PT_Y = [400, 690, 980];
const BAR_MAX = 600;

export const Notes: React.FC<{ t: number; n: C['notes']; tl: Timeline; idx: number; head: string; folio: number }> = ({ t, n, tl, idx, head, folio }) => {
  const N = tl.notes.start;
  const top = Math.max(...n.points.flatMap((p) => p.bars?.map((b) => b.hi) ?? [0]));
  return (
    <>
      <RunningHead t={t} t0={N + 0.5} left={head} folio={folio} />
      <div className="abs p-head">
        <span className="p-num" style={fade(t, N + 0.55)}>{ROMAN[idx]}.</span>
        <span className="p-title"><Rise t={t} t0={N + 0.6} text={n.title} dist={100} /></span>
      </div>
      <div className="abs p-sub" style={fade(t, N + 0.95)}>{n.sub}</div>
      {n.points.map((p, i) => {
        const tp = tl.notes.points[i];
        const next = tl.notes.points[i + 1];
        const dim = next !== undefined && t >= next ? 0.55 : 1;
        return (
          <div key={i} className="n-pt" style={{ top: PT_Y[i], opacity: kf(t, [[tp, 0], [tp + 0.3, 1]]) * dim }}>
            <div className="n-h">
              <i>{['i', 'ii', 'iii'][i]}.</i>
              <span className="m"><span className="w" style={{ transform: tf(0, kf(t, [[tp, 80], [tp + 0.7, 0, 'expo']])) }}>{p.h}</span></span>
            </div>
            <div className="n-b" style={fade(t, tp + 0.45)}>{p.b}</div>
            {p.bars && (
              <div className="bars">
                {p.bars.map((b, j) => {
                  const g = kf(t, [[tp + 1.3 + j * 0.25, 0], [tp + 2.1 + j * 0.25, 1, 'inout']]);
                  return (
                    <div key={j} className="bar-row" style={fade(t, tp + 1.15 + j * 0.25)}>
                      <span className="bar-lab">{b.label}</span>
                      <span className="bar" style={{ width: (b.hi / top) * BAR_MAX, transform: `scaleX(${g})` }}>
                        <span className="solid" style={{ width: `${(b.lo / b.hi) * 100}%` }} />
                        {b.hi > b.lo && <span className="range" style={{ left: `${(b.lo / b.hi) * 100}%`, right: 0 }} />}
                      </span>
                      <span className="bar-v" style={{ opacity: kf(t, [[tp + 2.0 + j * 0.25, 0], [tp + 2.3 + j * 0.25, 1]]) }}>{b.v}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
      <InkLayer>
        {n.points.map((_, i) => {
          const tp = tl.notes.points[i], y = PT_Y[i];
          const next = tl.notes.points[i + 1];
          return (
            <g key={i} style={{ opacity: next !== undefined ? kf(t, [[next - 0.1, 1], [next + 0.2, 0]]) : 1 }}>
              <Ink t={t} t0={tp + 0.6} t1={tp + 1.0} d={`M178 ${y + 76} C 400 ${y + 88}, 700 ${y + 70}, 960 ${y + 82}`} width={6} />
            </g>
          );
        })}
      </InkLayer>
    </>
  );
};

// ---------------------------------------------------------------- end: references + ask
export const End: React.FC<{ t: number; t0: number; e: C['end']; head: string; folio: number }> = ({ t, t0, e, head, folio }) => (
  <>
    <RunningHead t={t} t0={t0 + 0.5} left={head} folio={folio} />
    <div className="abs e-h"><Rise t={t} t0={t0 + 0.7} text={e.refsHead} dist={100} /></div>
    {e.refs.map((r, i) => (
      <div key={i} className="ref" style={{ top: 360 + i * 150, ...fade(t, t0 + 1.1 + i * 0.3) }}>
        <i>[{i + 1}]</i><span>{r}</span>
      </div>
    ))}
    <Ornament t={t} t0={t0 + 1.8} y={760} half={200} />
    <div className="abs e-save"><Rise t={t} t0={t0 + 2.3} text={e.save} dist={120} /></div>
    <InkLayer>
      <Ink t={t} t0={t0 + 2.9} t1={t0 + 3.4} d="M200 1000 C 420 1014, 700 990, 880 1004" width={7} />
    </InkLayer>
    <div className="abs e-ask" style={fade(t, t0 + 3.2)}>{e.ask}</div>
    <div className="abs e-fin" style={fade(t, t0 + 3.8)}>— {e.fin} —</div>
  </>
);
