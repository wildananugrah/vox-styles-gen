import React from 'react';
import { Img, staticFile } from 'remotion';
import { kf } from '../engine/kf';
import { camera, toFig } from '../textbook/scenes';
import type { PlateTimes, Timeline } from '../textbook/timeline';
import { Backdrop, boil, Burst, Jelly, Juice, Mascot, Paper, pop, PopWords, q, THEMES, type Theme } from './parts';
import type { PaperContent } from './schema';
import { beat, Boombox, useVibe } from './vibe';

type C = PaperContent;
const LET = 'abcdefg';
const PLATE_THEMES = ['mint', 'butter', 'coral', 'lilac'];
const PASTELS = ['#FFFDF7', '#FFF3DF'];

/** Slide in from the left on twos (stop-motion), from `dx` px away. */
const slideX = (t: number, t0: number, dx = -1100, d = 0.5) => kf(q(t), [[t0, dx], [t0 + d, 0, 'out']]);
/** Drop in from above on twos with a little settle. */
const drop = (t: number, t0: number, dy = -260, d = 0.5) => kf(q(t), [[t0, dy], [t0 + d * 0.7, 10, 'out'], [t0 + d, 0, 'inout']]);
const seen = (t: number, t0: number) => (t >= t0 ? 1 : 0);
/** Beat pulse, only in the hip-hop vibe. */
const usePulse = (t: number) => (useVibe() === 'hiphop' ? beat(t) : 0);

// ---------------------------------------------------------------- hook: pop quiz on the set
export const Hook: React.FC<{ t: number; h: C['hook'] }> = ({ t, h }) => {
  const th = THEMES.hook;
  const STAMP = 2.75;
  const hip = useVibe() === 'hiphop';
  const lineCols = ['#FFFDF7', '#FFE6A8', '#FFFDF7'];
  return (
    <>
      <Backdrop t={t} th={th} seed={3} />
      <Paper x={70} y={180} w={Math.max(330, h.kicker.length * (hip ? 30 : 24) + 70)} h={86} color="#FFD66E" seed={11} rot={-4} scale={pop(t, 0.05)} depth={1}>
        <div className="h" style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', fontSize: hip ? 40 : 46, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h.kicker}</div>
      </Paper>
      {h.question.map((line, i) => (
        <Paper key={i} x={60 + (i % 2) * 40} y={300 + i * 140} w={line.length * (hip ? 58 : 50) + 80} h={124} color={lineCols[i % 3]} seed={20 + i}
          rot={[-1.5, 1.2, -0.8][i]} depth={1.4} style={{ transform: `translateX(${slideX(t, 0.2 + i * 0.22)}px) rotate(${[-1.5, 1.2, -0.8][i]}deg)` }}>
          <div className="q-line" style={{ left: 0, top: 0, height: '100%' }}>{line}</div>
        </Paper>
      ))}
      <Juice t={t} x={90} y={790} />
      <Jelly t={t} x={660} y={930} />
      <Mascot t={t} x={370} y={760} size={330} mood={t >= STAMP ? 'shock' : 'happy'} />
      {h.options.map((o, i) => {
        const right = i === h.answer;
        const hit = t >= 2.15;
        const s = pop(t, 1.1 + i * 0.15) * (right && hit ? kf(q(t), [[2.15, 1], [2.3, 1.15], [2.45, 1.08]]) : 1);
        return (
          <Paper key={i} x={70 + i * 490} y={1230} w={450} h={120} seed={40 + i} depth={1.6}
            color={hit ? (right ? '#9FD8B6' : '#E9DCD3') : '#FFFDF7'} scale={s} rot={i ? 2 : -2}
            style={{ opacity: hit && !right ? 0.7 : 1 }}>
            <div className="opt" style={{ height: '100%' }}><b>{'AB'[i]}</b>{o}</div>
          </Paper>
        );
      })}
      <div className="abs" style={{ left: 250, top: 420, width: 740, height: 330, transform: `scale(${pop(t, STAMP, 0.3)}) rotate(-8deg)` }}>
        <Burst w={740} h={330} color="#F28C7A" seed={5} />
        <div className="burst-t">{h.stamp}</div>
      </div>
    </>
  );
};

