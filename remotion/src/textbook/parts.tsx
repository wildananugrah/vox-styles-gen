import React from 'react';
import { Ink, InkLayer, tf } from '../engine/anim';
import { kf, type Key } from '../engine/kf';
import { T } from './timeline';

/**
 * A book page: the one transition. Slides in from the right like a turned leaf, is pushed
 * left and shaded when the next page arrives, and drifts (slow zoom) while on screen.
 */
export const Page: React.FC<{
  t: number; start: number; next?: number; dur: number; first?: boolean; z: number; seed: number; children: React.ReactNode;
}> = ({ t, start, next, dur, first, z, seed, children }) => {
  if (t < start || (next !== undefined && t >= next + T.SLIDE)) return null;
  const xk: Key[] = first ? [[0, 0]] : [[start, 1120], [start + T.SLIDE, 0, 'inout']];
  if (next !== undefined) xk.push([next, 0], [next + T.SLIDE, -280, 'inout']);
  const end = next !== undefined ? next + T.SLIDE : dur;
  const drift = kf(t, [[start, 1], [end, next !== undefined ? 1.025 : 1.018, 'lin']]);
  return (
    <div className="page" style={{ zIndex: z, transform: tf(kf(t, xk), 0) }}>
      <Foxing seed={seed} />
      <div className="gutter" />
      <div className="frame" />
      <div className="drift" style={{ transform: tf(0, 0, drift) }}>{children}</div>
      {next !== undefined && <div className="shade" style={{ opacity: kf(t, [[next, 0], [next + T.SLIDE, 0.5, 'inout']]) }} />}
    </div>
  );
};

/** Age spots on the paper, placed deterministically per page. */
const Foxing: React.FC<{ seed: number }> = ({ seed }) => {
  const spots = Array.from({ length: 5 }, (_, i) => {
    const r = (k: number) => (Math.sin(seed * 91.7 + i * 37.3 + k * 13.1) + 1) / 2;
    const s = 60 + r(1) * 160;
    return <div key={i} className="fox" style={{ left: r(2) * 1000 - s / 2, top: r(3) * 1820 - s / 2, width: s, height: s }} />;
  });
  return <>{spots}</>;
};

/** Running head with folio, and the rule under it drawn across. */
export const RunningHead: React.FC<{ t: number; t0: number; left: string; folio: number }> = ({ t, t0, left, folio }) => (
  <>
    <div className="rh" style={{ opacity: kf(t, [[t0, 0], [t0 + 0.4, 1]]) }}>
      <span>{left}</span>
      <span>{folio}</span>
    </div>
    <div className="rh-rule" style={{ transform: `scaleX(${kf(t, [[t0, 0], [t0 + 0.7, 1, 'inout']])})` }} />
  </>
);

/** Words that rise out of their masks one after another. */
export const Rise: React.FC<{ t: number; t0: number; text: string; step?: number; dist?: number }> = ({ t, t0, text, step = 0.07, dist = 120 }) => (
  <>
    {text.split(/\s+/).map((w, i) => (
      <React.Fragment key={i}>
        {i > 0 && ' '}
        <span className="m">
          <span className="w" style={{ transform: tf(0, kf(t, [[t0 + i * step, dist], [t0 + i * step + 0.7, 0, 'expo']])) }}>{w}</span>
        </span>
      </React.Fragment>
    ))}
  </>
);

export const fade = (t: number, t0: number, d = 0.4, y = 18) => ({
  opacity: kf(t, [[t0, 0], [t0 + d, 1]]),
  transform: tf(0, kf(t, [[t0, y], [t0 + d + 0.2, 0, 'out']])),
});

/** Engraved-style divider: two rules running out from a diamond. */
export const Ornament: React.FC<{ t: number; t0: number; y: number; half?: number }> = ({ t, t0, y, half = 230 }) => (
  <InkLayer className="dark">
    <g>
      <Ink t={t} t0={t0} t1={t0 + 0.5} d={`M524 ${y} L${540 - half} ${y}`} width={2.5} />
      <Ink t={t} t0={t0} t1={t0 + 0.5} d={`M556 ${y} L${540 + half} ${y}`} width={2.5} />
      <Ink t={t} t0={t0 + 0.2} t1={t0 + 0.6} d={`M540 ${y - 16} L556 ${y} L540 ${y + 16} L524 ${y} Z`} width={3} />
      <Ink t={t} t0={t0 + 0.4} t1={t0 + 0.8} d={`M${540 - half - 8} ${y} m-10 0 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0`} width={2} />
      <Ink t={t} t0={t0 + 0.4} t1={t0 + 0.8} d={`M${540 + half + 8} ${y} m-10 0 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0`} width={2} />
    </g>
  </InkLayer>
);

export const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];
