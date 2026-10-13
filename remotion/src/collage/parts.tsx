import React, { useMemo } from 'react';
import { Img, staticFile } from 'remotion';
import { kf, type Key } from '../engine/kf';
import { T } from './timeline';
import { C, H, W } from './styles';

// Collage toolkit: stepped stop-motion time, 6 fps jitter, pieces that slap/slide/stamp in,
// tape, strips, stamps, red marker strokes, the halftone photo block and the face badge.

/** Stop-motion clock: entrances advance on twos at 30 fps (15 steps per second). */
export const q = (t: number, fps = 15) => Math.floor(t * fps + 1e-6) / fps;

/** Deterministic pseudo-random in [0,1). */
export const rnd = (seed: number, k = 0) => {
  const x = Math.sin(seed * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Subtle stop-motion jitter, 6 new positions per second. */
export const jit = (t: number, seed: number, amp = 1) => {
  const f = Math.floor(t * 6);
  return {
    x: (rnd(seed + f * 7.3, 1) - 0.5) * 3.2 * amp,
    y: (rnd(seed + f * 7.3, 2) - 0.5) * 3.2 * amp,
    r: (rnd(seed + f * 7.3, 3) - 0.5) * 0.8 * amp,
  };
};

type Enter = 'slap' | 'stamp' | 'left' | 'right' | 'up' | 'none';

/** One collage piece: absolutely placed, enters on its time (stepped), then jitters. */
export const Piece: React.FC<{
  t: number; t0: number; x: number; y: number; rot?: number; seed: number; enter?: Enter; amp?: number;
  w?: number; h?: number; z?: number; shadow?: boolean; className?: string; style?: React.CSSProperties; children?: React.ReactNode;
}> = ({ t, t0, x, y, rot = 0, seed, enter = 'slap', amp = 1, w, h, z, shadow = true, className, style, children }) => {
  if (t < t0) return null;
  const ts = q(t);
  let dx = 0, dy = 0, s = 1, dr = 0;
  if (enter === 'slap') {
    const p = kf(ts, [[t0, 0], [t0 + 0.2, 1]]);
    s = 1 + (1 - p) * 0.22;
    dr = (1 - p) * (rnd(seed) > 0.5 ? 5 : -5);
  } else if (enter === 'stamp') {
    s = kf(ts, [[t0, 1.9], [t0 + 0.13, 0.93, 'lin'], [t0 + 0.27, 1]]);
  } else if (enter === 'left' || enter === 'right') {
    dx = kf(ts, [[t0, enter === 'left' ? -1300 : 1300], [t0 + 0.33, 0]]);
  } else if (enter === 'up') {
    dy = kf(ts, [[t0, 260], [t0 + 0.27, 0]]);
  }
  const j = jit(t, seed, amp);
  return (
    <div
      className={`pc${shadow ? ' drop' : ''} ${className ?? ''}`}
      style={{
        width: w, height: h, zIndex: z,
        transform: `translate(${x + dx + j.x}px, ${y + dy + j.y}px) rotate(${rot + dr + j.r}deg) scale(${s})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Torn-ended masking tape with a typewritten label. */
const tornEnds = (() => {
  const n = 7, pts: string[] = [];
  for (let i = 0; i <= n; i++) pts.push(`${i % 2 ? 7 : 0}px ${((i / n) * 100).toFixed(1)}%`);
  for (let i = n; i >= 0; i--) pts.push(`calc(100% - ${i % 2 ? 0 : 7}px) ${((i / n) * 100).toFixed(1)}%`);
  return `polygon(${pts.join(',')})`;
})();
export const Tape: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <span className="tape" style={{ clipPath: tornEnds, ...style }}>{children}</span>
);

/** Two little tape scraps holding a card at its top corners. */
export const Scraps: React.FC<{ seed: number }> = ({ seed }) => (
  <>
    <i className="scrap" style={{ left: -34, top: -14, transform: `rotate(${-38 + rnd(seed, 4) * 10}deg)`, clipPath: tornEnds }} />
    <i className="scrap" style={{ right: -34, top: -14, transform: `rotate(${36 - rnd(seed, 5) * 10}deg)`, clipPath: tornEnds }} />
  </>
);

export const Strip: React.FC<{ kind: 'ink' | 'yel'; size?: number; children: React.ReactNode }> = ({ kind, size, children }) => (
  <span className={`strip ${kind}`} style={size ? { fontSize: size } : undefined}>{children}</span>
);

export const Stamp: React.FC<{ children: React.ReactNode; size?: number }> = ({ children, size }) => (
  <span className="stamp" style={size ? { fontSize: size } : undefined}>{children}</span>
);

/** A marker stroke revealed along its length (stepped, like hand-drawn frames). */
export const Stroke: React.FC<{ t: number; t0: number; t1: number; d: string; width?: number; color?: string }> = ({ t, t0, t1, d, width = 9, color }) => {
  if (t < t0) return null;
  const off = kf(q(t), [[t0, 1], [t1, 0, 'inout']]);
  return <path d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={off} strokeWidth={width} style={color ? { stroke: color } : undefined} />;
};

/** Stage-sized SVG for marker strokes, jittering as one collage piece. */
export const InkLayer: React.FC<{ t: number; seed: number; children: React.ReactNode }> = ({ t, seed, children }) => {
  const j = jit(t, seed, 0.8);
  return (
    <svg className="ink" width={W} height={H} style={{ zIndex: 60, transform: `translate(${j.x}px, ${j.y}px)` }}>
      {children}
    </svg>
  );
};

/** A loose hand-drawn loop around an ellipse, spiralling in slightly and overshooting its start. */
export function loop(cx: number, cy: number, rx: number, ry: number, seed = 1): string {
  let d = '';
  const n = 90;
  for (let k = 0; k <= n; k++) {
    const a = -2.1 + (k / n) * (Math.PI * 2 + 0.5);
    const wob = 1 + 0.035 * Math.sin(2 * a + seed) + 0.02 * Math.sin(3 * a + seed * 2) - 0.05 * (k / n);
    d += `${k ? ' L' : 'M'}${(cx + Math.cos(a) * rx * wob).toFixed(1)} ${(cy + Math.sin(a) * ry * wob).toFixed(1)}`;
  }
  return d;
}

/**
 * Marker strokes that live inside a piece (so they jitter with it): an underline along the
 * bottom of the parent, or a ring around it. The parent must be position:relative; `w`/`h`
 * is its approximate size in px, which keeps the stroke width close to true pixels.
 */
export const LocalInk: React.FC<{ t: number; t0: number; t1: number; kind: 'under' | 'ring'; w: number; h: number; seed?: number }> = ({
  t, t0, t1, kind, w, h, seed = 1,
}) => {
  const ring = kind === 'ring';
  const pad = ring ? { x: 0.1 * w, y: 0.2 * h } : { x: 0, y: 0 };
  const vw = w + pad.x * 2, vh = ring ? h + pad.y * 2 : 30;
  return (
    <svg className="ink" viewBox={`0 0 ${vw} ${vh}`} preserveAspectRatio="none"
      style={ring
        ? { left: `${-(pad.x / w) * 100}%`, top: `${-(pad.y / h) * 100}%`, width: `${(vw / w) * 100}%`, height: `${(vh / h) * 100}%` }
        : { left: 0, top: '100%', width: '100%', height: 30 }}>
      <Stroke t={t} t0={t0} t1={t1} width={ring ? 9 : 8}
        d={ring ? loop(vw / 2, vh / 2, vw * 0.47, vh * 0.43, seed) : underline(-6, vw * 0.96, 12)} />
    </svg>
  );
};

/** A wobbly underline from x0 to x1 at y. */
export const underline = (x0: number, x1: number, y: number) =>
  `M${x0} ${y + 4} C ${x0 + (x1 - x0) * 0.3} ${y - 10}, ${x0 + (x1 - x0) * 0.65} ${y + 14}, ${x1} ${y - 4}`;

/** A scribbled X over a box. */
export const crossPaths = (x: number, y: number, w: number, h: number): [string, string] => [
  `M${x} ${y + 8} C ${x + w * 0.4} ${y + h * 0.35}, ${x + w * 0.6} ${y + h * 0.6}, ${x + w} ${y + h - 6}`,
  `M${x + w - 6} ${y} C ${x + w * 0.6} ${y + h * 0.4}, ${x + w * 0.35} ${y + h * 0.65}, ${x + 4} ${y + h}`,
];

/** A curvy arrow from (x0,y0) to (x1,y1) with a two-stroke head; bend > 0 bows to the left of travel. */
export function arrow(x0: number, y0: number, x1: number, y1: number, bend = 0.25): [string, string] {
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
  const nx = -(y1 - y0) * bend, ny = (x1 - x0) * bend;
  const cx = mx + nx, cy = my + ny;
  const a = Math.atan2(y1 - cy, x1 - cx), L = 30;
  const h1 = [x1 - L * Math.cos(a - 0.5), y1 - L * Math.sin(a - 0.5)];
  const h2 = [x1 - L * Math.cos(a + 0.5), y1 - L * Math.sin(a + 0.5)];
  return [`M${x0} ${y0} Q ${cx} ${cy} ${x1} ${y1}`, `M${h1[0].toFixed(1)} ${h1[1].toFixed(1)} L${x1} ${y1} L${h2[0].toFixed(1)} ${h2[1].toFixed(1)}`];
}

/** Handwriting that "writes" itself left to right (stepped clip). */
export const Hand: React.FC<{ t: number; t0: number; d?: number; size?: number; children: React.ReactNode }> = ({ t, t0, d = 0.6, size, children }) => {
  const p = kf(q(t), [[t0, 0], [t0 + d, 1, 'lin']]);
  return <span className="hand" style={{ clipPath: `inset(-20% ${(1 - p) * 100}% -20% -5%)`, fontSize: size, display: 'inline-block' }}>{children}</span>;
};

/** Halftone dots as an SVG data URI: dots grow toward one corner of the block. */
function halftone(w: number, h: number, step = 15): string {
  let dots = '';
  for (let r = 0, y = 0; y < h + step; y += step * 0.866, r++) {
    for (let x = (r % 2) * step * 0.5; x < w + step; x += step) {
      const f = Math.max(0, 1 - Math.hypot((w - x) / w, (h * 0.75 - y) / h) * 1.05);
      const rad = 0.6 + f * f * step * 0.42;
      dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rad.toFixed(2)}"/>`;
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><g fill="${C.ink}" fill-opacity=".5">${dots}</g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/** The yellow halftone block a photo sits on. */
export const Block: React.FC<{ w: number; h: number }> = ({ w, h }) => {
  const bg = useMemo(() => halftone(w, h), [w, h]);
  return <div className="block" style={{ width: w, height: h, backgroundImage: bg }} />;
};

/** The black-and-white sticker cutout of the speaker (prepared by scripts/cutout.mjs). */
export const Cutout: React.FC<{ src: string; w: number }> = ({ src, w }) => (
  <Img src={staticFile(src)} style={{ width: w, display: 'block' }} />
);

/** Round face badge: sticker rim, ink ring with typed text that ticks round, face on yellow. */
export const Badge: React.FC<{ t: number; face: string; text: string; size?: number; id: string }> = ({ t, face, text, size = 200, id }) => {
  const spin = Math.floor(t * 6) * 1.5;
  return (
    <svg width={size} height={size} viewBox="-100 -100 200 200" style={{ display: 'block' }}>
      <defs>
        <path id={`ring-${id}`} d="M -75 0 A 75 75 0 1 1 75 0 A 75 75 0 1 1 -75 0" />
        <clipPath id={`face-${id}`}><circle r={56} /></clipPath>
      </defs>
      <circle r={99} fill={C.card} />
      <circle r={92} fill={C.ink} />
      <g transform={`rotate(${spin})`}>
        <text fill={C.yellow} style={{ font: "700 17px 'Courier Prime', monospace", letterSpacing: 3.1 }}>
          <textPath href={`#ring-${id}`}>{text}</textPath>
        </text>
      </g>
      <circle r={58} fill={C.yellow} />
      <image href={staticFile(face)} x={-58} y={-58} width={116} height={116} clipPath={`url(#face-${id})`} />
      <circle r={57} fill="none" stroke={C.card} strokeWidth={4} />
    </svg>
  );
};

/** A caption whose words rise in one by one; ==spans== get a highlighter sweep afterwards. */
export const Caption: React.FC<{ t: number; t0: number; text: string; style?: React.CSSProperties; size?: number }> = ({ t, t0, text, style, size }) => {
  const words = useMemo(() => {
    // `tail` is unhighlighted text glued to a word, e.g. the "?" in "==ditolak==?"
    const out: { text: string; hl: number; tail: string }[] = [];
    let n = 0;
    text.split(/(==.+?==)/).forEach((part) => {
      const m = part.match(/^==(.+)==$/);
      const ws = (m ? m[1] : part).split(/\s+/).filter(Boolean);
      if (m) n++;
      else if (ws.length && out.length && !/^\s/.test(part)) out[out.length - 1].tail += ws.shift();
      ws.forEach((w) => out.push({ text: w, hl: m ? n : 0, tail: '' }));
    });
    return out;
  }, [text]);
  const step = 0.05;
  const sweep0 = t0 + words.length * step + 0.35;
  return (
    <div className="cap" style={{ fontSize: size, ...style }}>
      {words.map((w, i) => {
        const a = t0 + i * step;
        const p = kf(t, [[a, 0], [a + 0.28, 1]]);
        const joinNext = w.hl > 0 && !w.tail && words[i + 1]?.hl === w.hl;
        const sw = w.hl ? kf(t, [[sweep0 + (w.hl - 1) * 0.45, 0], [sweep0 + (w.hl - 1) * 0.45 + 0.4, 1, 'inout']]) : 0;
        const body = w.hl
          ? <span className="hl" style={{ backgroundSize: `${sw * 100}% 74%` }}>{w.text}{joinNext ? ' ' : ''}</span>
          : w.text;
        return (
          <span key={i} className="cw" style={{ opacity: p, transform: `translateY(${(1 - p) * 18}px)` }}>
            {body}{w.tail}{joinNext || i === words.length - 1 ? '' : ' '}
          </span>
        );
      })}
    </div>
  );
};

/** A scene sheet: slides in from the right on twos with a slight turn, darkens when covered. */
export const Sheet: React.FC<{ t: number; start: number; next?: number; first?: boolean; z: number; children: React.ReactNode }> = ({
  t, start, next, first, z, children,
}) => {
  if (t < start || (next !== undefined && t >= next + T.SLIDE)) return null;
  const ts = q(t);
  const xk: Key[] = first ? [[0, 0]] : [[start, 1180], [start + T.SLIDE, 0, 'out']];
  const rk: Key[] = first ? [[0, 0]] : [[start, 6], [start + T.SLIDE, 0, 'out']];
  return (
    <div className="sheet" style={{ zIndex: z, transform: `translateX(${kf(ts, xk)}px) rotate(${kf(ts, rk)}deg)` }}>
      <div className="fiber" />
      {children}
      {next !== undefined && <div className="shade" style={{ opacity: kf(ts, [[next, 0], [next + T.SLIDE, 0.4]]) }} />}
    </div>
  );
};
