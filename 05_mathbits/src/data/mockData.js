/**
 * mockData.js — Fallback / local testing data for MathBits
 *
 * Each entry shape:
 *   { id, name, description, code, tags }
 *
 * `code` is a self-contained HTML string that runs inside an iframe.
 * It must include <style> and <script> inline — no external deps beyond CDN.
 */

// ─── BACKGROUNDS ────────────────────────────────────────────────────────────

export const backgrounds = [
  {
    id: 1,
    name: 'Lissajous Web',
    description: 'Animated Lissajous curves forming a luminous web on canvas.',
    tags: ['canvas', 'parametric', 'animation'],
    code: `<!DOCTYPE html><html><head><style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#080b10;overflow:hidden;width:100vw;height:100vh}
canvas{display:block}
</style></head><body>
<canvas id="c"></canvas>
<script>
const c=document.getElementById('c');
const ctx=c.getContext('2d');
let W,H,t=0;
function resize(){W=c.width=window.innerWidth;H=c.height=window.innerHeight}
resize();
window.addEventListener('resize',resize);
function draw(){
  ctx.fillStyle='rgba(8,11,16,0.18)';
  ctx.fillRect(0,0,W,H);
  const cx=W/2,cy=H/2,R=Math.min(W,H)*0.38;
  for(let i=0;i<6;i++){
    const a=3+i*0.5,b=2+i*0.3,d=i*Math.PI/7;
    ctx.beginPath();
    let first=true;
    for(let s=0;s<=1000;s++){
      const angle=s/1000*Math.PI*2;
      const x=cx+R*Math.sin(a*angle+d+t);
      const y=cy+R*Math.sin(b*angle+t*0.7);
      first?ctx.moveTo(x,y):ctx.lineTo(x,y);
      first=false;
    }
    const hue=180+i*25;
    ctx.strokeStyle=\`hsla(\${hue},80%,65%,0.45)\`;
    ctx.lineWidth=1.2;
    ctx.stroke();
  }
  t+=0.006;
  requestAnimationFrame(draw);
}
draw();
</script></body></html>`,
  },
  {
    id: 2,
    name: 'Voronoi Flow',
    description: 'Dynamic Voronoi diagram with drifting seed points.',
    tags: ['voronoi', 'canvas', 'generative'],
    code: `<!DOCTYPE html><html><head><style>
*{margin:0;padding:0}body{background:#080b10;overflow:hidden;width:100vw;height:100vh}
canvas{display:block}
</style></head><body><canvas id="c"></canvas><script>
const c=document.getElementById('c');
const ctx=c.getContext('2d');
let W,H;
const N=22;
const pts=[];
function resize(){W=c.width=window.innerWidth;H=c.height=window.innerHeight;
  if(!pts.length)for(let i=0;i<N;i++)pts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-0.5)*0.7,vy:(Math.random()-0.5)*0.7,hue:160+Math.random()*80});
}
resize();
window.addEventListener('resize',resize);
const colors=['#5eead4','#818cf8','#38bdf8','#a78bfa','#34d399'];
function draw(){
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='#080b10';ctx.fillRect(0,0,W,H);
  const img=ctx.createImageData(W,H);
  const d=img.data;
  for(let y=0;y<H;y+=2){
    for(let x=0;x<W;x+=2){
      let minD=1e9,minI=0;
      for(let i=0;i<pts.length;i++){
        const dx=x-pts[i].x,dy=y-pts[i].y;
        const dd=dx*dx+dy*dy;
        if(dd<minD){minD=dd;minI=i;}
      }
      const p=(y*W+x)*4;
      const h=pts[minI].hue;
      const bright=1-Math.min(1,Math.sqrt(minD)/220);
      const r=Math.round(bright*40+10),g=Math.round(bright*90+20),b=Math.round(bright*120+30);
      for(let dy2=0;dy2<2;dy2++)for(let dx2=0;dx2<2;dx2++){
        const pp=((y+dy2)*W+(x+dx2))*4;
        d[pp]=r;d[pp+1]=g;d[pp+2]=b;d[pp+3]=255;
      }
    }
  }
  ctx.putImageData(img,0,0);
  // draw edges
  for(let i=0;i<pts.length;i++){
    ctx.beginPath();
    ctx.arc(pts[i].x,pts[i].y,3,0,Math.PI*2);
    ctx.fillStyle='rgba(94,234,212,0.7)';
    ctx.fill();
    pts[i].x+=pts[i].vx;pts[i].y+=pts[i].vy;
    if(pts[i].x<0||pts[i].x>W)pts[i].vx*=-1;
    if(pts[i].y<0||pts[i].y>H)pts[i].vy*=-1;
  }
  requestAnimationFrame(draw);
}
draw();
</script></body></html>`,
  },
  {
    id: 3,
    name: 'Perlin Flow Field',
    description: 'Particle system guided by a Perlin-noise vector field.',
    tags: ['noise', 'particles', 'canvas'],
    code: `<!DOCTYPE html><html><head><style>
*{margin:0;padding:0}body{background:#080b10;overflow:hidden;width:100vw;height:100vh}
canvas{display:block}
</style></head><body><canvas id="c"></canvas><script>
// Minimal Perlin noise
function fade(t){return t*t*t*(t*(t*6-15)+10)}
function lerp(a,b,t){return a+t*(b-a)}
const P=new Uint8Array(512);
const perm=[];for(let i=0;i<256;i++)perm[i]=i;
for(let i=255;i>0;i--){const j=Math.floor(Math.random()*(i+1));[perm[i],perm[j]]=[perm[j],perm[i]];}
for(let i=0;i<512;i++)P[i]=perm[i&255];
function grad(h,x,y){const v=h&3;const u=v<2?x:y,w=v<2?y:x;return((h&1)?-u:u)+((h&2)?-w:w)}
function noise(x,y){
  const xi=Math.floor(x)&255,yi=Math.floor(y)&255;
  const xf=x-Math.floor(x),yf=y-Math.floor(y);
  const u=fade(xf),v=fade(yf);
  const aa=P[P[xi]+yi],ab=P[P[xi]+yi+1],ba=P[P[xi+1]+yi],bb=P[P[xi+1]+yi+1];
  return lerp(lerp(grad(aa,xf,yf),grad(ba,xf-1,yf),u),lerp(grad(ab,xf,yf-1),grad(bb,xf-1,yf-1),u),v);
}
const c=document.getElementById('c');
const ctx=c.getContext('2d');
let W,H;
function resize(){W=c.width=window.innerWidth;H=c.height=window.innerHeight}
resize();window.addEventListener('resize',resize);
const NPART=700;
const parts=Array.from({length:NPART},()=>({x:Math.random()*W,y:Math.random()*H,life:Math.random()*200}));
let t=0;
ctx.fillStyle='#080b10';ctx.fillRect(0,0,W,H);
function draw(){
  ctx.fillStyle='rgba(8,11,16,0.04)';ctx.fillRect(0,0,W,H);
  parts.forEach(p=>{
    const angle=noise(p.x/120+t,p.y/120)*Math.PI*4;
    const speed=1.4;
    p.x+=Math.cos(angle)*speed;
    p.y+=Math.sin(angle)*speed;
    p.life--;
    if(p.life<=0||p.x<0||p.x>W||p.y<0||p.y>H){
      p.x=Math.random()*W;p.y=Math.random()*H;p.life=150+Math.random()*150;
    }
    const hue=200+noise(p.x/300,p.y/300)*80;
    ctx.fillStyle=\`hsla(\${hue},70%,65%,0.7)\`;
    ctx.fillRect(p.x,p.y,1.5,1.5);
  });
  t+=0.003;
  requestAnimationFrame(draw);
}
draw();
</script></body></html>`,
  },
  {
    id: 4,
    name: 'Fourier Rings',
    description: 'Epicycle animation approximating complex wave paths via Fourier series.',
    tags: ['fourier', 'epicycles', 'SVG-like'],
    code: `<!DOCTYPE html><html><head><style>
*{margin:0;padding:0}body{background:#080b10;overflow:hidden;width:100vw;height:100vh}
canvas{display:block}
</style></head><body><canvas id="c"></canvas><script>
const c=document.getElementById('c');
const ctx=c.getContext('2d');
let W,H;
function resize(){W=c.width=window.innerWidth;H=c.height=window.innerHeight}
resize();window.addEventListener('resize',resize);
const N=12;
let t=0;const trail=[];
const rings=Array.from({length:N},(_,i)=>({
  r: 60/(i+1),
  speed: (i%2===0?1:-1)*(i+1)*0.4,
  phase: i*Math.PI/N*3
}));
function draw(){
  ctx.fillStyle='rgba(8,11,16,0.15)';ctx.fillRect(0,0,W,H);
  let x=W/2,y=H/2;
  rings.forEach((ring,i)=>{
    const nx=x+ring.r*Math.cos(ring.speed*t+ring.phase);
    const ny=y+ring.r*Math.sin(ring.speed*t+ring.phase);
    ctx.beginPath();
    ctx.arc(x,y,ring.r,0,Math.PI*2);
    ctx.strokeStyle='rgba(94,234,212,0.12)';
    ctx.lineWidth=1;ctx.stroke();
    ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(nx,ny);
    ctx.strokeStyle=\`hsla(\${170+i*10},70%,60%,0.6)\`;
    ctx.lineWidth=1.5;ctx.stroke();
    ctx.beginPath();ctx.arc(nx,ny,3,0,Math.PI*2);
    ctx.fillStyle='#5eead4';ctx.fill();
    x=nx;y=ny;
  });
  trail.push({x,y});
  if(trail.length>600)trail.shift();
  if(trail.length>2){
    ctx.beginPath();ctx.moveTo(trail[0].x,trail[0].y);
    trail.forEach(p=>ctx.lineTo(p.x,p.y));
    ctx.strokeStyle='rgba(129,140,248,0.8)';
    ctx.lineWidth=1.8;ctx.stroke();
  }
  t+=0.018;
  requestAnimationFrame(draw);
}
draw();
</script></body></html>`,
  },
]

