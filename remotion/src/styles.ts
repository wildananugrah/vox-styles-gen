import { staticFile } from 'remotion';
import { F } from './fonts';

// Ported from the old promo.html stylesheet. Positions are stage pixels (1080x1920).
export const css = `
.vox{
  --ink:#16130F; --paper:#EFE8D8; --card:#FBF7EE; --mute:#6E6455; --marker:#FFD60A; --red:#D3301F;
  position:relative;width:1080px;height:1920px;overflow:hidden;background:var(--paper);color:var(--ink);font-family:${F.grot}
}
.vox *{box-sizing:border-box}
.vox .abs{position:absolute}
.vox .sheet{position:absolute;inset:0;background:var(--paper) url(${staticFile('textures/paper.png')}) 0 0/1080px 1920px;box-shadow:0 -40px 90px rgba(20,12,4,.38);will-change:transform}
.vox .drift{position:absolute;inset:0;transform-origin:540px 900px}
.vox .shade{position:absolute;inset:0;background:#0d0a06;opacity:0;pointer-events:none}

.vox .m{display:inline-block;overflow:hidden;vertical-align:top;padding:0 .04em .14em;margin:0 -.04em -.14em}
.vox .w{display:inline-block;position:relative}
.vox .mk{position:absolute;left:-.04em;right:-.04em;top:.2em;bottom:.04em;background:var(--marker);z-index:-1;transform-origin:0 50%;border-radius:.06em .18em .08em .2em;transform:scaleX(0)}
.vox .hlwrap{position:relative;z-index:0}
.vox svg.ink{position:absolute;left:0;top:0;overflow:visible;pointer-events:none}
.vox svg.ink path{fill:none;stroke:var(--red);stroke-linecap:round;stroke-linejoin:round}

.vox .kicker{font:500 26px/1 ${F.mono};letter-spacing:.14em;text-transform:uppercase;color:var(--mute)}

.vox .strip{position:absolute;font:800 46px/1 ${F.grot};text-transform:uppercase;letter-spacing:-.01em;padding:18px 24px 16px;white-space:nowrap;box-shadow:0 10px 24px -10px rgba(20,12,4,.45)}
.vox .strip.k{background:#17130F;color:#F6F0E2}
.vox .strip.y{background:var(--marker);color:var(--ink)}
.vox .strip.r{background:var(--red);color:#FFF6EA}
.vox .strip.p{background:#FAF5EA;color:var(--ink);border:2px solid #17130F}
.vox .msg{position:absolute;left:70px;top:760px;width:940px;height:400px;background:var(--card);box-shadow:0 30px 70px -20px rgba(20,12,4,.55),0 0 0 1px rgba(20,12,4,.06)}
.vox .msg .line{position:absolute;left:0;right:0;top:0;bottom:0;display:flex;align-items:center;justify-content:center;text-align:center;font:400 92px/1.06 ${F.serif};letter-spacing:-.01em;padding:0 50px}
.vox .tape{position:absolute;width:190px;height:54px;background:rgba(236,225,190,.78);box-shadow:0 2px 6px rgba(20,12,4,.12);border-left:2px dashed rgba(255,255,255,.35);border-right:2px dashed rgba(255,255,255,.35)}

.vox .t-kicker{left:80px;top:330px;font-size:30px}
.vox .t-head{position:absolute;left:76px;top:385px;font:400 156px/1.0 ${F.serif};letter-spacing:-.025em}
.vox .row{display:block}
.vox .toc{position:absolute;left:80px;top:1000px;width:850px}
.vox .toc-row{position:relative;height:104px;display:flex;align-items:center}
.vox .toc-rule{position:absolute;left:0;right:0;top:0;height:3px;background:var(--ink);transform-origin:0 50%}
.vox .toc-n{font:500 34px/1 ${F.mono};color:var(--red);width:92px}
.vox .toc-t{font:400 62px/1 ${F.serif};flex:1}
.vox .toc-c{font:500 26px/1 ${F.mono};color:var(--mute);letter-spacing:.08em;text-transform:uppercase}

.vox .ch-num{position:absolute;left:66px;top:132px;font:400 150px/1 ${F.serif};color:var(--red);transform-origin:0 0;letter-spacing:-.02em}
.vox .ch-kick{position:absolute;left:258px;top:160px}
.vox .ch-title{position:absolute;left:256px;top:196px;font:400 70px/1 ${F.serif};white-space:nowrap;transform-origin:0 0;letter-spacing:-.01em}
.vox .ch-rule{position:absolute;left:70px;width:880px;top:300px;height:4px;background:var(--ink);transform-origin:0 50%}
.vox .ch-intro{position:absolute;left:0;right:0;top:1085px;text-align:center;font:500 30px/1.3 ${F.mono};letter-spacing:.12em;text-transform:uppercase;color:var(--mute)}
.vox .card{position:absolute;left:64px;width:900px;background:var(--card);padding:.9em 1em .95em 5.6em;font-size:36px;
  box-shadow:0 22px 46px -18px rgba(20,12,4,.5),0 0 0 1px rgba(20,12,4,.07)}
.vox .card .tape{left:50%;top:-22px;margin-left:-95px;width:170px;height:46px}
.vox .stamp{position:absolute;left:.85em;top:.9em;width:4.1em;height:4.1em}
.vox .stamp .in{position:absolute;inset:0;border-radius:50%;border:.17em solid var(--red);box-shadow:inset 0 0 0 .11em var(--card),inset 0 0 0 .2em var(--red);
  display:flex;align-items:center;justify-content:center;color:var(--red);font:400 1.6em/1 ${F.serif};letter-spacing:-.02em;
  -webkit-mask-image:url(${staticFile('textures/stampmask.png')});-webkit-mask-size:100% 100%;opacity:.9}
.vox .stamp .in.sm{font-size:1.18em}
.vox .name{font:400 2.1em/1 ${F.serif};letter-spacing:-.015em;white-space:nowrap}
.vox .name.wrap{white-space:normal;line-height:1.04}
.vox .meta{margin-top:.35em;font:500 .7em/1.35 ${F.mono};letter-spacing:.06em;text-transform:uppercase;color:var(--mute)}
.vox .tags{margin-top:.5em;display:flex;flex-wrap:wrap;gap:.3em .6em}
.vox .tag{position:relative;z-index:0;font:600 .95em/1.15 ${F.grot};letter-spacing:-.005em}
.vox .tag .mk{top:.12em;bottom:0;left:-.18em;right:-.18em}

.vox .sheet.end{background:#14110D;box-shadow:0 -40px 90px rgba(0,0,0,.5)}
.vox .end .drift{color:#F3ECDD}
.vox .e-kicker{left:80px;top:470px;color:var(--marker)}
.vox .e-head{position:absolute;left:76px;top:530px;font:400 116px/1.08 ${F.serif};letter-spacing:-.02em}
.vox .e-save{left:84px;top:1130px;font:700 76px/1 ${F.hand};color:var(--marker);transform-origin:0 50%;white-space:nowrap}
.vox .e-ask{left:84px;top:1250px;font:500 36px/1.3 ${F.grot};color:#B9AF9C;width:760px}
.vox svg.ink.e-ink path{stroke:var(--marker)}

.vox .grain{position:absolute;inset:-2px;background:url(${staticFile('textures/grain.png')}) 0 0/512px 512px;opacity:.28;z-index:50;pointer-events:none}
.vox .vig{position:absolute;inset:0;z-index:51;pointer-events:none;background:radial-gradient(ellipse 90% 75% at 50% 46%,transparent 60%,rgba(60,36,10,.2) 100%)}
`;