// ---------------------------------------------------------------- cover: paper-tile title + mascot speech bubble
export const Cover: React.FC<{ t: number; t0: number; c: C['cover'] }> = ({ t, t0, c }) => {
  const th = THEMES.cover;
  const tileCols = ['#F7B7A3', '#FFD66E', '#9FD8B6', '#C7B3EE', '#9CCBEA', '#F49AB0'];
  const words = c.title.toUpperCase().split(' ');
  let n = 0;
  const textAt = t0 + 2.6;
  const hip = useVibe() === 'hiphop';
  return (
    <>
      <Backdrop t={t} th={th} seed={8} />
      <div className="abs c-sub" style={{ top: 150, opacity: seen(t, t0 + 0.7) }}>{c.series} · {c.chapter}</div>
      {words.map((w, wi) => {
        const size = Math.min(150, Math.floor(960 / w.length));
        return w.split('').map((ch, i) => {
          const k = n++;
          const x = 540 - (w.length * size) / 2 + i * size;
          return (
            <Paper key={`${wi}-${i}`} x={x + 4} y={220 + wi * (size + 18)} w={size - 8} h={size - 8} seed={60 + k} depth={1.3}
              color={tileCols[k % tileCols.length]} rot={(rnd2(k) - 0.5) * 9} scale={pop(t, t0 + 0.8 + k * 0.07)}>
              <div className="tile" style={{ height: '100%', fontSize: size * 0.72 }}>{ch}</div>
            </Paper>
          );
        });
      })}
      <Paper x={170} y={575} w={740} h={110} color="#F28C7A" seed={90} depth={1.6} rot={-2} scale={pop(t, t0 + 1.7)}>
        <div className="ribbon" style={{ height: '100%' }}>{c.subtitle}</div>
      </Paper>
      <div className="abs c-sub" style={{ top: 712, opacity: seen(t, t0 + 2.0) }}>{c.sub}</div>
      <Paper x={70} y={800} w={940} h={420} color="#FFFDF7" seed={95} depth={1.8} rot={1} scale={pop(t, t0 + 2.2)}>
        <div className="bubble">
          <span className="lead">{c.introHead}</span>
          <PopWords t={t} t0={textAt} text={c.intro} step={0.11} />
        </div>
      </Paper>
      <svg className="abs sh1" width={120} height={90} style={{ left: 300, top: 1205, opacity: seen(t, t0 + 2.3) }}>
        <path d="M10 0 L110 0 L30 86 Z" fill="#FFFDF7" />
      </svg>
      <Mascot t={t} x={90} y={1210} size={260} mood={t >= textAt && t < textAt + 2.6 ? 'talk' : 'happy'} />
      {hip && <div style={{ opacity: seen(t, t0 + 2.4) }}><Boombox t={t} x={650} y={1270} w={330} /></div>}
    </>
  );
};
const rnd2 = (k: number) => {
  const x = Math.sin(k * 91.3) * 9999;
  return x - Math.floor(x);
};

// ---------------------------------------------------------------- plates: photo diorama + item strips
const ROW_Y0 = 880, ROW_H = 124;

