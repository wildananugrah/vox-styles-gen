import React from 'react';
import {
  arrow, Badge, Block, Caption, crossPaths, Cutout, Hand, InkLayer, LocalInk, loop, Piece, Scraps, Stamp, Strip, Stroke, Tape, underline,
} from './parts';
import type { CollageContent, Lesson } from './schema';

// The five scene layouts on the 1080x1350 stage. Times are seconds from the scene's start s.

type P = CollageContent['photo'];

/** Cutout proportions and face centre as fractions of its width/height (scripts/cutout.mjs output). */
const CUT = { aspect: 1571 / 1068, faceX: 0.54, faceY: 0.238 };

/** Face centre of the cutout placed at (x, y) with width w (fractions measured on the photo). */
const face = (x: number, y: number, w: number) => ({ x: x + w * CUT.faceX, y: y + w * CUT.aspect * CUT.faceY });

export const Hook: React.FC<{ t: number; s: number; h: CollageContent['hook']; photo: P }> = ({ t, s, h, photo }) => {
  const cx = 330, cy = 360, cw = 780, f = face(cx, cy, cw);
  const [a1, a2] = arrow(330, 690, f.x - 150, f.y + 40, -0.3);
  return (
    <>
      <Piece t={t} t0={s + 0.1} x={450} y={340} rot={2.5} seed={11}><Block w={600} h={1100} /></Piece>
      <Piece t={t} t0={s + 0.3} x={cx} y={cy} seed={12} amp={0.6}><Cutout src={photo.cutout} w={cw} /></Piece>
      <Piece t={t} t0={s + 0.05} x={56} y={56} rot={-3} seed={13}><Tape>{h.tape}</Tape></Piece>
      <Piece t={t} t0={s + 0.45} x={36} y={140} rot={-4} seed={14} enter="left"><Strip kind="ink" size={102}>{h.strips[0]}</Strip></Piece>
      <Piece t={t} t0={s + 0.7} x={110} y={262} rot={2} seed={15} enter="right"><Strip kind="yel" size={100}>{h.strips[1]}</Strip></Piece>
      <Piece t={t} t0={s + 1.0} x={50} y={1000} w={600} rot={-1.5} seed={16} className="card" style={{ padding: '30px 36px 32px' }}>
        <Scraps seed={16} />
        <Caption t={t} t0={s + 1.15} text={h.caption} size={50} />
      </Piece>
      <Piece t={t} t0={s + 2.0} x={60} y={600} rot={-7} seed={17} shadow={false}><Hand t={t} t0={s + 2.0} size={66}>{h.note}</Hand></Piece>
      <Piece t={t} t0={s + 2.7} x={660} y={1170} rot={-11} seed={18} enter="stamp" shadow={false}><Stamp>{h.stamp}</Stamp></Piece>
      <InkLayer t={t} seed={19}>
        <Stroke t={t} t0={s + 1.5} t1={s + 2.1} d={loop(f.x, f.y - 25, 160, 190, 2)} />
        <Stroke t={t} t0={s + 2.3} t1={s + 2.6} d={a1} width={7} />
        <Stroke t={t} t0={s + 2.55} t1={s + 2.7} d={a2} width={7} />
      </InkLayer>
    </>
  );
};

export const Intro: React.FC<{ t: number; s: number; c: CollageContent['intro']; n: number; photo: P }> = ({ t, s, c, n, photo }) => {
  const [a1, a2] = arrow(150, 800, 210, 960, 0.35);
  return (
    <>
      <Piece t={t} t0={s + 0.35} x={640} y={470} rot={-2} seed={21}><Block w={420} h={920} /></Piece>
      <Piece t={t} t0={s + 0.5} x={500} y={460} seed={22} amp={0.6}><Cutout src={photo.cutout} w={620} /></Piece>
      <Piece t={t} t0={s + 0.1} x={56} y={56} rot={-2} seed={23}><Tape>{c.tape}</Tape></Piece>
      <Piece t={t} t0={s + 0.3} x={64} y={128} seed={24} enter="stamp" shadow={false}><span className="num" style={{ fontSize: 520 }}>{n}</span></Piece>
      <Piece t={t} t0={s + 0.6} x={330} y={176} rot={-3} seed={25} enter="right"><Strip kind="yel" size={140}>{c.strips[0]}</Strip></Piece>
      <Piece t={t} t0={s + 0.8} x={372} y={330} rot={2} seed={26} enter="right"><Strip kind="ink" size={140}>{c.strips[1]}</Strip></Piece>
      <Piece t={t} t0={s + 1.1} x={70} y={580} seed={27} enter="up" shadow={false}><span className="quote" style={{ fontSize: 74 }}>{c.quote}</span></Piece>
      <Piece t={t} t0={s + 1.6} x={50} y={1000} w={560} rot={-1.2} seed={28} className="card" style={{ padding: '30px 36px 32px' }}>
        <Scraps seed={28} />
        <Caption t={t} t0={s + 1.75} text={c.caption} size={46} />
      </Piece>
      <Piece t={t} t0={s + 2.3} x={70} y={720} rot={-5} seed={29} shadow={false}><Hand t={t} t0={s + 2.3}>{c.note}</Hand></Piece>
      <Piece t={t} t0={s + 3.0} x={330} y={830} rot={10} seed={30} enter="stamp" shadow={false}><Stamp size={60}>{c.stamp}</Stamp></Piece>
      <InkLayer t={t} seed={31}>
        <Stroke t={t} t0={s + 1.2} t1={s + 1.8} d={loop(192, 350, 165, 200, 5)} />
        <Stroke t={t} t0={s + 1.6} t1={s + 1.9} d={underline(76, 640, 676)} width={8} />
        <Stroke t={t} t0={s + 2.8} t1={s + 3.05} d={a1} width={7} />
        <Stroke t={t} t0={s + 3.0} t1={s + 3.15} d={a2} width={7} />
      </InkLayer>
    </>
  );
};

