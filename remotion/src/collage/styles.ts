import { staticFile } from 'remotion';
import { CF } from './fonts';

export const C = {
  paper: '#ECE9DF',
  ink: '#141414',
  yellow: '#FFE600',
  red: '#E4352B',
  card: '#FBFAF4',
  tape: 'rgba(240,233,206,.86)',
};

export const W = 1080, H = 1350;

export const clCss = `
.cl{position:absolute;inset:0;width:${W}px;height:${H}px;overflow:hidden;background:${C.ink};font-family:${CF.body};color:${C.ink}}
.cl *{box-sizing:border-box}
.cl .sheet{position:absolute;inset:0;background:${C.paper};overflow:hidden;transform-origin:0 100%;box-shadow:-24px 0 60px rgba(0,0,0,.4)}
.cl .sheet .fiber{position:absolute;inset:0;background:url(${staticFile('textures/paper.png')}) center/cover;mix-blend-mode:multiply;opacity:.32;filter:grayscale(1)}
.cl .shade{position:absolute;inset:0;background:${C.ink};pointer-events:none;z-index:80}
.cl .pc{position:absolute;left:0;top:0;transform-origin:50% 50%}
.cl .drop{filter:drop-shadow(0 6px 7px rgba(20,20,20,.28))}
.cl .strip{display:inline-block;white-space:nowrap;font:900 112px/0.9 ${CF.head};text-transform:uppercase;padding:16px 30px 8px;letter-spacing:.005em;
  clip-path:polygon(0 6%,35% 2%,100% 0,99.2% 48%,100% 100%,60% 97%,0.8% 100%,0 52%)}
.cl .strip.ink{background:${C.ink};color:${C.yellow}}
.cl .strip.yel{background:${C.yellow};color:${C.ink}}
.cl .tape{display:inline-block;white-space:nowrap;font:700 26px/1 ${CF.mono};letter-spacing:.08em;text-transform:uppercase;color:${C.ink};background:${C.tape};padding:13px 30px 11px}
.cl .scrap{position:absolute;width:118px;height:38px;background:${C.tape}}
.cl .card{background:${C.card}}
.cl .stamp{display:inline-block;white-space:nowrap;font:800 54px/1 ${CF.head};letter-spacing:.07em;text-transform:uppercase;color:${C.red};
  border:7px double ${C.red};border-radius:10px;padding:10px 20px 4px;
  -webkit-mask-image:url(${staticFile('textures/stampmask.png')});-webkit-mask-size:256px 256px}
.cl .cap{font:600 44px/1.3 ${CF.body};letter-spacing:-.005em}
.cl .cw{display:inline-block;white-space:pre}
.cl .hl{background:linear-gradient(${C.yellow},${C.yellow}) no-repeat 0 62%;padding:0 2px;margin:0 -2px}
.cl .quote{font:italic 400 64px/1.08 ${CF.quote};letter-spacing:-.01em}
.cl .qmark{position:absolute;font:italic 400 190px/1 ${CF.quote};color:${C.red}}
.cl .hand{font:400 60px/1 ${CF.hand};color:${C.red};white-space:nowrap}
.cl .big{font:900 280px/0.8 ${CF.head};text-transform:uppercase;letter-spacing:-.01em;white-space:nowrap}
.cl .num{font:900 330px/0.78 ${CF.head};letter-spacing:-.02em}
.cl .block{position:absolute;background-color:${C.yellow}}
.cl svg.ink{position:absolute;left:0;top:0;overflow:visible;pointer-events:none}
.cl svg.ink path{fill:none;stroke:${C.red};stroke-linecap:round;stroke-linejoin:round}
.cl .vig{position:absolute;inset:0;z-index:90;pointer-events:none;background:radial-gradient(ellipse 80% 78% at 50% 48%,transparent 58%,rgba(20,20,20,.3) 100%)}
.cl .grain{position:absolute;inset:-2px;z-index:91;pointer-events:none;background:url(${staticFile('textures/grain.png')}) 0 0/512px 512px;opacity:.13}
`;