// ─── COLOR CHECKER ───────────────────────────────────────────────────────────

export const color_checker = [
  {
    id: 1,
    name: 'Pixel Color Picker',
    description: 'Hover any pixel to extract its HSL / HEX / RGB values in real-time.',
    tags: ['color', 'pixel', 'canvas', 'interactive'],
    code: `<!DOCTYPE html><html><head><style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#080b10;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:'JetBrains Mono',monospace;color:#e2e8f0}
#wrap{position:relative;width:360px}
#spectrum{border-radius:12px;cursor:crosshair;display:block;width:360px;height:200px}
#info{margin-top:14px;background:#0d1117;border:1px solid #1e2530;border-radius:10px;padding:14px 18px;display:flex;gap:16px;align-items:center}
#swatch{width:52px;height:52px;border-radius:8px;border:2px solid #1e2530;flex-shrink:0;transition:background 0.1s}
.vals{display:flex;flex-direction:column;gap:4px;font-size:0.75rem;color:#94a3b8}
.vals span{color:#e2e8f0;font-weight:500}
#magnifier{position:absolute;width:80px;height:80px;border-radius:50%;border:2px solid #5eead4;pointer-events:none;box-shadow:0 0 0 1px #080b10;overflow:hidden;display:none;transform:translate(-50%,-50%)}
</style></head><body>
<div id="wrap">
  <canvas id="spectrum"></canvas>
  <div id="magnifier"><canvas id="mag"></canvas></div>
</div>
<div id="info">
  <div id="swatch"></div>
  <div class="vals">
    <div>HEX &nbsp;<span id="vhex">#—</span></div>
    <div>RGB &nbsp;<span id="vrgb">—</span></div>
    <div>HSL &nbsp;<span id="vhsl">—</span></div>
  </div>
</div>
<script>
const canvas=document.getElementById('spectrum');
const ctx=canvas.getContext('2d');
canvas.width=360;canvas.height=200;
// Draw hue gradient
const hGrad=ctx.createLinearGradient(0,0,360,0);
for(let h=0;h<=360;h+=10)hGrad.addColorStop(h/360,\`hsl(\${h},100%,50%)\`);
ctx.fillStyle=hGrad;ctx.fillRect(0,0,360,200);
// White overlay
const wGrad=ctx.createLinearGradient(0,0,0,200);
wGrad.addColorStop(0,'rgba(255,255,255,1)');wGrad.addColorStop(1,'rgba(255,255,255,0)');
ctx.fillStyle=wGrad;ctx.fillRect(0,0,360,200);
// Black overlay
const bGrad=ctx.createLinearGradient(0,0,0,200);
bGrad.addColorStop(0,'rgba(0,0,0,0)');bGrad.addColorStop(1,'rgba(0,0,0,1)');
ctx.fillStyle=bGrad;ctx.fillRect(0,0,360,200);

const mag=document.getElementById('magnifier');
const magCtx=document.getElementById('mag').getContext('2d');
document.getElementById('mag').width=80;document.getElementById('mag').height=80;

function toHex(r,g,b){return'#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('')}
function toHsl(r,g,b){r/=255;g/=255;b/=255;const max=Math.max(r,g,b),min=Math.min(r,g,b);let h,s,l=(max+min)/2;
  if(max===min){h=s=0}else{const d=max-min;s=l>0.5?d/(2-max-min):d/(max+min);
  switch(max){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;case b:h=(r-g)/d+4;break}h/=6;}
  return\`hsl(\${Math.round(h*360)},\${Math.round(s*100)}%,\${Math.round(l*100)}%)\`}

canvas.addEventListener('mousemove',e=>{
  const rect=canvas.getBoundingClientRect();
  const mx=e.clientX-rect.left,my=e.clientY-rect.top;
  const px=Math.round(mx*(360/rect.width)),py=Math.round(my*(200/rect.height));
  const data=ctx.getImageData(px,py,1,1).data;
  const [r,g,b]=data;
  const hex=toHex(r,g,b);
  document.getElementById('swatch').style.background=hex;
  document.getElementById('vhex').textContent=hex;
  document.getElementById('vrgb').textContent=\`\${r}, \${g}, \${b}\`;
  document.getElementById('vhsl').textContent=toHsl(r,g,b);
  // magnifier
  mag.style.display='block';
  mag.style.left=e.clientX-canvas.getBoundingClientRect().left+'px';
  mag.style.top=e.clientY-canvas.getBoundingClientRect().top+'px';
  magCtx.save();magCtx.scale(3,3);
  magCtx.drawImage(canvas,px-13,py-13,26,26,0,0,26,26);
  magCtx.restore();
  // crosshair
  magCtx.strokeStyle='rgba(255,255,255,0.7)';magCtx.lineWidth=1;
  magCtx.beginPath();magCtx.moveTo(40,0);magCtx.lineTo(40,80);magCtx.stroke();
  magCtx.beginPath();magCtx.moveTo(0,40);magCtx.lineTo(80,40);magCtx.stroke();
});
canvas.addEventListener('mouseleave',()=>mag.style.display='none');
</script></body></html>`,
  },
  {
    id: 2,
    name: 'WCAG Contrast Checker',
    description: 'Check foreground/background pair against WCAG AA and AAA standards.',
    tags: ['accessibility', 'color', 'WCAG'],
    code: `<!DOCTYPE html><html><head><style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#080b10;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'JetBrains Mono',monospace;color:#e2e8f0;padding:20px}
.card{background:#0d1117;border:1px solid #1e2530;border-radius:14px;padding:28px;width:340px}
h2{font-family:'Syne',sans-serif;font-size:1.1rem;margin-bottom:20px;color:#5eead4}
.row{display:flex;flex-direction:column;gap:6px;margin-bottom:16px}
label{font-size:0.7rem;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em}
.color-row{display:flex;align-items:center;gap:10px}
input[type=color]{width:42px;height:38px;border:1px solid #1e2530;background:none;cursor:pointer;border-radius:6px;padding:2px}
input[type=text]{flex:1;background:#080b10;border:1px solid #1e2530;border-radius:6px;padding:8px 10px;color:#e2e8f0;font-family:'JetBrains Mono',monospace;font-size:0.8rem}
#preview{border-radius:10px;padding:18px 20px;margin:20px 0;font-size:1rem;text-align:center;transition:all 0.2s;line-height:1.6}
.ratio-num{font-size:2.2rem;font-weight:700;color:#5eead4;text-align:center;margin:10px 0}
.badges{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
.badge{font-size:0.7rem;padding:4px 12px;border-radius:20px;font-weight:600;letter-spacing:.05em}
.pass{background:#052e16;color:#4ade80;border:1px solid #166534}
.fail{background:#1c0606;color:#f87171;border:1px solid #7f1d1d}
</style></head><body>
<div class="card">
  <h2>WCAG Contrast Checker</h2>
  <div class="row">
    <label>Foreground</label>
    <div class="color-row">
      <input type="color" id="fg" value="#e2e8f0">
      <input type="text" id="fgtext" value="#e2e8f0">
    </div>
  </div>
  <div class="row">
    <label>Background</label>
    <div class="color-row">
      <input type="color" id="bg" value="#0d1117">
      <input type="text" id="bgtext" value="#0d1117">
    </div>
  </div>
  <div id="preview">The quick brown fox jumps over the lazy dog</div>
  <div class="ratio-num" id="ratio">—</div>
  <div class="badges" id="badges"></div>
</div>
<script>
function hexToRgb(hex){hex=hex.replace('#','');if(hex.length===3)hex=hex.split('').map(c=>c+c).join('');const n=parseInt(hex,16);return[n>>16&255,n>>8&255,n&255]}
function luminance([r,g,b]){return[r,g,b].map(v=>{v/=255;return v<=0.04045?v/12.92:Math.pow((v+0.055)/1.055,2.4)}).reduce((a,v,i)=>a+v*[0.2126,0.7152,0.0722][i],0)}
function contrast(h1,h2){const l1=luminance(hexToRgb(h1)),l2=luminance(hexToRgb(h2));const [hi,lo]=l1>l2?[l1,l2]:[l2,l1];return (hi+0.05)/(lo+0.05)}
function update(){
  const fg=document.getElementById('fg').value;
  const bg=document.getElementById('bg').value;
  document.getElementById('fgtext').value=fg;
  document.getElementById('bgtext').value=bg;
  const r=contrast(fg,bg);
  document.getElementById('ratio').textContent=r.toFixed(2)+':1';
  const preview=document.getElementById('preview');
  preview.style.color=fg;preview.style.background=bg;
  const b=document.getElementById('badges');
  const tests=[
    {label:'AA Normal',min:4.5},
    {label:'AA Large',min:3},
    {label:'AAA Normal',min:7},
    {label:'AAA Large',min:4.5},
  ];
  b.innerHTML=tests.map(t=>\`<span class="badge \${r>=t.min?'pass':'fail'}">\${r>=t.min?'✓':'✗'} \${t.label}</span>\`).join('');
}
['fg','bg'].forEach(id=>{
  document.getElementById(id).addEventListener('input',update);
  document.getElementById(id+'text').addEventListener('input',e=>{document.getElementById(id).value=e.target.value;update()});
});
update();
</script></body></html>`,
  },
]

