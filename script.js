(function(){
var R=document.documentElement,$=function(s){return document.querySelector(s)},all=function(s){return document.querySelectorAll(s)};
var still=matchMedia('(prefers-reduced-motion:reduce)').matches,fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
/* theme: birana (parchment) <-> dark */
var btn=$('#theme');function paint(){var d=R.getAttribute('data-theme')==='dark';btn.innerHTML=d?'<span class="g" aria-hidden="true">\u1265\u122B\u1293</span> Birana':'\u263E Dark';btn.setAttribute('aria-label',d?'Switch to birana parchment theme':'Switch to dark theme')}
btn.addEventListener('click',function(){var n=R.getAttribute('data-theme')==='dark'?'light':'dark';R.setAttribute('data-theme',n);try{localStorage.setItem('theme',n)}catch(e){}paint()});paint();
$('#yr').textContent=new Date().getFullYear();
/* scroll progress + reveal */
var bar=$('#bar');function sp(){var h=R.scrollHeight-innerHeight;bar.style.transform='scaleX('+(h>0?scrollY/h:0)+')'}addEventListener('scroll',sp,{passive:true});sp();
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});all('.rv').forEach(function(n){io.observe(n)});
/* name: letters swell near the pointer (idle wave on touch) */
var ls=[];all('h1 .row').forEach(function(r){var t=r.textContent;r.setAttribute('aria-hidden','true');r.textContent='';t.split('').forEach(function(c){var s=document.createElement('span');s.className='l';s.textContent=c;r.appendChild(s);ls.push(s)})});
var mx=-999,my=-999;function swell(w){ls.forEach(function(s,i){var b=s.getBoundingClientRect(),d=fine?Math.hypot(b.left+b.width/2-mx,b.top+b.height/2-my):0,v=fine?350+450*Math.max(0,1-d/280):w(i);s.style.fontWeight=Math.round(v)})}
if(!still){if(fine){addEventListener('pointermove',function(e){mx=e.clientX;my=e.clientY;swell()})}else{(function f(t){swell(function(i){return 480+220*Math.sin(t/700+i*.6)});requestAnimationFrame(f)})(0)}}
/* AlgoVisuals: live bubble sort */
var sv=$('#sort');if(sv){var N=16,a=[],bs=[];for(var i=0;i<N;i++){var b=document.createElement('i');sv.appendChild(b);bs.push(b)}
function shuf(){a=[];for(var i=1;i<=N;i++)a.push(i);if(!still)a.sort(function(){return Math.random()-.5});else a.reverse();draw(-1,-1)}
function draw(x,y,done){bs.forEach(function(b,i){b.style.height=(a[i]/N*100)+'%';b.className=done||i>N-1-ps?'d':(i===x||i===y?'c':'')})}
var ps=0,i=0,run=false,tm;function step(){if(!run)return;if(ps>=N-1){draw(-1,-1,1);tm=setTimeout(function(){ps=0;i=0;shuf();step()},1600);return}
if(i>=N-1-ps){ps++;i=0}else{if(a[i]>a[i+1]){var t=a[i];a[i]=a[i+1];a[i+1]=t}draw(i,i+1);i++}tm=setTimeout(step,still?9999:110)}
shuf();new IntersectionObserver(function(es){run=es[0].isIntersecting&&!still;clearTimeout(tm);if(run)step()}).observe(sv)}
/* toolbox filter */
var tools=$('#tools'),items=tools.querySelectorAll('.t'),fb=all('.filters button'),fc=$('#fcount');
fb.forEach(function(b){b.addEventListener('click',function(){var f=b.getAttribute('data-f'),n=0;fb.forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});tools.classList.toggle('filtering',f!=='all');
items.forEach(function(t){var on=f!=='all'&&(t.getAttribute('data-p')||'').indexOf(f)>-1;t.classList.toggle('on',on);if(on)n++});
fc.textContent=f==='all'?'Showing all '+items.length+' tools.':n+' tools used in '+b.textContent+'.'})});
/* copy email */
var cp=$('#copy');cp.addEventListener('click',function(){var m='samuelmifta@gmail.com',ok=function(){cp.textContent='Copied \u2713';setTimeout(function(){cp.textContent='Copy email'},1800)};
try{navigator.clipboard.writeText(m).then(ok)}catch(e){location.href='mailto:'+m}})
/* lanyard: pendulum you can grab */
var ln=$('#lanyard'),sw=$('#swing');if(ln&&sw){var th=still?3:16,om=0,dr=false,mv=0,run2=false,lt=0;
function put(){sw.style.transform='rotate('+th+'deg)'}put();
function tick(t){var dt=Math.min(.033,(t-lt)/1000||.016);lt=t;if(!dr){om+=(-30*th-1.1*om)*dt;th+=om*dt}put();if(dr||Math.abs(th)>.04||Math.abs(om)>.04){requestAnimationFrame(tick)}else{run2=false;th=0;put()}}
function go(){if(still||run2)return;run2=true;lt=performance.now();requestAnimationFrame(tick)}
var card=sw.querySelector('.idc');card.addEventListener('pointerdown',function(e){dr=true;mv=0;card.setPointerCapture(e.pointerId);go()});
card.addEventListener('pointermove',function(e){if(!dr)return;var r=ln.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=Math.max(80,e.clientY-r.top),n=Math.max(-55,Math.min(55,Math.atan2(dx,dy)*57.3));mv+=Math.abs(n-th);om=(n-th)*30;th=n});
function rel(){dr=false;go()}card.addEventListener('pointerup',rel);card.addEventListener('pointercancel',rel);
card.addEventListener('click',function(e){if(mv>6){e.preventDefault();e.stopPropagation()}},true);
var ly=scrollY;addEventListener('scroll',function(){om+=(scrollY-ly)*.35;ly=scrollY;go()},{passive:true});go()}
/* AlgoVisuals portal */
var pt=$('#portal'),al=$('#algo'),pfr=$('#pframe');
if(pt&&al){function op(e){if(e.metaKey||e.ctrlKey||e.shiftKey||e.button===1)return;e.preventDefault();pt.style.setProperty('--x',e.clientX+'px');pt.style.setProperty('--y',e.clientY+'px');if(!pfr.src||pfr.src==='about:blank'||pfr.getAttribute('src')===null)pfr.src='https://algovisuals-sami.vercel.app/';pt.classList.add('open');$('#pclose').focus()}
function cl(){pt.classList.remove('open');al.focus()}al.addEventListener('click',op);$('#pclose').addEventListener('click',cl);addEventListener('keydown',function(e){if(e.key==='Escape'&&pt.classList.contains('open'))cl()})}
/* SMS deck */
var dk=$('#deck');if(dk){var sl=[].slice.call(dk.querySelectorAll('.sl')),cu=0,vd=dk.querySelector('video'),dc=$('#dcount'),sx=0,dd=false;
function lay(){sl.forEach(function(x,i){var o=(i-cu+sl.length)%sl.length;x.style.setProperty('--o',o);x.style.zIndex=sl.length-o;x.style.visibility=o>3?'hidden':'visible'});dc.textContent=(cu+1)+' / '+sl.length;if(vd){if(cu===0&&!still){var p=vd.play();if(p&&p.catch)p.catch(function(){})}else vd.pause()}}
function nx(d){cu=(cu+d+sl.length)%sl.length;lay()}$('#dnext').addEventListener('click',function(){nx(1)});$('#dprev').addEventListener('click',function(){nx(-1)});
dk.addEventListener('keydown',function(e){if(e.key==='ArrowRight')nx(1);if(e.key==='ArrowLeft')nx(-1)});
dk.addEventListener('pointerdown',function(e){dd=true;sx=e.clientX;dk.setPointerCapture(e.pointerId);sl[cu].classList.add('drag')});
dk.addEventListener('pointermove',function(e){if(!dd)return;var d=e.clientX-sx,f=sl[cu];f.style.setProperty('--dx',d+'px');f.style.setProperty('--r',d/22)});
function de(e){if(!dd)return;dd=false;var f=sl[cu],d=e.clientX-sx;f.classList.remove('drag');f.style.setProperty('--dx','0px');f.style.setProperty('--r',0);if(Math.abs(d)>70)nx(d<0?1:-1)}
dk.addEventListener('pointerup',de);dk.addEventListener('pointercancel',de);lay();
new IntersectionObserver(function(es){if(!es[0].isIntersecting&&vd)vd.pause();else lay()}).observe(dk)}
})();
