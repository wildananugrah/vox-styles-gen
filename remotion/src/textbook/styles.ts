import { staticFile } from 'remotion';
import { TF } from './fonts';

// Vintage textbook: cream paper, sepia ink, oxblood pencil, engraved plates, thin serif captions.
export const tbCss = `
.tb{--ink:#2A2118;--mute:#6E5C44;--paper:#F5E9CF;--rule:#3A2E22;--red:#9B2C1F;
  position:relative;width:1080px;height:1920px;overflow:hidden;background:#1d160f;color:var(--ink);font-family:${TF.gar}}
.tb *{box-sizing:border-box}
.tb .abs{position:absolute}
.tb .page{position:absolute;inset:0;background:var(--paper) url(${staticFile('textures/paper.png')}) 0 0/1080px 1920px;background-blend-mode:multiply;
  box-shadow:-30px 0 70px rgba(20,12,4,.45);will-change:transform}
.tb .drift{position:absolute;inset:0;transform-origin:540px 860px}
.tb .shade{position:absolute;inset:0;background:#1a1209;opacity:0;pointer-events:none}
.tb .gutter{position:absolute;left:0;top:0;bottom:0;width:70px;background:linear-gradient(90deg,rgba(60,40,15,.22),rgba(60,40,15,0))}
.tb .fox{position:absolute;border-radius:50%;background:radial-gradient(circle,rgba(150,95,35,.16),rgba(150,95,35,0) 70%)}
.tb .frame{position:absolute;inset:40px 40px 40px 40px;border:2px solid rgba(42,33,24,.55)}
.tb .frame::after{content:'';position:absolute;inset:7px;border:1px solid rgba(42,33,24,.4)}

.tb .rh{position:absolute;left:84px;right:84px;top:122px;display:flex;justify-content:space-between;align-items:baseline;
  font:400 27px/1 ${TF.sc};letter-spacing:.08em;color:var(--mute)}
.tb .rh-rule{position:absolute;left:84px;right:84px;top:162px;height:1.5px;background:var(--rule);transform-origin:0 50%}

.tb .m{display:inline-block;overflow:hidden;vertical-align:top;padding:0 .04em .16em;margin:0 -.04em -.16em}
.tb .w{display:inline-block}
.tb svg.ink{position:absolute;left:0;top:0;overflow:visible;pointer-events:none}
.tb svg.ink path{fill:none;stroke:var(--red);stroke-linecap:round;stroke-linejoin:round;opacity:.92}
.tb svg.ink.dark path{stroke:var(--ink)}

/* hook: a quiz question */
.tb .q-kick{left:0;right:0;top:330px;text-align:center;font:400 34px/1 ${TF.sc};letter-spacing:.14em;color:var(--mute)}
.tb .q-num{left:0;right:0;top:400px;text-align:center;font:italic 400 40px/1 ${TF.gar};color:var(--red)}
.tb .q-text{left:60px;right:60px;top:480px;text-align:center;font:400 128px/1.02 ${TF.fell};letter-spacing:-.01em}
.tb .q-opts{left:0;right:0;top:1010px;display:flex;justify-content:center;gap:120px;font:400 64px/1 ${TF.gar}}
.tb .q-opt i{font-style:italic;color:var(--mute);margin-right:.25em}
.tb .stamp{position:absolute;left:540px;top:1240px;width:520px;margin-left:-260px;padding:22px 0 18px;text-align:center;
  border:7px double var(--red);color:var(--red);font:400 92px/1 ${TF.sc};letter-spacing:.1em;
  -webkit-mask-image:url(${staticFile('textures/stampmask.png')});-webkit-mask-size:100% 100%}

/* cover */
.tb .c-series{left:0;right:0;top:200px;text-align:center;font:400 32px/1 ${TF.sc};letter-spacing:.2em;color:var(--mute)}
.tb .c-chap{left:0;right:0;top:290px;text-align:center;font:400 46px/1 ${TF.sc};letter-spacing:.3em;color:var(--red)}
.tb .c-title{left:0;right:0;top:372px;text-align:center;font:400 158px/1 ${TF.fell};letter-spacing:-.015em}
.tb .c-subtitle{left:0;right:0;top:548px;text-align:center;font:italic 400 92px/1 ${TF.fell}}
.tb .c-sub{left:0;right:0;top:770px;text-align:center;font:italic 400 36px/1.2 ${TF.gar};color:var(--mute)}
.tb .c-ih{left:0;right:0;top:880px;text-align:center;font:400 34px/1 ${TF.sc};letter-spacing:.18em}
.tb .c-intro{left:110px;right:110px;top:950px;font:400 46px/1.36 ${TF.gar};text-align:justify;hyphens:auto}
.tb .dropcap{float:left;font:400 178px/.8 ${TF.fell};color:var(--red);margin:.06em .1em 0 0}

/* plate pages */
.tb .p-head{left:84px;top:196px;display:flex;align-items:baseline;gap:34px;white-space:nowrap}
.tb .p-num{font:400 104px/1 ${TF.fell};color:var(--red)}
.tb .p-title{font:400 84px/1 ${TF.fell}}
.tb .p-sub{left:88px;top:298px;font:italic 400 34px/1 ${TF.gar};color:var(--mute)}
.tb .p-sub.warn{color:var(--red)}
.tb .fig-wrap{position:absolute;left:50px;top:372px;width:980px;height:381px}
.tb .fig-wrap::before{content:'';position:absolute;inset:-10px;border:1.5px solid var(--rule)}
.tb .fig{position:absolute;inset:0;overflow:hidden;background:var(--paper)}
.tb .fig-layer{position:absolute;left:0;top:0;width:980px;height:381px;transform-origin:0 0}
.tb .fig-layer img{position:absolute;left:0;top:0;width:980px;height:381px;mix-blend-mode:multiply}
.tb .lab{position:absolute;display:flex;align-items:center;justify-content:center;gap:.3em;background:#F7EDD5;border:1.5px solid var(--rule);
  font:400 20px/1 ${TF.sc};letter-spacing:.03em;white-space:nowrap;box-shadow:0 0 0 3px rgba(247,237,213,.6)}
.tb .lab b{font:italic 400 22px/1 ${TF.gar};color:var(--red)}
.tb .fig-cap{left:70px;right:70px;top:782px;text-align:center;font:italic 400 33px/1.25 ${TF.gar}}
.tb .fig-cap .sc{font:400 31px/1 ${TF.sc};font-style:normal;letter-spacing:.06em;margin-right:.35em}
.tb .tab-head{left:84px;right:84px;top:862px;display:flex;justify-content:space-between;font:400 26px/1 ${TF.sc};letter-spacing:.12em;color:var(--mute);
  border-bottom:1.5px solid var(--rule);padding-bottom:10px}
.tb .row{position:absolute;left:84px;right:84px;height:114px}
.tb .row-l1{display:flex;align-items:baseline;gap:14px;font:400 46px/1 ${TF.gar}}
.tb .row-let{font:italic 400 40px/1 ${TF.gar};color:var(--red);width:44px}
.tb .row-n{font:400 48px/1 ${TF.fell};white-space:nowrap}
.tb .leader{flex:1;height:0;border-bottom:4px dotted rgba(42,33,24,.55);transform-origin:0 50%;align-self:flex-end;margin-bottom:9px}
.tb .row-v{font:500 46px/1 ${TF.gar};font-variant-numeric:lining-nums tabular-nums;white-space:nowrap}
.tb .row-note{margin:12px 0 0 58px;font:italic 400 31px/1.15 ${TF.gar};color:var(--mute)}

/* notes */
.tb .n-pt{position:absolute;left:84px;right:84px}
.tb .n-h{display:flex;align-items:baseline;gap:22px;font:400 62px/1.05 ${TF.fell}}
.tb .n-h i{font:italic 400 58px/1 ${TF.fell};color:var(--red);width:64px;flex:none}
.tb .n-b{margin:16px 0 0 86px;font:400 40px/1.32 ${TF.gar}}
.tb .bars{margin:28px 0 0 86px}
.tb .bar-row{display:flex;align-items:center;height:76px;font:400 34px/1 ${TF.sc};letter-spacing:.04em}
.tb .bar-lab{width:130px}
.tb .bar{position:relative;height:42px;transform-origin:0 50%}
.tb .bar .solid{position:absolute;left:0;top:0;bottom:0;border:2px solid var(--ink);
  background:repeating-linear-gradient(-45deg,var(--ink) 0 3px,transparent 3px 8px)}
.tb .bar .range{position:absolute;top:0;bottom:0;border:2px dashed var(--ink);border-left:none;
  background:repeating-linear-gradient(-45deg,rgba(42,33,24,.4) 0 2px,transparent 2px 10px)}
.tb .bar-v{margin-left:18px;font:italic 400 36px/1 ${TF.gar};letter-spacing:0;white-space:nowrap}

/* end */
.tb .e-h{left:84px;top:220px;font:400 84px/1 ${TF.fell}}
.tb .ref{position:absolute;left:84px;right:84px;display:flex;gap:22px;font:400 38px/1.3 ${TF.gar}}
.tb .ref i{font-style:normal;color:var(--red);flex:none}
.tb .e-save{left:0;right:0;top:880px;text-align:center;font:italic 400 100px/1 ${TF.fell};color:var(--red)}
.tb .e-ask{left:130px;right:130px;top:1010px;text-align:center;font:italic 400 42px/1.3 ${TF.gar}}
.tb .e-fin{left:0;right:0;top:1250px;text-align:center;font:400 34px/1 ${TF.sc};letter-spacing:.24em;color:var(--mute)}

.tb .grain{position:absolute;inset:-2px;background:url(${staticFile('textures/grain.png')}) 0 0/512px 512px;opacity:.16;z-index:50;pointer-events:none}
.tb .vig{position:absolute;inset:0;z-index:51;pointer-events:none;background:radial-gradient(ellipse 85% 70% at 50% 45%,transparent 55%,rgba(90,55,15,.26) 100%)}
`;