export const Plate: React.FC<{ t: number; p: C['plates'][number]; tm: PlateTimes; idx: number; badge?: string }> = ({ t, p, tm, idx, badge }) => {
  const th: Theme = THEMES[PLATE_THEMES[idx % PLATE_THEMES.length]];
  const P = tm.start;
  const pulse = usePulse(t);
  const cam = camera(q(t), p.items.map((it) => it.focus), tm);
  const active = (k: number) => t >= tm.items[k] && t < (tm.items[k + 1] ?? tm.tail);
  const cardB = boil(t, 300 + idx, 0.8, 0.25);
  return (
    <>
      <Backdrop t={t} th={th} seed={12 + idx * 5} />
      <Paper x={66} y={150} w={160} h={160} color={th.accent} seed={120 + idx} amp={7} depth={1.5} rot={-5} scale={pop(t, P + 0.5)}
        style={{ borderRadius: '50%' }}>
        <div className="badge" style={{ height: '100%' }}><small>{badge ?? 'LEVEL'}</small>{badge ? String(idx + 1).padStart(2, '0') : idx + 1}</div>
      </Paper>
      <div className="abs p-title" style={{ transform: `translateX(${slideX(t, P + 0.6, 900)}px) scale(${1 + pulse * 0.035})`, transformOrigin: '0 50%' }}>{p.title}</div>
      <div className="abs p-sub" style={{ opacity: seen(t, P + 0.95), color: p.warn ? th.accent : undefined }}>{p.sub}</div>

      <div className="abs" style={{ left: 0, top: 0, width: 1080, height: 1920, transform: `translateY(${drop(t, P + 0.6, -900, 0.6)}px) translate(${cardB.x}px,${cardB.y}px) rotate(${cardB.r - 0.8}deg)` }}>
        <Paper x={30} y={350} w={1020} h={425} color="#FFFDF7" seed={140 + idx} amp={7} depth={2} />
        <div className="fig">
          <div className="fig-layer" style={{ transform: `translate(${cam.x}px,${cam.y}px) scale(${cam.s})` }}>
            <Img src={staticFile(p.image)} />
            {p.items.map((it, k) =>
              it.labels.map((r, j) => {
                const b = toFig(r, 4);
                const on = active(k);
                const s = on ? kf(q(t), [[tm.items[k] + 0.5, 1], [tm.items[k] + 0.65, 1.22], [tm.items[k] + 0.8, 1.12]]) : 1;
                return (
                  <div key={`${k}-${j}`} className="tag"
                    style={{ left: b.x, top: b.y, width: b.w, height: b.h, background: on ? '#FFE07A' : '#FFF8EC', transform: `scale(${s}) rotate(${(rnd2(k * 7 + j) - 0.5) * 6}deg)` }}>
                    <b style={{ background: th.accent }}>{LET[k]}</b>
                    <span style={{ opacity: t >= tm.items[k] ? 1 : 0 }}>{it.fig}</span>
                  </div>
                );
              }),
            )}
          </div>
        </div>
        <div className="tape" style={{ left: 40, top: 334, transform: 'rotate(-14deg)' }} />
        <div className="tape" style={{ left: 890, top: 334, transform: 'rotate(12deg)' }} />
      </div>
      <div className="abs cap hand" style={{ opacity: seen(t, P + 1.2) }}>{p.caption}</div>

      {p.items.map((it, k) => {
        const ti = tm.items[k];
        if (t < ti) return null;
        const dim = t < tm.tail && !active(k) ? 0.55 : 1;
        const rot = (rnd2(k + idx * 9) - 0.5) * 1.6;
        return (
          <Paper key={k} x={56} y={ROW_Y0 + k * ROW_H} w={968} h={108} seed={200 + idx * 10 + k} depth={1.1} color={PASTELS[k % 2]}
            style={{ opacity: dim, transform: `translateX(${slideX(t, ti)}px) rotate(${rot}deg)` }}>
            <div className="row" style={{ height: '100%' }}>
              <span className="row-let" style={{ background: th.accent }}>{LET[k]}</span>
              <div className="row-txt">
                <div className="row-n">{it.n}</div>
                <div className="row-note" style={{ opacity: seen(t, ti + 0.4) }}>{it.note}</div>
              </div>
              <Paper x={0} y={0} w={190} h={76} color={th.far} seed={260 + k} depth={0.8} rot={(k % 2 ? 3 : -3)} scale={pop(t, ti + 0.55)}
                style={{ position: 'relative', flex: 'none' }}>
                <div className="val" style={{ height: '100%' }}>{it.v}</div>
              </Paper>
            </div>
          </Paper>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------- notes: three index cards
const CARD = [{ y: 370, h: 280 }, { y: 680, h: 280 }, { y: 990, h: 480 }];
const CARD_COL = ['#FFFDF7', '#FFF3DF', '#FFFDF7'];

export const Notes: React.FC<{ t: number; n: C['notes']; tl: Timeline; idx: number; badge?: string }> = ({ t, n, tl, idx, badge }) => {
  const th = THEMES.lilac;
  const N = tl.notes.start;
  const pulse = usePulse(t);
  const top = Math.max(...n.points.flatMap((p) => p.bars?.map((b) => b.hi) ?? [0]));
  const barCols = ['#9FD8B6', '#F7B7A3'];
  return (
    <>
      <Backdrop t={t} th={th} seed={40} />
      <Paper x={66} y={150} w={160} h={160} color={th.accent} seed={330} amp={7} depth={1.5} rot={4} scale={pop(t, N + 0.5)}>
        <div className="badge" style={{ height: '100%' }}><small>{badge ?? 'LEVEL'}</small>{badge ? String(idx + 1).padStart(2, '0') : idx + 1}</div>
      </Paper>
      <div className="abs p-title" style={{ transform: `translateX(${slideX(t, N + 0.6, 900)}px) scale(${1 + pulse * 0.035})`, transformOrigin: '0 50%' }}>{n.title}</div>
      <div className="abs p-sub" style={{ opacity: seen(t, N + 0.95) }}>{n.sub}</div>
      {n.points.map((p, i) => {
        const tp = tl.notes.points[i];
        if (t < tp) return null;
        const next = tl.notes.points[i + 1];
        const dim = next !== undefined && t >= next ? 0.6 : 1;
        const c = CARD[i];
        return (
          <Paper key={i} x={60} y={c.y} w={960} h={c.h} seed={340 + i} depth={1.6} color={CARD_COL[i]} rot={[-1.2, 1, -0.6][i]}
            style={{ opacity: dim, transform: `translateY(${drop(t, tp)}px) rotate(${[-1.2, 1, -0.6][i]}deg)` }}>
            <div className="tape" style={{ left: 400, top: -18, transform: 'rotate(-3deg)' }} />
            <div className="n-card">
              <div className="n-h"><b style={{ background: th.accent }}>{i + 1}</b>{p.h}</div>
              <div className="n-b" style={{ opacity: seen(t, tp + 0.45) }}>{p.b}</div>
              {p.bars && (
                <div style={{ marginTop: 26 }}>
                  {p.bars.map((b, j) => {
                    const g = kf(q(t), [[tp + 1.3 + j * 0.3, 0], [tp + 2.1 + j * 0.3, 1, 'out']]);
                    const w = (b.hi / top) * 560;
                    return (
                      <div key={j} className="bar-row" style={{ opacity: seen(t, tp + 1.15 + j * 0.3) }}>
                        <span className="bar-lab">{b.label}</span>
                        <div style={{ position: 'relative', width: w * g, height: 56 }}>
                          <Paper x={0} y={0} w={Math.max(8, (b.lo / b.hi) * w * g)} h={56} color={barCols[j % 2]} seed={380 + j} depth={0.9} />
                          {b.hi > b.lo && (
                            <Paper x={(b.lo / b.hi) * w * g} y={4} w={Math.max(4, (1 - b.lo / b.hi) * w * g)} h={48} color={barCols[j % 2]} seed={390 + j} depth={0.5}
                              style={{ opacity: 0.5 }} />
                          )}
                        </div>
                        <span className="bar-v" style={{ opacity: seen(t, tp + 2.1 + j * 0.3) }}>{b.v}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Paper>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------- end: save sticker, ask, sources
export const End: React.FC<{ t: number; t0: number; e: C['end'] }> = ({ t, t0, e }) => {
  const th = THEMES.cover;
  const hip = useVibe() === 'hiphop';
  return (
    <>
      <Backdrop t={t} th={th} seed={60} />
      <div className="abs" style={{ left: 90, top: 230, width: 900, height: 420, transform: `scale(${pop(t, t0 + 0.9, 0.4)}) rotate(-4deg)` }}>
        <Burst w={900} h={420} color="#FFD66E" seed={61} />
        <div className="abs e-save" style={{ inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{e.save}</div>
      </div>
      <Paper x={90} y={720} w={900} h={250} color="#FFFDF7" seed={410} depth={1.6} rot={1.5}
        style={{ transform: `translateX(${slideX(t, t0 + 1.6, 1100)}px) rotate(1.5deg)` }}>
        <div className="e-ask">{e.ask}</div>
      </Paper>
      <Paper x={110} y={1030} w={560} h={250} color="#E6F4E8" seed={420} depth={1.2} rot={-2}
        style={{ transform: `translateY(${drop(t, t0 + 2.3, -1200, 0.6)}px) rotate(-2deg)` }}>
        <div className="tape" style={{ left: 200, top: -18, transform: 'rotate(4deg)' }} />
        <div className="e-src">
          <b>{e.refsHead}</b>
          {e.refs.map((r, i) => <div key={i}>• {r}</div>)}
        </div>
      </Paper>
      <Mascot t={t} x={700} y={1060} size={290} mood="wave" />
      {hip && <div style={{ opacity: seen(t, t0 + 2.8) }}><Boombox t={t} x={150} y={1320} w={300} color="#9FD8B6" /></div>}
    </>
  );
};
