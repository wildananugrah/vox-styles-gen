import { staticFile } from 'remotion';
import { PF } from './fonts';

// Cut-paper diorama: warm pastels, scissor edges, soft depth shadows, miniature-set lighting.
export const pcCss = `
.pc{--ink:#3B2A3A;--soft:#7A6170;position:relative;width:1080px;height:1920px;overflow:hidden;background:#3a2a26;color:var(--ink);font-family:${PF.body}}
.pc *{box-sizing:border-box}
.pc .abs{position:absolute}
.pc .setpiece{position:absolute;inset:0;will-change:transform;box-shadow:0 -30px 60px rgba(60,30,20,.35)}
.pc .set{position:absolute;inset:0}
.pc .shade{position:absolute;inset:0;background:#2a1a14;opacity:0;pointer-events:none}
.pc .sh1{filter:drop-shadow(0 5px 6px rgba(90,50,30,.22))}
.pc .sh2{filter:drop-shadow(0 9px 10px rgba(90,50,30,.26))}
.pc .sh3{filter:drop-shadow(0 -6px 12px rgba(90,50,30,.22))}
.pc .pp{position:absolute}
.pc .pp-in{position:absolute;inset:0;background-blend-mode:soft-light}
.pc .pp-c{position:relative;width:100%;height:100%}

.pc .h{font-family:${PF.head};font-weight:600;letter-spacing:-.01em}
.pc .hand{font-family:${PF.hand}}

/* hook */
.pc .q-line{position:absolute;display:flex;align-items:center;padding:0 34px;font:600 100px/1 ${PF.head};white-space:nowrap}
.pc .opt{display:flex;align-items:center;justify-content:center;gap:18px;font:600 54px/1 ${PF.head}}
.pc .opt b{display:inline-flex;width:62px;height:62px;border-radius:50%;align-items:center;justify-content:center;background:var(--ink);color:#FFF6EC;font-size:36px}
.pc .burst-t{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;font:700 74px/1 ${PF.head};color:#FFFDF7;text-transform:uppercase;letter-spacing:.01em;text-shadow:0 3px 0 rgba(120,40,30,.35)}

/* cover */
.pc .tile{display:flex;align-items:center;justify-content:center;font:700 112px/1 ${PF.head}}
.pc .ribbon{display:flex;align-items:center;justify-content:center;font:600 72px/1 ${PF.head};color:#FFFDF7}
.pc .c-sub{left:0;right:0;text-align:center;font:400 44px/1 ${PF.hand};color:var(--soft)}
.pc .bubble{padding:46px 54px 0;font:700 42px/1.32 ${PF.body}}
.pc .bubble .lead{display:block;font:600 34px/1 ${PF.head};color:#E0624C;margin-bottom:16px;text-transform:uppercase;letter-spacing:.06em}

/* plates */
.pc .badge{display:flex;flex-direction:column;align-items:center;justify-content:center;color:#FFFDF7;font:700 74px/.9 ${PF.head}}
.pc .badge small{font:700 22px/1 ${PF.body};letter-spacing:.14em;margin-bottom:4px}
.pc .p-title{left:250px;top:176px;font:600 92px/1 ${PF.head};white-space:nowrap}
.pc .p-sub{left:254px;top:282px;font:400 44px/1 ${PF.hand};color:var(--soft)}
.pc .fig{position:absolute;left:50px;top:372px;width:980px;height:381px;overflow:hidden;border-radius:6px}
.pc .fig-layer{position:absolute;left:0;top:0;width:980px;height:381px;transform-origin:0 0}
.pc .fig-layer img{position:absolute;left:0;top:0;width:980px;height:381px}
.pc .tag{position:absolute;display:flex;align-items:center;justify-content:center;gap:8px;font:800 19px/1 ${PF.body};white-space:nowrap;border-radius:8px;
  box-shadow:0 4px 6px rgba(90,50,30,.28);transform-origin:50% 50%}
.pc .tag b{display:inline-flex;width:26px;height:26px;border-radius:50%;align-items:center;justify-content:center;color:#FFF;font:700 17px/1 ${PF.head};flex:none}
.pc .tape{position:absolute;width:150px;height:44px;background:rgba(255,226,140,.78);box-shadow:0 2px 4px rgba(90,50,30,.15)}
.pc .cap{left:0;right:0;top:790px;text-align:center;font:400 46px/1 ${PF.hand}}
.pc .row{display:flex;align-items:center;gap:22px;padding:0 26px 0 22px}
.pc .row-let{display:inline-flex;width:58px;height:58px;border-radius:50%;align-items:center;justify-content:center;color:#FFF;font:700 34px/1 ${PF.head};flex:none}
.pc .row-txt{flex:1;min-width:0}
.pc .row-n{font:600 44px/1.05 ${PF.head};white-space:nowrap}
.pc .row-note{margin-top:6px;font:700 25px/1.15 ${PF.body};color:var(--soft)}
.pc .val{display:flex;align-items:center;justify-content:center;font:700 40px/1 ${PF.head};white-space:nowrap}

/* notes */
.pc .n-card{padding:46px 44px 0 44px}
.pc .n-h{display:flex;align-items:center;gap:20px;font:600 50px/1.05 ${PF.head}}
.pc .n-h b{display:inline-flex;width:62px;height:62px;border-radius:50%;align-items:center;justify-content:center;color:#FFF;font:700 36px/1 ${PF.head};flex:none}
.pc .n-b{margin-top:16px;font:700 34px/1.3 ${PF.body};color:#5A4554}
.pc .bar-row{display:flex;align-items:center;height:84px;font:600 36px/1 ${PF.head}}
.pc .bar-lab{width:150px}
.pc .bar-v{margin-left:18px;font:400 40px/1 ${PF.hand};white-space:nowrap}

/* end */
.pc .e-save{font:700 76px/1.02 ${PF.head};color:var(--ink);text-align:center;padding:0 60px}
.pc .e-ask{font:700 40px/1.3 ${PF.body};text-align:center;padding:40px 56px 0}
.pc .e-src{font:400 34px/1.25 ${PF.hand};padding:30px 36px 0}
.pc .e-src b{font:600 30px/1 ${PF.head};text-transform:uppercase;letter-spacing:.08em;display:block;margin-bottom:8px}

.pc .fibers{position:absolute;inset:0;z-index:40;pointer-events:none;background:url(${staticFile('papercraft/fibers.png')}) 0 0/512px 512px;mix-blend-mode:soft-light;opacity:.3}
.pc .light{position:absolute;inset:0;z-index:41;pointer-events:none;
  background:radial-gradient(ellipse 75% 45% at 50% 18%,rgba(255,236,200,.16),rgba(255,236,200,0) 70%),
             radial-gradient(ellipse 95% 80% at 50% 45%,transparent 58%,rgba(80,40,20,.32) 100%)}
.pc .grain{position:absolute;inset:-2px;background:url(${staticFile('textures/grain.png')}) 0 0/512px 512px;opacity:.08;z-index:42;pointer-events:none}

/* hip-hop vibe: signage + graffiti type, marker captions */
.pc .graf{font-family:${PF.graf}}
.pc.hiphop .h,.pc.hiphop .q-line,.pc.hiphop .tile,.pc.hiphop .p-title,.pc.hiphop .burst-t,.pc.hiphop .e-save,.pc.hiphop .row-n,.pc.hiphop .n-h{font-family:${PF.sign};font-weight:400;letter-spacing:0}
.pc.hiphop .q-line{font-size:84px}
.pc.hiphop .p-title{font-size:78px;top:186px}
.pc.hiphop .row-n{font-size:36px}
.pc.hiphop .n-h{font-size:40px}
.pc.hiphop .e-save{font-size:62px}
.pc.hiphop .burst-t{font-size:62px}
.pc.hiphop .ribbon{font:400 84px/1 ${PF.graf};letter-spacing:.02em}
.pc.hiphop .badge{font:400 64px/.9 ${PF.sign}}
.pc.hiphop .c-sub,.pc.hiphop .p-sub,.pc.hiphop .cap,.pc.hiphop .bar-v,.pc.hiphop .e-src{font-family:${PF.marker}}
.pc.hiphop .e-src{font-size:29px}
.pc.hiphop .bar-v{font-size:34px}
.pc.hiphop .p-sub{font-size:36px}
.pc.hiphop .cap{font-size:40px}
.pc.hiphop .c-sub{font-size:36px}
`;
