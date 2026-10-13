import React, { useRef } from 'react';
import { Sweep, tf } from '../engine/anim';
import { kf, type Key } from '../engine/kf';
import { useMeasure } from '../engine/measure';
import type { Content } from '../schema';
import { CARD_STEP, type ChapterTimes } from '../timeline';

type Ch = Content['chapters'][number];
const nn = (n: number) => String(n).padStart(2, '0');
const ROT = [-1.1, 0.9, -0.5, 1.2], TAPE = [2, -3, 1.5, -2], STAMP = [-9, 7, -5, 10];
const STACK_TOP = 350, GAP = 30, SAFE_BOTTOM = 1520;

type Fit = { font: number; wrap: boolean[]; tops: number[]; stackEnd: number; num: [number, number]; ttl: [number, number] };

/**
 * Largest card font (46 -> 32 px) whose names fit on one line and whose stack ends above the
 * TikTok caption zone; below that, too-long names wrap and the fit continues down to 26 px.
 * Same loop as the old engine, run on the real DOM once per mount.
 */
function fitCards(cards: HTMLDivElement[], ci: number): Pick<Fit, 'font' | 'wrap' | 'tops' | 'stackEnd'> {
  const names = cards.map((c) => c.querySelector('.name') as HTMLDivElement);
  const stackEnd = () => cards.reduce((h, c) => h + c.offsetHeight + GAP, STACK_TOP);
  const fit = (lo: number) => {
    for (let fs = 46; fs >= lo; fs--) {
      cards.forEach((c) => (c.style.fontSize = fs + 'px'));
      const namesFit = names.every((n) => n.classList.contains('wrap') || n.scrollWidth <= n.clientWidth);
      if (namesFit && stackEnd() <= SAFE_BOTTOM) return fs;
    }
    return 0;
  };
  let font = fit(32);
  if (!font) {
    names.forEach((n) => { if (n.scrollWidth > n.clientWidth) n.classList.add('wrap'); });
    font = fit(26);
  }
  if (!font) throw new Error(`chapter ${ci + 1}: card stack ends at ${stackEnd()} > ${SAFE_BOTTOM} even at 26px. Use fewer cards or shorter tags/meta.`);
  const tops: number[] = [];
  let y = STACK_TOP;
  for (const c of cards) { tops.push(y); y += c.offsetHeight + GAP; }
  return { font, wrap: names.map((n) => n.classList.contains('wrap')), tops, stackEnd: y };
}

export const Chapter: React.FC<{ t: number; ci: number; total: number; ch: Ch; tm: ChapterTimes }> = ({ t, ci, total, ch, tm }) => {
  const num = useRef<HTMLDivElement>(null);
  const ttl = useRef<HTMLDivElement>(null);
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);
  const T = tm.start;

  const m = useMeasure<Fit>(() => {
    const f = fitCards(cardEls.current.filter((c): c is HTMLDivElement => !!c), ci);
    console.log(`chapter ${ci + 1} card font ${f.font}px stack ends at ${f.stackEnd} header at ${tm.headerAt.toFixed(1)} full at ${tm.fullAt.toFixed(1)}`);
    return { ...f, num: [num.current!.offsetWidth, num.current!.offsetHeight], ttl: [ttl.current!.offsetWidth, ttl.current!.offsetHeight] };
  }, `chapter ${ci + 1}`);

  /* big centred number + title shrink into the header in one continuous move */
  const morph = (L: number, Tp: number, [W, H]: [number, number], S: number, cx: number, cy: number) => {
    const t0 = T + 1.0, t1 = T + 1.6;
    return tf(
      kf(t, [[t0, cx - L - (W * S) / 2], [t1, 0, 'inout']]),
      kf(t, [[t0, cy - Tp - (H * S) / 2], [t1, 0, 'inout']]),
      kf(t, [[t0, S], [t1, 1, 'inout']]),
    );
  };

  return (
    <>
      <div ref={num} className="ch-num" style={m ? { transform: morph(66, 132, m.num, 3.4, 540, 760) } : undefined}>{nn(ci + 1)}</div>
      <div className="abs kicker ch-kick" style={{ opacity: kf(t, [[T + 1.45, 0], [T + 1.8, 1]]) }}>Chapter {nn(ci + 1)} / {nn(total)}</div>
      <div ref={ttl} className="ch-title" style={m ? { transform: morph(256, 196, m.ttl, Math.min(1.3, 960 / m.ttl[0]), 540, 1010) } : undefined}>{ch.title}</div>
      <div className="ch-rule" style={{ transform: `scaleX(${kf(t, [[T + 1.35, 0], [T + 1.9, 1, 'inout']])})` }} />
      <div className="ch-intro" style={{ opacity: kf(t, [[T + 0.5, 0], [T + 0.8, 1], [T + 1.0, 1], [T + 1.2, 0]]) }}>{ch.intro}</div>

      {ch.cards.map((p, k) => {
        const e = tm.cards[k], rot = ROT[k % 4];
        const ok: Key[] = [[e, 0], [e + 0.1, 1, 'lin']];
        if (k < ch.cards.length - 1) ok.push([e + CARD_STEP, 1], [e + CARD_STEP + 0.3, 0.42, 'inout'], [tm.sumT, 0.42], [tm.sumT + 0.35, 1, 'inout']);
        const style: React.CSSProperties = m
          ? {
              top: m.tops[k], fontSize: m.font, opacity: kf(t, ok),
              transform: tf(0, kf(t, [[e, -36], [e + 0.45, 0, 'expo']]), kf(t, [[e, 1.14], [e + 0.45, 1, 'expo']]), kf(t, [[e, rot + 3.5], [e + 0.45, rot, 'expo']])),
            }
          : { top: 0 };
        return (
          <div key={k} ref={(el) => { cardEls.current[k] = el; }} className="card" style={style}>
            <div className="tape" style={{ transform: `rotate(${TAPE[k % 4]}deg)` }} />
            <div className="stamp" style={{ opacity: kf(t, [[e + 0.3, 0], [e + 0.34, 1, 'lin']]), transform: tf(0, 0, kf(t, [[e + 0.3, 1.9], [e + 0.55, 1, 'expo']])) }}>
              <div className={`in${p.i.length > 2 ? ' sm' : ''}`} style={{ transform: `rotate(${STAMP[k % 4]}deg)` }}>{p.i}</div>
            </div>
            <div className={`name${m?.wrap[k] ? ' wrap' : ''}`}>{p.n}</div>
            <div className="meta">{p.meta}</div>
            <div className="tags">
              {p.tags.map((tg, j) => <span key={j} className="tag">{tg}<Sweep t={t} t0={e + 0.6 + j * 0.2} d={0.32} /></span>)}
            </div>
          </div>
        );
      })}
    </>
  );
};