export const LessonScene: React.FC<{
  t: number; s: number; l: Lesson; i: number; n: number; photo: P; badge: string;
}> = ({ t, s, l, i, n, photo, badge }) => {
  const seed = 100 + i * 20;
  const nn = String(i + 1).padStart(2, '0');
  const big = l.hero.kind === 'big';
  return (
    <>
      <Piece t={t} t0={s + 0.15} x={40} y={110} rot={-4} seed={seed}><Block w={330} h={300} /></Piece>
      <Piece t={t} t0={s + 0.3} x={58} y={128} seed={seed + 1} enter="stamp" shadow={false}><span className="num">{nn}</span></Piece>
      <Piece t={t} t0={s + 0.05} x={56} y={46} rot={-2} seed={seed + 2}><Tape>{`Pelajaran ${nn}/${String(n).padStart(2, '0')} — ${l.time}`}</Tape></Piece>
      <Piece t={t} t0={s + 0.2} x={850} y={40} rot={8} seed={seed + 3}><Badge t={t} face={photo.face} text={badge} id={`l${i}`} /></Piece>
      <Piece t={t} t0={s + 0.55} x={36} y={430} rot={-3} seed={seed + 4} enter="left"><Strip kind="ink">{l.title[0]}</Strip></Piece>
      <Piece t={t} t0={s + 0.8} x={110} y={548} rot={1.8} seed={seed + 5} enter="right"><Strip kind="yel">{l.title[1]}</Strip></Piece>
      {l.hero.kind === 'big' ? (
        <>
          <Piece t={t} t0={s + 1.2} x={80} y={700} seed={seed + 6} enter="stamp" shadow={false}>
            <span className="big" style={{ position: 'relative', display: 'inline-block' }}>
              {l.hero.text}
              <LocalInk t={t} t0={s + 2.0} t1={s + 2.6} kind="ring" w={l.hero.text.length * 0.42 * 280} h={224} seed={i} />
            </span>
          </Piece>
          <Piece t={t} t0={s + 1.6} x={90} y={935} rot={-2.5} seed={seed + 7}><Tape style={{ fontSize: 28 }}>{l.hero.sub}</Tape></Piece>
        </>
      ) : (
        <Piece t={t} t0={s + 1.2} x={60} y={706} w={960} rot={-1.2} seed={seed + 6} className="card" style={{ padding: '44px 56px 52px 120px' }}>
          <Scraps seed={seed + 6} />
          <span className="qmark" style={{ left: 22, top: -6 }}>“</span>
          <span className="quote" style={{ position: 'relative', display: 'inline-block' }}>
            {l.hero.text}
            <LocalInk t={t} t0={s + 2.0} t1={s + 2.4} kind="under" w={700} h={30} />
          </span>
        </Piece>
      )}
      <Piece t={t} t0={s + 2.4} x={420} y={150} rot={-9} seed={seed + 8} enter="stamp" shadow={false}><Stamp size={64}>{l.stamp}</Stamp></Piece>
      <Caption t={t} t0={s + 1.7} text={l.caption} style={{ position: 'absolute', left: 64, top: big ? 1030 : 1000, width: 950 }} />
      <Piece t={t} t0={s + 3.2} x={620} y={1250} rot={-4} seed={seed + 9} shadow={false}><Hand t={t} t0={s + 3.2} size={56}>{l.note}</Hand></Piece>
      <InkLayer t={t} seed={seed + 10}>
        {l.cross && crossPaths(420, 130, 330, 130).map((d, k) => (
          <Stroke key={k} t={t} t0={s + 2.9 + k * 0.2} t1={s + 3.1 + k * 0.2} d={d} width={11} />
        ))}
      </InkLayer>
    </>
  );
};