// ─── TEXT ANIMATIONS ─────────────────────────────────────────────────────────

export const text_animations = [
  {
    id: 1,
    name: 'Glitch Cipher',
    description: 'Characters scramble through random cipher before resolving to final text.',
    tags: ['glitch', 'cipher', 'text', 'animation'],
    code: `<!DOCTYPE html><html><head><style>
*{margin:0;padding:0}
body{background:#080b10;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'JetBrains Mono',monospace}
h1{font-size:clamp(1.6rem,4vw,3rem);color:#5eead4;letter-spacing:.12em;cursor:pointer;user-select:none;text-shadow:0 0 30px rgba(94,234,212,0.4)}
p{color:#94a3b8;font-size:0.7rem;text-align:center;margin-top:14px;letter-spacing:.1em}
</style></head><body>
<div style="text-align:center">
<h1 id="txt">MATHEMATICAL</h1>
<p>click to replay</p>
</div>
<script>
const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
const target='MATHEMATICAL';
const el=document.getElementById('txt');
function scramble(){
  let iter=0;
  clearInterval(el._int);
  el._int=setInterval(()=>{
    el.textContent=target.split('').map((c,i)=>{
      if(i<iter)return c;
      return chars[Math.floor(Math.random()*chars.length)];
    }).join('');
    if(iter>=target.length){clearInterval(el._int);el.textContent=target;}
    iter+=0.35;
  },40);
}
el.addEventListener('click',scramble);
scramble();
</script></body></html>`,
  },
  {
    id: 2,
    name: 'Wave Type',
    description: 'Each letter rides a sine wave with staggered phase offsets.',
    tags: ['sine', 'wave', 'CSS', 'animation'],
    code: `<!DOCTYPE html><html><head><style>
*{margin:0;padding:0}
body{background:#080b10;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'Syne',sans-serif}
#wave{display:flex;gap:0px;font-size:clamp(2rem,5vw,4rem);font-weight:800;color:#e2e8f0}
.ch{display:inline-block;animation:wave 1.6s ease-in-out infinite}
@keyframes wave{0%,100%{transform:translateY(0);color:#e2e8f0}50%{transform:translateY(-18px);color:#5eead4}}
</style></head><body>
<div id="wave"></div>
<script>
const word='MATHBITS';
const el=document.getElementById('wave');
word.split('').forEach((ch,i)=>{
  const span=document.createElement('span');
  span.className='ch';
  span.textContent=ch===' '?' ':ch;
  span.style.animationDelay=\`\${i*0.12}s\`;
  el.appendChild(span);
});
</script></body></html>`,
  },
  {
    id: 3,
    name: 'Typewriter Matrix',
    description: 'Multi-line typewriter that cycles through math equations.',
    tags: ['typewriter', 'equations', 'loop'],
    code: `<!DOCTYPE html><html><head><style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#080b10;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'JetBrains Mono',monospace;padding:20px}
.wrap{width:100%;max-width:480px}
.line{font-size:clamp(0.9rem,2.5vw,1.3rem);color:#5eead4;border-right:2px solid #5eead4;padding-right:4px;white-space:nowrap;overflow:hidden;margin-bottom:8px;min-height:1.6em}
.label{font-size:0.65rem;color:#94a3b8;letter-spacing:.1em;margin-bottom:4px}
</style></head><body>
<div class="wrap">
  <div class="label">// equations.js</div>
  <div class="line" id="tl"></div>
</div>
<script>
const eqs=[
  'E = mc²',
  '∇·E = ρ/ε₀',
  'iℏ∂ψ/∂t = Ĥψ',
  'F = G(m₁m₂)/r²',
  'e^(iπ) + 1 = 0',
  'ds² = -c²dt² + dx²',
  '∮ B·dA = 0',
];
let ei=0,ci=0,deleting=false,wait=0;
const el=document.getElementById('tl');
function tick(){
  const eq=eqs[ei];
  if(wait>0){wait--;setTimeout(tick,80);return;}
  if(!deleting){
    el.textContent=eq.slice(0,ci+1);
    ci++;
    if(ci>=eq.length){wait=22;deleting=true;}
    setTimeout(tick,90);
  } else {
    el.textContent=eq.slice(0,ci);
    ci--;
    if(ci<0){deleting=false;ei=(ei+1)%eqs.length;ci=0;wait=5;}
    setTimeout(tick,45);
  }
}
tick();
</script></body></html>`,
  },
  {
    id: 4,
    name: 'Particle Text Burst',
    description: 'Text explodes into particles and reforms on hover.',
    tags: ['particles', 'canvas', 'interactive'],
    code: `<!DOCTYPE html><html><head><style>
*{margin:0;padding:0}
body{background:#080b10;overflow:hidden;width:100vw;height:100vh;display:flex;align-items:center;justify-content:center}
canvas{position:absolute;top:0;left:0}
p{position:relative;z-index:2;color:#94a3b8;font-family:'JetBrains Mono',monospace;font-size:0.7rem;bottom:-160px}
</style></head><body>
<canvas id="c"></canvas>
<script>
const c=document.getElementById('c');
const ctx=c.getContext('2d');
let W,H;
function resize(){W=c.width=window.innerWidth;H=c.height=window.innerHeight}
resize();window.addEventListener('resize',()=>{resize();init()});
let particles=[];
let exploded=false;
function sampleText(){
  const off=document.createElement('canvas');
  off.width=W;off.height=H;
  const octx=off.getContext('2d');
  octx.fillStyle='#fff';
  octx.font=\`bold \${Math.min(W/5,100)}px Syne,sans-serif\`;
  octx.textAlign='center';octx.textBaseline='middle';
  octx.fillText('MATH',W/2,H/2);
  const data=octx.getImageData(0,0,W,H).data;
  const pts=[];
  for(let y=0;y<H;y+=5)for(let x=0;x<W;x+=5)
    if(data[(y*W+x)*4+3]>128)pts.push({tx:x,ty:y,x:Math.random()*W,y:Math.random()*H,vx:0,vy:0});
  return pts;
}
function init(){particles=sampleText();}
init();
let mouse={x:W/2,y:H/2};
window.addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;});
c.addEventListener('click',()=>{
  exploded=!exploded;
  if(exploded)particles.forEach(p=>{p.vx=(Math.random()-0.5)*18;p.vy=(Math.random()-0.5)*18;});
});
function draw(){
  ctx.fillStyle='rgba(8,11,16,0.25)';ctx.fillRect(0,0,W,H);
  particles.forEach(p=>{
    if(exploded){
      p.x+=p.vx;p.y+=p.vy;p.vx*=0.95;p.vy*=0.95;p.vy+=0.15;
    } else {
      const dx=p.tx-p.x,dy=p.ty-p.y;
      p.x+=dx*0.08;p.y+=dy*0.08;
    }
    const d=Math.hypot(mouse.x-p.x,mouse.y-p.y);
    if(d<60&&!exploded){p.x+=((p.x-mouse.x)/d)*3;p.y+=((p.y-mouse.y)/d)*3;}
    const hue=180+Math.random()*30;
    ctx.fillStyle=\`hsla(\${hue},70%,65%,0.85)\`;
    ctx.fillRect(p.x,p.y,2,2);
  });
  requestAnimationFrame(draw);
}
draw();
</script></body></html>`,
  },
]

