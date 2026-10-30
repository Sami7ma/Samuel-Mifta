(function () {
    var R = document.documentElement, $ = function (s) { return document.querySelector(s) }, all = function (s) { return document.querySelectorAll(s) };
    var still = matchMedia('(prefers-reduced-motion:reduce)').matches, fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
    /* theme: birana (parchment) <-> dark */
    var btn = $('#theme'); function paint() { var d = R.getAttribute('data-theme') === 'dark'; btn.innerHTML = d ? '<span class="g" aria-hidden="true">\u1265\u122B\u1293</span> Birana' : '\u263E Dark'; btn.setAttribute('aria-label', d ? 'Switch to birana parchment theme' : 'Switch to dark theme') }
    btn.addEventListener('click', function () { var n = R.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; R.setAttribute('data-theme', n); try { localStorage.setItem('theme', n) } catch (e) { } paint() }); paint();
    $('#yr').textContent = new Date().getFullYear();
    /* scroll progress + reveal */
    var bar = $('#bar'); function sp() { var h = R.scrollHeight - innerHeight; bar.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')' } addEventListener('scroll', sp, { passive: true }); sp();
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }) }, { threshold: .12 }); all('.rv').forEach(function (n) { io.observe(n) });
    /* name: letters swell near the pointer (idle wave on touch) */
    var ls = []; all('h1 .row').forEach(function (r) { var t = r.textContent; r.setAttribute('aria-hidden', 'true'); r.textContent = ''; t.split('').forEach(function (c) { var s = document.createElement('span'); s.className = 'l'; s.textContent = c; r.appendChild(s); ls.push(s) }) });
    var mx = -999, my = -999; function swell(w) { ls.forEach(function (s, i) { var b = s.getBoundingClientRect(), d = fine ? Math.hypot(b.left + b.width / 2 - mx, b.top + b.height / 2 - my) : 0, v = fine ? 350 + 450 * Math.max(0, 1 - d / 280) : w(i); s.style.fontWeight = Math.round(v) }) }
    if (!still) { if (fine) { addEventListener('pointermove', function (e) { mx = e.clientX; my = e.clientY; swell() }) } else { (function f(t) { swell(function (i) { return 480 + 220 * Math.sin(t / 700 + i * .6) }); requestAnimationFrame(f) })(0) } }
    /* toolbox: pick a project and its tools gather right under the buttons (pick it again, or Everything, to put them back) */
    var tools = $('#tools'), tw = $('#tw'), pk = $('#picked'), fb = all('.filters button'), fc = $('#fcount'), curF = 'all', pkT;
    function vis() { return [].slice.call(tools.querySelectorAll('.t')).filter(function (t) { return !t.classList.contains('xtra') || t.classList.contains('show') }) }
    function used(t, f) { return (t.getAttribute('data-p') || '').indexOf(f) > -1 }
    function applyF() { var b = $('.filters [data-f="' + curF + '"]'), n = vis().filter(function (t) { return curF === 'all' || used(t, curF) }).length; fb.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false') }); fc.textContent = curF === 'all' ? 'Showing all ' + n + ' tools.' : n + ' tools used in ' + b.textContent + '.' }
    function choose(f) {
        var was = curF; if (f === curF && f !== 'all') f = 'all'; curF = f; applyF(); clearTimeout(pkT);
        if (f === 'all') {
            [].slice.call(pk.querySelectorAll('.t')).forEach(function (t, i) { t.style.animation = 'lift .3s ease-in ' + i * 30 + 'ms forwards' }); tw.classList.remove('away');
            if (was !== 'all') { vis().forEach(function (t, i) { t.style.setProperty('--k', i); t.classList.add('rv2') }); setTimeout(function () { vis().forEach(function (t) { t.classList.remove('rv2') }) }, 1500) }
            pkT = setTimeout(function () { pk.hidden = true; pk.innerHTML = '' }, 450); return
        }
        var src = vis().filter(function (t) { return used(t, f) }), from = was === 'all' ? src.map(function (t) { return t.getBoundingClientRect() }) : null, hd = document.createElement('p'), row = document.createElement('div');
        pk.innerHTML = ''; pk.hidden = false; hd.className = 'pk-h'; hd.innerHTML = '<b>' + $('.filters [data-f="' + f + '"]').textContent + '</b> \u00B7 built with ' + src.length + ' tools'; row.className = 'tl'; pk.appendChild(hd); pk.appendChild(row);
        var cl = src.map(function (t) { var c = t.cloneNode(true); c.classList.remove('xtra', 'show', 'leave'); c.removeAttribute('style'); row.appendChild(c); return c });
        tw.classList.add('away');
        cl.forEach(function (c, i) { if (!c.animate || still) return; var to = c.getBoundingClientRect(), kf = from ? [{ transform: 'translate(' + (from[i].left - to.left) + 'px,' + (from[i].top - to.top) + 'px) scale(.85)', opacity: .4 }, { transform: 'none', opacity: 1 }] : [{ opacity: 0, transform: 'translateY(-26px) scale(.78)', filter: 'blur(5px)' }, { opacity: 1, transform: 'none', filter: 'none' }]; c.animate(kf, { duration: from ? 800 : 600, delay: i * 55, easing: 'cubic-bezier(.2,.9,.25,1.08)', fill: 'backwards' }) })
    }
    fb.forEach(function (b) { b.addEventListener('click', function () { choose(b.getAttribute('data-f')) }) });
    /* More work: drops the extra project down and adds its tools with the same motion */
    var mb = $('#morebtn'), mp = $('#morepanel'), pcn = $('#pcount'), mOpen = false, mT;
    function setMore(open) {
        mOpen = open; clearTimeout(mT); mb.setAttribute('aria-expanded', open); mp.classList.toggle('open', open); if (open) mp.removeAttribute('inert'); else mp.setAttribute('inert', '');
        mb.querySelector('.mt').textContent = open ? 'Less work' : 'More work'; mb.querySelector('.mc').textContent = open ? 'hide' : '+1 project'; pcn.textContent = open ? '04 projects' : '03 projects';
        var ex = [].slice.call(all('.t.xtra,.filters button.xtra'));
        if (open) { ex.forEach(function (t, i) { t.style.setProperty('--i', i); t.classList.remove('leave'); t.classList.add('show') }); applyF() }
        else { if (curF === 'p') choose('all'); ex.forEach(function (t, i) { t.style.setProperty('--i', i); t.classList.add('leave') }); applyF(); mT = setTimeout(function () { ex.forEach(function (t) { t.classList.remove('show', 'leave') }); applyF() }, 650) }
    }
    mb.addEventListener('click', function () { setMore(!mOpen) });
    var nm = $('nav a[href="#more"]'); if (nm) nm.addEventListener('click', function () { if (!mOpen) setMore(true) });
    /* lanyard: an elastic strap. Pull as hard as you like, it stretches, snaps back and bounces */
    var rl = $('#lanyard'), sw = $('#swing'), st = $('#strap');
    if (rl && sw && st) {
        var cd = sw.querySelector('.idc'), G = 1500, K = 70, L0 = 92, Lr = L0 + G / K, cx = 0, cw = 0, x = 0, y = 0, vx = 0, vy = 0, ph = 0, pw = 0, drag = false, tx = 0, ty = 0, ox = 0, oy = 0, mv = 0, raf = 0, lt = 0, asleep = true;
        function draw() {
            var d = Math.max(1, Math.hypot(x, y)), a = Math.atan2(x, y), s = d / Lr, w = Math.max(4, Math.min(34, 30 / Math.sqrt(Math.max(s, .5))));
            st.style.left = (cx - w / 2) + 'px'; st.style.width = w + 'px'; st.style.height = d + 'px'; st.style.transform = 'rotate(' + (-a) + 'rad)'; st.style.setProperty('--s', s.toFixed(3));
            sw.style.transform = 'translate(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px) rotate(' + ph.toFixed(4) + 'rad)'
        }
        function measure() { L0 = innerWidth > 760 ? Math.max(64, Math.min(170, innerHeight - 68 - cd.offsetHeight - G / K - 34)) : 92; Lr = L0 + G / K; cx = rl.clientWidth / 2; cw = sw.offsetWidth; sw.style.left = (cx - cw / 2) + 'px'; rl.style.height = (Lr + cd.offsetHeight + 30) + 'px'; if (still || asleep) { x = 0; y = Lr } draw() }
        function phys(dt) {
            if (drag) { var nx = tx, ny = ty, m = Math.hypot(nx, ny); if (m > 1500) { nx *= 1500 / m; ny *= 1500 / m } vx = vx * .5 + (nx - x) / dt * .5; vy = vy * .5 + (ny - y) / dt * .5; x = nx; y = ny }
            else { var d = Math.hypot(x, y) || 1e-6, ux = x / d, uy = y / d, f = -K * (d - L0), vr = vx * ux + vy * uy, tX = vx - vr * ux, tY = vy - vr * uy; vx += (f * ux - 3.2 * vr * ux - 1.7 * tX) * dt; vy += (G + f * uy - 3.2 * vr * uy - 1.7 * tY) * dt; x += vx * dt; y += vy * dt }
            var tg = Math.max(-1.3, Math.min(1.3, Math.atan2(x, y) * .9)); pw += (-70 * (ph - tg) - 5.5 * pw) * dt; ph += pw * dt
        }
        function tick(t) {
            raf = 0; var dt = Math.min(.05, (t - lt) / 1000 || .016); lt = t; var n = Math.ceil(dt / .008), h = dt / n; for (var i = 0; i < n; i++)phys(h); draw();
            if (drag || Math.abs(vx) + Math.abs(vy) > .6 || Math.abs(x) > .15 || Math.abs(y - Lr) > .15 || Math.abs(pw) > .01 || Math.abs(ph) > .002) { raf = requestAnimationFrame(tick) } else { asleep = true; x = 0; y = Lr; ph = 0; pw = 0; draw() }
        }
        function wake() { if (still || raf) return; if (asleep) { asleep = false; lt = performance.now() } raf = requestAnimationFrame(tick) }
        function pos(e) { var r = rl.getBoundingClientRect(); return [e.clientX - r.left - cx, e.clientY - r.top] }
        function mvf(e) { if (!drag) return; var p = pos(e), nx = p[0] - ox, ny = p[1] - oy; mv += Math.abs(nx - tx) + Math.abs(ny - ty); tx = nx; ty = ny; wake() }
        function upf() { if (!drag) return; drag = false; cd.classList.remove('grab'); var m = Math.hypot(vx, vy); if (m > 3000) { vx *= 3000 / m; vy *= 3000 / m } removeEventListener('pointermove', mvf); removeEventListener('pointerup', upf); removeEventListener('pointercancel', upf); wake() }
        if (!still) {
            cd.addEventListener('pointerdown', function (e) { if (e.button > 0) return; var p = pos(e); drag = true; mv = 0; ox = p[0] - x; oy = p[1] - y; tx = x; ty = y; cd.classList.add('grab'); addEventListener('pointermove', mvf); addEventListener('pointerup', upf); addEventListener('pointercancel', upf); wake() });
            cd.addEventListener('dragstart', function (e) { e.preventDefault() });
            cd.addEventListener('click', function (e) { if (mv > 6) { e.preventDefault(); e.stopPropagation() } }, true);
        }
        /* Take my card: it unclips, flies to the button and lands as a PDF of the card (white in light mode, Birana in dark) */
        var tbtn = $('#takebtn'), tnote = $('#takenote'), taking = false;
        function save(blob, name) { var u = URL.createObjectURL(blob), a = document.createElement('a'); a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u) }, 4000) }
        function vcf() { save(new Blob([['BEGIN:VCARD', 'VERSION:3.0', 'N:Mifta;Samuel;;;', 'FN:Samuel Mifta', 'TITLE:Software Engineer', 'EMAIL;TYPE=INTERNET:samuelmifta@gmail.com', 'URL:https://github.com/Sami7ma', 'URL:https://www.linkedin.com/in/samuel-mifta-062aaa263/', 'URL:https://t.me/sami7ma', 'NOTE:Telegram @sami7ma', 'END:VCARD'].join('\r\n')], { type: 'text/vcard' }), 'Samuel-Mifta.vcf') }
        function mkPdf(jpg, w, h, pw, ph, links) {
            var en = new TextEncoder(), ps = [new Uint8Array([37, 80, 68, 70, 45, 49, 46, 52, 10, 37, 226, 227, 207, 211, 10])], off = [], len = ps[0].length, n = 5 + links.length;
            function add(x) { var b = typeof x === 'string' ? en.encode(x) : x; ps.push(b); len += b.length }
            function ob(k, s) { off[k] = len; add(k + ' 0 obj\n' + s + '\nendobj\n') }
            ob(1, '<< /Type /Catalog /Pages 2 0 R >>'); ob(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
            ob(3, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + pw + ' ' + ph + '] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R' + (links.length ? ' /Annots [' + links.map(function (l, i) { return (6 + i) + ' 0 R' }).join(' ') + ']' : '') + ' >>');
            off[4] = len; add('4 0 obj\n<< /Type /XObject /Subtype /Image /Width ' + w + ' /Height ' + h + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + jpg.length + ' >>\nstream\n'); add(jpg); add('\nendstream\nendobj\n');
            var cs = 'q ' + pw + ' 0 0 ' + ph + ' 0 0 cm /Im0 Do Q'; ob(5, '<< /Length ' + cs.length + ' >>\nstream\n' + cs + '\nendstream');
            links.forEach(function (l, i) { ob(6 + i, '<< /Type /Annot /Subtype /Link /Rect [' + l[0].toFixed(2) + ' ' + (ph - l[1] - l[3]).toFixed(2) + ' ' + (l[0] + l[2]).toFixed(2) + ' ' + (ph - l[1]).toFixed(2) + '] /Border [0 0 0] /H /N /A << /S /URI /URI (' + l[4] + ') >> >>') });
            var x = len, xr = 'xref\n0 ' + (n + 1) + '\n0000000000 65535 f \n'; for (var k = 1; k <= n; k++)xr += ('0000000000' + off[k]).slice(-10) + ' 00000 n \n';
            add(xr + 'trailer\n<< /Size ' + (n + 1) + ' /Root 1 0 R >>\nstartxref\n' + x + '\n%%EOF');
            return new Blob(ps, { type: 'application/pdf' })
        }
        function rr(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath() }
        function cardPdf() {
            var S = 4, W = 228, H = 397, M = 30, cs = getComputedStyle(cd), v = function (n, d) { return cs.getPropertyValue(n).trim() || d }, c1 = v('--cb1', '#fff'), c2 = v('--cb2', '#fcfaf6'), nt = v('--notch', '#e9e2d3'), pg = getComputedStyle(R).getPropertyValue('--bg').trim() || '#ecdcb4',
            fs = ['600 21px Fraunces', '500 19px Fraunces', '500 12px "IBM Plex Mono"'];
            var mi = getComputedStyle(document.querySelector('.mk')).webkitMaskImage || getComputedStyle(document.querySelector('.mk')).maskImage || '', mu = mi.replace(/^url\(["']?/, '').replace(/["']?\)$/, ''), mkImg = null;
            return Promise.all(fs.map(function (f) { return document.fonts ? document.fonts.load(f) : 0 }).concat([new Promise(function (r) { var im = new Image(); im.onload = function () { mkImg = im; r() }; im.onerror = function () { r() }; im.src = mu })])).catch(function () { }).then(function () {
                var cv = document.createElement('canvas'); cv.width = (W + 2 * M) * S; cv.height = (H + 2 * M) * S; var g = cv.getContext('2d'); g.scale(S, S);
                g.fillStyle = pg; g.fillRect(0, 0, W + 2 * M, H + 2 * M); g.translate(M, M);
                g.save(); g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = 26; g.shadowOffsetY = 12; rr(g, 0, 0, W, H, 18); var gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, c1); gr.addColorStop(1, c2); g.fillStyle = gr; g.fill(); g.restore();
                g.lineWidth = 1; g.strokeStyle = 'rgba(80,55,25,.14)'; rr(g, .5, .5, W - 1, H - 1, 18); g.stroke(); g.strokeStyle = 'rgba(176,141,87,.55)'; rr(g, 5.5, 5.5, W - 11, H - 11, 13); g.stroke();
                g.fillStyle = nt; rr(g, W / 2 - 23, 19, 46, 8, 4); g.fill();
                var bg2 = g.createLinearGradient(18, 41, 70, 93); bg2.addColorStop(0, '#8f2338'); bg2.addColorStop(1, '#561321'); g.fillStyle = bg2; rr(g, 18, 41, 52, 52, 15); g.fill(); g.strokeStyle = 'rgba(214,178,106,.6)'; g.lineWidth = 1; rr(g, 18.5, 41.5, 51, 51, 14.5); g.stroke();
                if (mkImg) { var t = document.createElement('canvas'); t.width = t.height = 41 * S; var q = t.getContext('2d'), gg = q.createLinearGradient(0, 0, 41 * S, 41 * S); gg.addColorStop(0, '#f6e8bb'); gg.addColorStop(.48, '#d2ad66'); gg.addColorStop(1, '#9a7430'); q.fillStyle = gg; q.fillRect(0, 0, t.width, t.height); q.globalCompositeOperation = 'destination-in'; q.drawImage(mkImg, 0, 0, t.width, t.height); g.drawImage(t, 23.5, 46.5, 41, 41) } else { g.fillStyle = '#fff'; g.font = '600 21px Fraunces,Georgia,serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('SM', 44, 67.5) }
                g.textAlign = 'left'; g.textBaseline = 'alphabetic'; g.fillStyle = '#1c1613'; g.font = '500 19px Fraunces,Georgia,serif'; g.fillText('Samuel Mifta', 82, 62);
                g.globalAlpha = .7; g.font = '500 10.5px "IBM Plex Mono",ui-monospace,monospace'; try { g.letterSpacing = '.6px' } catch (e) { } g.fillText('SOFTWARE ENGINEER', 82, 80); g.globalAlpha = 1; try { g.letterSpacing = '0px' } catch (e) { }
                g.setLineDash([3, 3]); g.strokeStyle = 'rgba(28,22,19,.25)'; g.beginPath(); g.moveTo(18, 105); g.lineTo(W - 18, 105); g.stroke(); g.setLineDash([]);
                g.font = '500 12px "IBM Plex Mono",ui-monospace,monospace';
                [['i-mail', 'samuelmifta@gmail.com'], ['i-tg', '@sami7ma'], ['i-in', '/in/samuel-mifta'], ['i-gh', '@Sami7ma']].forEach(function (r, i) {
                    var y = 116 + i * 24, sy = document.getElementById(r[0]), vb = sy.getAttribute('viewBox').split(' ').map(Number), m = Math.max(vb[2], vb[3]), k = 16 / m;
                    g.save(); g.translate(18 + (16 - vb[2] * k) / 2, y + (16 - vb[3] * k) / 2); g.scale(k, k); g.fillStyle = '#1c1613'; g.fill(new Path2D(sy.querySelector('path').getAttribute('d'))); g.restore(); g.fillStyle = '#1c1613'; g.fillText(r[1], 44, y + 12.5)
                });
                rr(g, 18, 218, W - 36, 161, 12); g.fillStyle = '#fff'; g.fill(); g.strokeStyle = '#e6dfd0'; g.stroke();
                g.save(); g.translate(W / 2 - 64, 226); g.scale(128 / 35, 128 / 35); g.translate(3, 3); g.fillStyle = '#14100c'; g.fill(new Path2D(document.querySelector('.qr path').getAttribute('d'))); g.restore();
                g.textAlign = 'center'; g.fillStyle = '#14100c'; g.font = '500 10.5px "IBM Plex Mono",ui-monospace,monospace'; g.fillText('scan \u00B7 t.me/sami7ma', W / 2, 368);
                var U = ['mailto:samuelmifta@gmail.com', 'https://t.me/sami7ma', 'https://www.linkedin.com/in/samuel-mifta-062aaa263/', 'https://github.com/Sami7ma'], lk = U.map(function (u, i) { return [M + 18, M + 112 + i * 24, W - 36, 24, u] }); lk.push([M + 18, M + 218, W - 36, 161, 'https://t.me/sami7ma']);
                return new Promise(function (res, rej) { cv.toBlob(function (b) { if (!b) return rej(); b.arrayBuffer().then(function (a) { res(mkPdf(new Uint8Array(a), cv.width, cv.height, W + 2 * M, H + 2 * M, lk)) }) }, 'image/jpeg', .95) })
            })
        }
        function giveCard() { cardPdf().then(function (b) { save(b, 'Samuel-Mifta-card.pdf') }, vcf) }
        function burst(bx, by) { var c = ['#7a1c2e', '#c9a45c', '#fff', '#d4808f']; for (var i = 0; i < 20; i++) { var p = document.createElement('i'), an = Math.PI * 2 * i / 20 + Math.random() * .4, d = 50 + Math.random() * 80; p.className = 'spk'; p.style.cssText = 'left:' + bx + 'px;top:' + by + 'px;--dx:' + (Math.cos(an) * d).toFixed(1) + 'px;--dy:' + (Math.sin(an) * d).toFixed(1) + 'px;background:' + c[i % 4]; document.body.appendChild(p); (function (q) { setTimeout(function () { q.remove() }, 900) })(p) } }
        function taken() {
            tbtn.classList.add('got'); tbtn.querySelector('span').textContent = 'Got it \u2713'; tnote.innerHTML = 'Samuel-Mifta-card.pdf is in your downloads. <button type="button" id="vcfbtn">Save as a contact (.vcf) instead</button>'; tnote.classList.add('on'); var vb = $('#vcfbtn'); if (vb) vb.addEventListener('click', vcf);
            setTimeout(function () { tbtn.classList.remove('got'); tbtn.querySelector('span').textContent = 'Take my card'; tnote.classList.remove('on') }, 7000)
        }
        function redrop() { x = 0; y = L0 * .5; vx = 0; vy = 0; ph = 0; pw = 0; cd.style.visibility = ''; if (cd.animate) cd.animate([{ opacity: 0, transform: 'scale(.92)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'ease-out' }); asleep = false; lt = performance.now(); draw(); wake(); setTimeout(function () { taking = false }, 1800) }
        function takeCard() {
            if (taking) return; taking = true;
            if (still || !cd.animate) { giveCard(); taken(); taking = false; return }
            var rr_ = rl.getBoundingClientRect(), H = cd.offsetHeight, bb = tbtn.getBoundingClientRect(), bx = bb.left + bb.width / 2, by = bb.top + bb.height / 2, sx = rr_.left + cx + x - cw / 2, sy = rr_.top + y;
            if (sy + H < 0 || sy > innerHeight) { sx = bx - cw / 2; sy = -H - 90 }
            var pdfP = cardPdf();
            var fly = cd.cloneNode(true); fly.className = 'idc fly'; fly.style.cssText = 'left:' + sx + 'px;top:' + sy + 'px;width:' + cw + 'px;transform:perspective(1100px) rotate(' + ph + 'rad)'; document.body.appendChild(fly); cd.style.visibility = 'hidden';
            var es = .2, dx = bx - (sx + cw / 2), dy = by - H * es / 2 - sy, my = Math.min(0, dy) - 170, P = 'perspective(1100px) ';
            vx = (Math.random() - .5) * 500; vy = -1100; wake();
            var an = fly.animate([{ transform: P + 'translate(0,0) rotate(' + ph + 'rad) scale(1)', offset: 0 },
            { transform: P + 'translate(0,-20px) rotate(.05rad) scale(1.05)', offset: .14 },
            { transform: P + 'translate(' + (dx * .5) + 'px,' + my + 'px) rotateY(190deg) rotate(-.2rad) scale(.62)', offset: .58 },
            { transform: P + 'translate(' + dx + 'px,' + dy + 'px) rotateY(360deg) rotate(-.1rad) scale(' + es + ')', opacity: 1, offset: .97 },
            { transform: P + 'translate(' + dx + 'px,' + dy + 'px) rotateY(360deg) rotate(-.1rad) scale(.1)', opacity: 0, offset: 1 }], { duration: 1300, easing: 'cubic-bezier(.55,.05,.2,1)', fill: 'forwards' });
            an.onfinish = function () { fly.remove(); burst(bx, by); pdfP.then(function (b) { save(b, 'Samuel-Mifta-card.pdf') }, vcf); taken(); setTimeout(redrop, 650) }
        }
        if (tbtn) tbtn.addEventListener('click', takeCard);
        measure(); addEventListener('resize', measure); if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    }
    /* AlgoVisuals: the real site, shown live in a desktop window inside the card */
    var dsk = $('#desk'), pv = $('#pv');
    if (dsk && pv) {
        var scr = dsk.querySelector('.scr'); function fit() { var w = scr.clientWidth, h = scr.clientHeight, vw = Math.min(1280, Math.max(820, w * 1.9)), s = w / vw; pv.style.width = vw + 'px'; pv.style.height = (h / s) + 'px'; pv.style.transform = 'scale(' + s + ')' }
        fit(); addEventListener('resize', fit); pv.addEventListener('load', function () { pv.classList.add('ok') });
        new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { pv.src = 'https://algovisuals-sami.vercel.app/'; o.disconnect() } }, { rootMargin: '500px' }).observe(dsk)
    }
    /* AlgoVisuals portal */
    var pt = $('#portal'), al = $('#algo'), pfr = $('#pframe');
    if (pt && al) {
        function op(e) { if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; e.preventDefault(); pt.style.setProperty('--x', e.clientX + 'px'); pt.style.setProperty('--y', e.clientY + 'px'); if (!pfr.src || pfr.src === 'about:blank' || pfr.getAttribute('src') === null) pfr.src = 'https://algovisuals-sami.vercel.app/'; pt.classList.add('open'); $('#pclose').focus() }
        function cl() { pt.classList.remove('open'); al.focus() } al.addEventListener('click', op); $('#pclose').addEventListener('click', cl); addEventListener('keydown', function (e) { if (e.key === 'Escape' && pt.classList.contains('open')) cl() })
    }
    /* SMS deck */
    var dk = $('#deck'); if (dk) {
        var sl = [].slice.call(dk.querySelectorAll('.sl')), cu = 0, vd = dk.querySelector('video'), dc = $('#dcount'), sx = 0, dd = false;
        function lay() { sl.forEach(function (x, i) { var o = (i - cu + sl.length) % sl.length; x.style.setProperty('--o', o); x.style.zIndex = sl.length - o; x.style.visibility = o > 3 ? 'hidden' : 'visible' }); dc.textContent = (cu + 1) + ' / ' + sl.length; if (vd) { if (cu === 0 && !still) { var p = vd.play(); if (p && p.catch) p.catch(function () { }) } else vd.pause() } }
        function nx(d) { cu = (cu + d + sl.length) % sl.length; lay() } $('#dnext').addEventListener('click', function () { nx(1) }); $('#dprev').addEventListener('click', function () { nx(-1) });
        dk.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') nx(1); if (e.key === 'ArrowLeft') nx(-1) });
        dk.addEventListener('pointerdown', function (e) { dd = true; sx = e.clientX; dk.setPointerCapture(e.pointerId); sl[cu].classList.add('drag') });
        dk.addEventListener('pointermove', function (e) { if (!dd) return; var d = e.clientX - sx, f = sl[cu]; f.style.setProperty('--dx', d + 'px'); f.style.setProperty('--r', d / 22) });
        function de(e) { if (!dd) return; dd = false; var f = sl[cu], d = e.clientX - sx; f.classList.remove('drag'); f.style.setProperty('--dx', '0px'); f.style.setProperty('--r', 0); if (Math.abs(d) > 70) nx(d < 0 ? 1 : -1) }
        dk.addEventListener('pointerup', de); dk.addEventListener('pointercancel', de); lay();
        new IntersectionObserver(function (es) { if (!es[0].isIntersecting && vd) vd.pause(); else lay() }).observe(dk)
    }
})();