export const Bonus: React.FC<{ t: number; s: number; b: CollageContent['bonus']; photo: P; badge: string }> = ({ t, s, b, photo, badge }) => (
  <>
    <Piece t={t} t0={s + 0.05} x={56} y={46} rot={-2} seed={301}><Tape>{b.tape}</Tape></Piece>
    <Piece t={t} t0={s + 0.2} x={850} y={40} rot={-6} seed={302}><Badge t={t} face={photo.face} text={badge} id="bonus" /></Piece>
    <Piece t={t} t0={s + 0.4} x={36} y={200} rot={-3} seed={303} enter="left"><Strip kind="ink">{b.strips[0]}</Strip></Piece>
    <Piece t={t} t0={s + 0.65} x={110} y={318} rot={1.8} seed={304} enter="right"><Strip kind="yel">{b.strips[1]}</Strip></Piece>
    <Piece t={t} t0={s + 1.0} x={600} y={460} rot={7} seed={305} enter="stamp" shadow={false}><Stamp size={50}>{b.stamp}</Stamp></Piece>
    {b.items.map((it, k) => (
      <Piece key={k} t={t} t0={s + 2.0 + k * 0.7} x={60 + (k % 2) * 30} y={590 + k * 205} w={930} rot={[-1.5, 1.2, -0.8][k]} seed={306 + k}
        className="card" style={{ padding: '30px 40px 26px', display: 'flex', alignItems: 'center', gap: 34 }}>
        <Scraps seed={306 + k} />
        <span className="big" style={{ fontSize: 118, lineHeight: 0.86, flex: 'none' }}>{it.word}</span>
        <Caption t={t} t0={s + 2.2 + k * 0.7} text={it.text} size={40} />
      </Piece>
    ))}
    <Piece t={t} t0={s + 4.4} x={560} y={1225} rot={-4} seed={309} shadow={false}><Hand t={t} t0={s + 4.4} size={58}>{b.note}</Hand></Piece>
    <InkLayer t={t} seed={310}>
      {crossPaths(600, 440, 420, 120).map((d, k) => <Stroke key={k} t={t} t0={s + 1.5 + k * 0.2} t1={s + 1.7 + k * 0.2} d={d} width={11} />)}
    </InkLayer>
  </>
);

export const End: React.FC<{ t: number; s: number; e: CollageContent['end']; photo: P }> = ({ t, s, e, photo }) => {
  const cx = -50, cy = 470, cw = 660, f = face(cx, cy, cw);
  const [a1, a2] = arrow(800, 960, 970, 1140, -0.3);
  return (
    <>
      <Piece t={t} t0={s + 0.2} x={40} y={470} rot={-2} seed={401}><Block w={480} h={960} /></Piece>
      <Piece t={t} t0={s + 0.35} x={cx} y={cy} seed={402} amp={0.6}><Cutout src={photo.cutout} w={cw} /></Piece>
      <Piece t={t} t0={s + 0.5} x={36} y={110} rot={-3} seed={403} enter="left"><Strip kind="ink" size={130}>{e.strips[0]}</Strip></Piece>
      <Piece t={t} t0={s + 0.75} x={120} y={250} rot={2} seed={404} enter="right"><Strip kind="yel" size={130}>{e.strips[1]}</Strip></Piece>
      <Piece t={t} t0={s + 1.2} x={560} y={500} w={470} rot={1.5} seed={405} className="card" style={{ padding: '30px 34px 32px' }}>
        <Scraps seed={405} />
        <Caption t={t} t0={s + 1.35} text={e.caption} size={46} />
      </Piece>
      <Piece t={t} t0={s + 2.2} x={600} y={870} rot={-5} seed={406} shadow={false}><Hand t={t} t0={s + 2.2} size={62}>{e.note}</Hand></Piece>
      <Piece t={t} t0={s + 1.8} x={470} y={1190} rot={-3} seed={407}><Tape style={{ fontSize: 23 }}>{e.tape}</Tape></Piece>
      <InkLayer t={t} seed={408}>
        <Stroke t={t} t0={s + 1.6} t1={s + 2.1} d={loop(f.x, f.y - 20, 150, 180, 7)} />
        <Stroke t={t} t0={s + 2.8} t1={s + 3.1} d={a1} width={7} />
        <Stroke t={t} t0={s + 3.05} t1={s + 3.2} d={a2} width={7} />
      </InkLayer>
    </>
  );
};