// ─── ANIMATIONS ───────────────────────────────────────────────────────────────

export const animations = [
  {
    id: 1,
    name: 'Mandelbrot Zoom',
    description: 'Real-time Mandelbrot set rendered and slowly zooming into a spiral.',
    tags: ['mandelbrot', 'fractal', 'canvas'],
    code: `<!DOCTYPE html><html><head><style>
*{margin:0;padding:0}body{background:#080b10;overflow:hidden;width:100vw;height:100vh}
canvas{display:block}p{position:fixed;bottom:12px;right:14px;font-family:'JetBrains Mono',monospace;font-size:0.65rem;color:#5eead4;opacity:0.6}
</style></head><body><canvas id="c"></canvas><p>Mandelbrot Set</p><script>
const c=document.getElementById('c');
const ctx=c.getContext('2d');
let W=c.width=window.innerWidth,H=c.height=window.innerHeight;
let zoom=0.003,cx=-0.7269,cy=0.1889,zoomF=0.992,frame=0;
function drawMandelbrot(){
  const img=ctx.createImageData(W,H);
  const d=img.data;
  const maxIter=80;
  for(let py=0;py<H;py++){
    for(let px=0;px<W;px++){
      const x0=(px-W/2)*zoom+cx,y0=(py-H/2)*zoom+cy;
      let x=0,y=0,iter=0;
      while(x*x+y*y<=4&&iter<maxIter){const xt=x*x-y*y+x0;y=2*x*y+y0;x=xt;iter++;}
      const p=(py*W+px)*4;
      if(iter===maxIter){d[p]=8;d[p+1]=11;d[p+2]=16;d[p+3]=255;}
      else{const t=iter/maxIter;const hue=200+t*120;
        const r=Math.round(Math.sin(t*Math.PI)*180);
        const g=Math.round(Math.sin(t*Math.PI+2)*120+40);
        const b=Math.round(Math.sin(t*Math.PI+4)*200+55);
        d[p]=r;d[p+1]=g;d[p+2]=b;d[p+3]=255;}
    }
  }
  ctx.putImageData(img,0,0);
  zoom*=zoomF;frame++;
  if(zoom<1e-6)zoom=0.003;
  setTimeout(()=>requestAnimationFrame(drawMandelbrot),60);
}
drawMandelbrot();
</script></body></html>`,
  },
  {
    id: 2,
    name: 'Spring Physics',
    description: 'Draggable ball connected to anchor via spring with damping simulation.',
    tags: ['physics', 'spring', 'interactive'],
    code: `<!DOCTYPE html><html><head><style>
*{margin:0;padding:0}body{background:#080b10;overflow:hidden;width:100vw;height:100vh}
canvas{display:block;cursor:grab}canvas:active{cursor:grabbing}
p{position:fixed;bottom:12px;left:50%;transform:translateX(-50%);font-family:'JetBrains Mono',monospace;font-size:0.65rem;color:#94a3b8}
</style></head><body><canvas id="c"></canvas><p>drag the ball</p><script>
const c=document.getElementById('c');
const ctx=c.getContext('2d');
let W=c.width=window.innerWidth,H=c.height=window.innerHeight;
const anchor={x:W/2,y:H/3};
const ball={x:W/2,y:H/2,vx:5,vy:0};
const K=0.04,DAMP=0.92,REST=120;
let dragging=false,trail=[];
function getPos(e){const r=c.getBoundingClientRect();const t=e.touches?e.touches[0]:e;return{x:t.clientX-r.left,y:t.clientY-r.top}}
c.addEventListener('mousedown',e=>{const p=getPos(e);if(Math.hypot(p.x-ball.x,p.y-ball.y)<22){dragging=true;}});
window.addEventListener('mouseup',()=>dragging=false);
window.addEventListener('mousemove',e=>{if(dragging){const p=getPos(e);ball.x=p.x;ball.y=p.y;ball.vx=0;ball.vy=0;}});
function draw(){
  ctx.fillStyle='rgba(8,11,16,0.2)';ctx.fillRect(0,0,W,H);
  if(!dragging){
    const dx=ball.x-anchor.x,dy=ball.y-anchor.y;
    const dist=Math.hypot(dx,dy);
    const force=(dist-REST)*K;
    ball.vx-=(dx/dist)*force;ball.vy-=(dy/dist)*force;
    ball.vx*=DAMP;ball.vy*=DAMP;
    ball.x+=ball.vx;ball.y+=ball.vy;
  }
  trail.push({x:ball.x,y:ball.y});
  if(trail.length>80)trail.shift();
  // spring line
  ctx.beginPath();ctx.moveTo(anchor.x,anchor.y);
  const segs=14;
  for(let i=0;i<=segs;i++){
    const t=i/segs;
    const lx=anchor.x+(ball.x-anchor.x)*t;
    const ly=anchor.y+(ball.y-anchor.y)*t;
    const perp=Math.cos(i*1.2)*12*(1-Math.abs(t-0.5)*2);
    const nx=-(ball.y-anchor.y)/Math.hypot(ball.x-anchor.x,ball.y-anchor.y);
    const ny=(ball.x-anchor.x)/Math.hypot(ball.x-anchor.x,ball.y-anchor.y);
    i===0?ctx.moveTo(lx,ly):ctx.lineTo(lx+nx*perp,ly+ny*perp);
  }
  ctx.strokeStyle='rgba(129,140,248,0.6)';ctx.lineWidth=2;ctx.stroke();
  // anchor
  ctx.beginPath();ctx.arc(anchor.x,anchor.y,7,0,Math.PI*2);
  ctx.fillStyle='#818cf8';ctx.fill();
  // trail
  if(trail.length>2){ctx.beginPath();ctx.moveTo(trail[0].x,trail[0].y);
    trail.forEach(p=>ctx.lineTo(p.x,p.y));
    ctx.strokeStyle='rgba(94,234,212,0.25)';ctx.lineWidth=1.5;ctx.stroke();}
  // ball
  const grad=ctx.createRadialGradient(ball.x-5,ball.y-5,2,ball.x,ball.y,22);
  grad.addColorStop(0,'#5eead4');grad.addColorStop(1,'#0d4f47');
  ctx.beginPath();ctx.arc(ball.x,ball.y,18,0,Math.PI*2);
  ctx.fillStyle=grad;ctx.fill();
  ctx.strokeStyle='rgba(94,234,212,0.5)';ctx.lineWidth=2;ctx.stroke();
  requestAnimationFrame(draw);
}
draw();
</script></body></html>`,
  },
  {
    id: 3,
    name: 'Cellular Automata',
    description: "Conway's Game of Life with glowing teal cells on dark grid.",
    tags: ['cellular', 'automata', 'gameoflife'],
    code: `<!DOCTYPE html><html><head><style>
*{margin:0;padding:0}body{background:#080b10;overflow:hidden;width:100vw;height:100vh}
canvas{display:block}p{position:fixed;bottom:12px;left:50%;transform:translateX(-50%);font-family:'JetBrains Mono',monospace;font-size:0.65rem;color:#94a3b8}
</style></head><body><canvas id="c"></canvas><p>click to randomize</p><script>
const c=document.getElementById('c');
const ctx=c.getContext('2d');
const S=10;
let COLS,ROWS,grid,next;
function resize(){COLS=Math.floor(window.innerWidth/S);ROWS=Math.floor(window.innerHeight/S);c.width=COLS*S;c.height=ROWS*S;init();}
function init(){grid=Array.from({length:ROWS},()=>Array.from({length:COLS},()=>Math.random()<0.3?1:0));}
function step(){
  next=grid.map((row,r)=>row.map((_,col)=>{
    let n=0;
    for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){
      if(dr===0&&dc===0)continue;
      const nr=(r+dr+ROWS)%ROWS,nc=(col+dc+COLS)%COLS;
      n+=grid[nr][nc];
    }
    if(grid[r][col])return(n===2||n===3)?1:0;
    return n===3?1:0;
  }));
  grid=next;
}
function draw(){
  ctx.fillStyle='#080b10';ctx.fillRect(0,0,c.width,c.height);
  grid.forEach((row,r)=>row.forEach((cell,col)=>{
    if(cell){
      ctx.fillStyle='#5eead4';
      ctx.shadowBlur=8;ctx.shadowColor='#5eead4';
      ctx.fillRect(col*S+1,r*S+1,S-2,S-2);
      ctx.shadowBlur=0;
    }
  }));
  step();
  setTimeout(()=>requestAnimationFrame(draw),90);
}
resize();window.addEventListener('resize',resize);
c.addEventListener('click',init);
draw();
</script></body></html>`,
  },
]

// ─── AGGREGATED EXPORT ────────────────────────────────────────────────────────

export const mockData = {
  backgrounds,
  color_checker,
  text_animations,
  animations,
}

export default mockData
