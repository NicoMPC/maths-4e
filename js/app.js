'use strict';
/* Moteur du site : sauvegarde locale, navigation, cours, exercices, séries, cartes mémoire, contrôle blanc. */

const KEY = 'maths-4e-v1';
const SITE = 'https://nicompc.github.io/maths-4e/';
const BLANK = () => ({ quick: {}, ex: {}, fl: {}, check: {}, best: null, drill: {}, theme: 'light', last: '', days: {}, run: null, exam: '2026-10-05' });
let S = BLANK();
try { const d = JSON.parse(localStorage.getItem(KEY) || 'null'); if (d && typeof d === 'object') S = Object.assign(S, d); } catch (e) { /* stockage indisponible : le site marche quand même */ }

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const app = $('#app');
const num = s => { s = String(s).trim().replace(/\s/g, '').replace(',', '.').replace('−', '-'); return s === '' ? NaN : Number(s); };
const cl = (x, d = 2) => String(Number(Number(x).toFixed(d))).replace('.', ',');
const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const rseed = () => Math.floor(Math.random() * 2147483647);
const plur = (n, w) => `${n} ${w}${n > 1 ? 's' : ''}`;
function shuffled(n, fixed) { const a = [...Array(n).keys()]; if (fixed) return a; for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const mix = arr => shuffled(arr.length).map(i => arr[i]);
function dayNum() { const d = new Date(); return Math.floor((d.getTime() - d.getTimezoneOffset() * 6e4) / 864e5); }
const stOf = id => (S.ex[id] || {}).st || '';
const nOk = () => EX.filter(e => stOf(e.id) === 'ok').length;
const retryList = () => EX.filter(e => stOf(e.id) === 'retry');
const flKnown = i => !!(S.fl[i] && S.fl[i].b >= 1);
const flDue = i => !S.fl[i] || S.fl[i].d <= dayNum();

/* ================= SAUVEGARDE, PROGRESSION ================= */
function write() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }
function save() { S.days[dayNum()] = 1; write(); progress(); suivi(); }
function stats() {
    return {
        cours: [CH.filter(c => S.quick[c.id]).length, CH.length],
        exos: [nOk(), EX.length],
        flash: [FL.filter((f, i) => flKnown(i)).length, FL.length]
    };
}
/* Avancement d'une notion : chapitres validés + exercices réussis */
function statN(id) {
    const ch = CH.filter(c => c.n === id), ex = EX.filter(e => THEMES[e.t] && THEMES[e.t].n === id);
    return [ch.filter(c => S.quick[c.id]).length + ex.filter(e => stOf(e.id) === 'ok').length, ch.length + ex.length];
}
const txt = h => String(h).replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
/* Ce qui part vers le tableau de suivi (seulement si un code de suivi a été enregistré, voir suivi.js) */
function snapshot() {
    const s = stats(), th = {};
    for (const k in THEMES) { const l = EX.filter(e => e.t === k); th[THEMES[k].nom] = [l.filter(e => stOf(e.id) === 'ok').length, l.length]; }
    return { pct: pctAll(), cours: s.cours, exos: s.exos, cartes: s.flash, blanc: S.best, retry: retryList().map(e => e.id + ' ' + txt(e.q).slice(0, 60)), themes: th, jours: Object.keys(S.days).length, last: S.last };
}
function suivi() { if (window.Suivi) Suivi.push('maths-4e', snapshot); }

function pctAll() { const s = stats(); return Math.round(100 * (s.cours[0] + s.exos[0] + s.flash[0]) / (s.cours[1] + s.exos[1] + s.flash[1])); }
function progress() { const p = pctAll(); $('#globalBar').style.width = p + '%'; $('#globalPct').textContent = p + ' %'; }
function daysLeft() {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(S.exam || ''); if (!m) return null;
    const t = new Date(); t.setHours(0, 0, 0, 0);
    const d = Math.round((new Date(+m[1], +m[2] - 1, +m[3]) - t) / 864e5); return d < 0 ? null : d;
}
function applyTheme() { document.documentElement.dataset.theme = S.theme; $('meta[name=theme-color]').content = S.theme === 'dark' ? '#0b1020' : '#f5f6fb'; }
const crumb = (href, label, here) => `<div class="crumb"><a href="#${href}">← ${label}</a><span>›</span>${here}</div>`;
const meter = a => `<div class="meter"><i style="width:${a[1] ? Math.round(100 * a[0] / a[1]) : 0}%"></i></div><span class="meter-t">${a[0]} / ${a[1]}</span>`;

/* ================= EFFETS : toast, confettis, récompenses, partage ================= */
let toastT;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2400); }
function buzz(p) { try { navigator.vibrate && navigator.vibrate(p); } catch (e) { } }
function confetti(x, y, n = 46) {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cols = ['#8b5cf6', '#3b82f6', '#06b6d4', '#22c55e', '#eab308', '#f97316', '#ef4444'], box = document.createElement('div');
    box.className = 'confetti'; document.body.appendChild(box);
    x = x === undefined ? innerWidth / 2 : x; y = y === undefined ? innerHeight / 3 : y;
    for (let i = 0; i < n; i++) {
        const p = document.createElement('i'), a = Math.random() * Math.PI * 2, d = 70 + Math.random() * 230, dx = Math.cos(a) * d, dy = Math.sin(a) * d;
        p.style.cssText = `left:${x}px;top:${y}px;background:${cols[i % cols.length]};${i % 3 ? '' : 'border-radius:50%;'}`;
        box.appendChild(p);
        if (p.animate) p.animate([{ transform: 'translate(0,0) rotate(0)', opacity: 1 }, { transform: `translate(${dx}px,${dy - 70}px) rotate(${Math.random() * 600}deg)`, opacity: 1, offset: .6 }, { transform: `translate(${dx * 1.1}px,${dy + 200}px) rotate(${Math.random() * 900}deg)`, opacity: 0 }], { duration: 1200 + Math.random() * 700, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' });
    }
    setTimeout(() => box.remove(), 2100);
}
function share() {
    const d = { title: 'Maths 4e', text: 'Cours courts, méthodes pas à pas et exercices corrigés pour réviser les maths de 4e.', url: SITE };
    if (navigator.share) navigator.share(d).catch(() => { });
    else if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(SITE).then(() => toast('Lien copié : tu peux le coller où tu veux'), () => toast(SITE));
    else toast(SITE);
}
const shareBtn = (label = 'Partager ce site') => `<button class="btn ghost" data-share><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7 M12 3v13 M7 8l5-5 5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>${label}</button>`;
document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('[data-share]'); if (b) { e.preventDefault(); e.stopPropagation(); share(); } }, true);

const hintD = t => t ? `<details class="hintd"><summary>Indice</summary><p>${t}</p></details>` : '';

/* ================= EXERCICES ================= */
const OKS = ['Exact.', `Oui, c'est ça.`, 'Parfait.', 'Bien vu.', 'Impeccable.', `C'est juste.`, 'Tout bon.'];
let serie = 0;
function cheer() {
    serie++; let m = OKS[Math.floor(Math.random() * OKS.length)];
    if (serie === 3) m += ` Trois d'affilée.`; else if (serie === 5) m += ` Cinq d'affilée, ça roule.`; else if (serie === 10) m += ` Dix d'affilée. Rien à dire.`; else if (serie > 10 && serie % 5 === 0) m += ` ${serie} d'affilée.`;
    return `<b>${m}</b>`;
}
const corrOf = ex => ex.corr || (ex.type === 'order' ? ex.items : []);
function exHead(ex) { return `<div class="ex-head"><span class="tag">${(THEMES[ex.t] || { short: '' }).short}</span>${ex.lvl ? `<span class="lvl" title="difficulté">${'●'.repeat(ex.lvl)}${'○'.repeat(3 - ex.lvl)}</span>` : ''}<span class="ex-state"></span></div><div class="ex-q">${ex.q}</div>${ex.fig ? `<div class="fig">${ex.fig()}</div>` : ''}`; }
function makeItem(d) { if (d.id) return EX.find(e => e.id === d.id); return Object.assign(DRILLS.find(x => x.k === d.g).gen(mulberry(d.seed)), { gen: true, id: 'g' + d.g }); }

/* mode : 'free' (banque, plusieurs essais) | 'once' (un essai, correction affichée) | 'exam' (un essai, correction à la fin) */
function renderEx(ex, host, opt = {}) {
    const mode = opt.mode || 'free', bank = !ex.gen;
    let sel = null, locked = false, tries = 0, hinted = false; const msel = new Set(); let seq = [];
    const setSt = v => { if (!bank) return; S.ex[ex.id] = (v === 'ok' && hinted) ? { st: v, h: 1 } : { st: v }; save(); };
    const isNum = ex.type === 'num' || ex.type === 'sci';
    let ans;
    if (ex.type === 'qcm' || ex.type === 'multi') ans = `<div class="opts">${shuffled(ex.opts.length, ex.fixed).map(i => `<button class="opt" data-i="${i}">${ex.opts[i]}</button>`).join('')}</div>${ex.type === 'multi' ? '<div class="note">Plusieurs réponses possibles.</div>' : ''}`;
    else if (ex.type === 'num') ans = `<div class="inp"><button type="button" class="btn ghost pm" aria-label="changer le signe de ma réponse">+/−</button><input type="text" inputmode="decimal" autocomplete="off" class="in-num" placeholder="ta réponse" aria-label="réponse"><span class="unit">${ex.unit || ''}</span></div>`;
    else if (ex.type === 'sci') ans = `<div class="inp sci"><input type="text" inputmode="decimal" autocomplete="off" class="in-m" placeholder="nombre" aria-label="nombre"><span class="x10">× 10</span><input type="text" inputmode="text" autocomplete="off" class="in-e" placeholder="exp." aria-label="exposant"><span class="unit">${ex.unit || ''}</span></div>`;
    else ans = `<div class="ord"></div>`;
    host.className = 'card ex';
    host.innerHTML = `${exHead(ex)}${ans}
      <div class="ex-actions"><button class="btn primary" data-a="check">Valider</button>${mode === 'exam' ? '' : '<button class="btn ghost" data-a="hint">Indice</button>'}${mode === 'free' ? '<button class="btn ghost" data-a="corr">Correction</button>' : ''}${isNum ? '<button class="btn ghost" data-a="calc">Calculatrice</button>' : ''}${mode === 'free' && bank ? '<button class="btn ghost" data-a="redo" hidden>Refaire</button>' : ''}</div>
      <div class="ex-fb" hidden></div><div class="ex-hint" hidden><b>Indice.</b> ${ex.hint || ''}</div>
      <div class="ex-corr" hidden><b>Correction</b><ol>${corrOf(ex).map(c => `<li>${c}</li>`).join('')}</ol></div>`;
    const fb = $('.ex-fb', host);
    function paint() {
        if (mode !== 'free' || !bank) return;
        const s = stOf(ex.id); host.dataset.st = s;
        $('.ex-state', host).textContent = s === 'ok' ? (S.ex[ex.id].h ? '✓ réussi avec l\'indice' : '★ réussi sans indice') : s === 'retry' ? 'à retravailler' : '';
        const r = $('[data-a=redo]', host); if (r) r.hidden = s !== 'ok';
        opt.onState && opt.onState();
    }
    paint();
    if (ex.type === 'order') {
        let pool = shuffled(ex.items.length); if (pool.every((v, i) => v === i)) pool = pool.slice(1).concat(pool[0]);
        const drawOrd = () => {
            $('.ord', host).innerHTML = `<ol class="ord-ans">${seq.map(i => `<li><button class="opt" data-rm="${i}">${ex.items[i]}</button></li>`).join('') || `<li class="ord-empty">Touche les étapes dans l'ordre. Touche une étape placée pour la retirer.</li>`}</ol><div class="ord-pool">${pool.filter(i => !seq.includes(i)).map(i => `<button class="chip" data-add="${i}">${ex.items[i]}</button>`).join('')}</div>`;
            $$('[data-add]', host).forEach(b => b.onclick = () => { if (!locked) { seq.push(+b.dataset.add); drawOrd(); } });
            $$('[data-rm]', host).forEach(b => b.onclick = () => { if (!locked) { seq = seq.filter(i => i !== +b.dataset.rm); drawOrd(); } });
        };
        drawOrd();
    }
    $$('.opt[data-i]', host).forEach(b => b.onclick = () => {
        if (locked) return; const i = +b.dataset.i;
        if (ex.type === 'qcm') { sel = i; $$('.opt', host).forEach(x => x.classList.remove('sel', 'bad', 'good')); b.classList.add('sel'); }
        else { msel.has(i) ? msel.delete(i) : msel.add(i); b.classList.toggle('sel'); b.classList.remove('bad', 'good'); }
    });
    { const pm = $('.pm', host); if (pm) pm.onclick = () => { if (locked) return; const i = $('.in-num', host), v = i.value.trim(); i.value = /^[-−]/.test(v) ? v.slice(1) : '−' + v; i.focus(); }; }
    const val = c => num($(c, host).value);
    const answered = () => ex.type === 'qcm' ? sel !== null : ex.type === 'multi' ? msel.size > 0 : ex.type === 'num' ? !isNaN(val('.in-num')) : ex.type === 'sci' ? !isNaN(val('.in-e')) : seq.length === ex.items.length;
    function isOk() {
        if (ex.type === 'qcm') return sel === ex.a;
        if (ex.type === 'multi') return msel.size === ex.a.length && ex.a.every(i => msel.has(i));
        if (ex.type === 'num') return Math.abs(val('.in-num') - ex.a) <= (ex.tol || 0) + 1e-9;
        if (ex.type === 'order') return seq.every((v, i) => v === i);
        const m = val('.in-m'), e = val('.in-e'), v = (isNaN(m) ? 1 : m) * Math.pow(10, e);
        return Math.abs(v / ex.a - 1) <= (ex.tol || 0.011);
    }
    function ansText() {
        if (ex.type === 'qcm') return ex.opts[sel];
        if (ex.type === 'multi') return [...msel].sort().map(i => ex.opts[i]).join(', ');
        if (ex.type === 'num') return `${$('.in-num', host).value} ${ex.unit || ''}`;
        if (ex.type === 'sci') return `${$('.in-m', host).value || '1'} × 10<sup>${$('.in-e', host).value}</sup> ${ex.unit || ''}`;
        return seq.map(i => ex.items[i]).join(' → ');
    }
    function check() {
        if (locked) return;
        if (!answered()) { toast(ex.type === 'order' ? 'Place toutes les étapes.' : ex.type === 'sci' ? `Écris au moins l'exposant.` : `Donne d'abord une réponse.`); return; }
        const ok = isOk(); tries++;
        fb.hidden = false; fb.className = 'ex-fb ' + (ok ? 'ok' : 'ko');
        host.classList.remove('pulse', 'shake'); void host.offsetWidth; host.classList.add(ok ? 'pulse' : 'shake'); buzz(ok ? 20 : [30, 50, 30]);
        if (ok) setSt('ok'); else { serie = 0; if (stOf(ex.id) !== 'ok') setSt('retry'); }
        let extra = '';
        if (!ok && ex.diag) { const d = ex.diag(ex.type === 'sci' ? { m: isNaN(val('.in-m')) ? 1 : val('.in-m'), e: val('.in-e') } : { v: val('.in-num') }); if (d) extra = ' ' + d; }
        if (!ok && ex.type === 'order') { let k = 0; while (k < seq.length && seq[k] === k) k++; if (k) extra = ` ${k === 1 ? 'La première étape est bien placée.' : `Les ${k} premières étapes sont bien placées.`}`; }
        if (mode !== 'free') {
            locked = true; $$('input,button.opt,.chip,.pm,[data-a=check],[data-a=hint]', host).forEach(x => x.disabled = true);
            $$('.opt.sel', host).forEach(x => x.classList.add(ok ? 'good' : 'bad'));
            if (mode === 'exam') fb.innerHTML = ok ? cheer() : `<b>Ce n'est pas ça.</b> La correction est à la fin.`;
            else { fb.innerHTML = ok ? cheer() : `<b>Pas cette fois.</b>${extra} Lis la correction ligne par ligne.`; $('.ex-corr', host).hidden = false; }
            opt.onDone && opt.onDone(ok, ansText()); return;
        }
        if (ok) {
            fb.innerHTML = cheer() + (hinted ? '' : ' <span class="solo">★ sans indice</span>'); $('.ex-corr', host).hidden = false;
            $$('.opt.sel', host).forEach(x => { x.classList.remove('sel'); x.classList.add('good'); });
        } else {
            fb.innerHTML = tries >= 2 ? `<b>Toujours pas.</b>${extra} Ouvre la correction, lis-la ligne par ligne : l'exercice reste dans ta liste « à retravailler ».` : `<b>Pas encore.</b>${extra} Ouvre l'indice, puis réessaie.`;
            $$('.opt.sel', host).forEach(x => x.classList.add('bad'));
        }
        paint();
    }
    $$('[data-a]', host).forEach(b => b.onclick = () => {
        const a = b.dataset.a;
        if (a === 'check') check();
        else if (a === 'hint') { const h = $('.ex-hint', host); h.hidden = !h.hidden; hinted = true; }
        else if (a === 'calc') { window.Calc && Calc.open(); }
        else if (a === 'redo') { delete S.ex[ex.id]; save(); renderEx(ex, host, opt); }
        else { const c = $('.ex-corr', host); c.hidden = !c.hidden; if (!c.hidden && !stOf(ex.id)) { setSt('retry'); paint(); } }
    });
    $$('input', host).forEach(i => i.addEventListener('keydown', e => { if (e.key === 'Enter') check(); }));
}
function reviewCard(ex, rec, host, showCorr) {
    host.className = 'card ex'; host.dataset.st = rec.ok ? 'ok' : 'retry';
    host.innerHTML = `${exHead(ex)}<div class="ex-fb ${rec.ok ? 'ok' : 'ko'}"><b>Ta réponse :</b> ${rec.ans}${rec.ok ? ' — juste.' : showCorr ? '' : ' — à revoir à la fin.'}</div>
      ${showCorr ? `<div class="ex-corr"><b>Correction</b><ol>${corrOf(ex).map(c => `<li>${c}</li>`).join('')}</ol></div>` : ''}`;
}

/* Série de questions : Précédent (relecture) / Suivant (verrouillé tant que non vérifié), reprise possible. */
function runner(box, o) {
    const R = o.resume || { kind: o.kind, items: o.items ? o.items.slice() : [], k: 0, recs: [] };
    if (o.extra) Object.assign(R, o.extra);
    const infinite = !!o.make; let view = Math.min(R.k, infinite ? R.k : R.items.length);
    const persist = () => { if (o.persist) { S.run = R; save(); } };
    const topHtml = () => o.top ? o.top(R) : `<span class="dots">${R.items.map((q, i) => `<i class="${i < R.k ? (R.recs[i].ok ? 'ok' : 'ko') : ''}${i === view ? ' cur' : ''}"></i>`).join('')}</span>`;
    function draw() {
        if (!infinite && view >= R.items.length) { if (o.persist) { S.run = null; save(); } return o.onEnd(R); }
        if (infinite && view >= R.items.length) R.items.push(o.make(R));
        const ex = makeItem(R.items[view]), done = view < R.k, last = !infinite && view === R.items.length - 1;
        box.innerHTML = `<div class="fc-top"><span>Question ${view + 1}${infinite ? '' : ' / ' + R.items.length}</span><span id="rq-top">${topHtml()}</span></div><div id="rq"></div>
          <div class="rq-nav"><button class="btn ghost" id="rq-prev" ${view === 0 ? 'disabled' : ''}>← Précédent</button><button class="btn primary" id="rq-next" ${done ? '' : 'disabled'}>${last ? (o.endLabel || 'Voir le résultat') : 'Suivant →'}</button></div>
          ${done ? '' : '<p class="note center" id="rq-lock">Valide ta réponse pour passer à la suite.</p>'}`;
        if (done) reviewCard(ex, R.recs[view], $('#rq'), o.mode !== 'exam');
        else renderEx(ex, $('#rq'), { mode: o.mode, onDone: (ok, ans) => {
            R.recs[view] = { ok, ans }; R.k = view + 1; o.onAnswer && o.onAnswer(ok, R); persist();
            $('#rq-next').disabled = false; const l = $('#rq-lock'); if (l) l.remove(); $('#rq-top').innerHTML = topHtml();
        } });
        $('#rq-prev').onclick = () => { if (view > 0) { view--; draw(); } };
        $('#rq-next').onclick = () => { if (view < R.k) { view++; draw(); window.scrollTo(0, 0); } };
    }
    persist(); draw();
}

/* Une banque d'exercices, un seul à l'écran : Suivant se débloque quand l'exercice est réussi ou sa correction lue. */
function pager(box, list, back) {
    let k = list.findIndex(e => !stOf(e.id)); if (k < 0) k = list.findIndex(e => stOf(e.id) !== 'ok'); if (k < 0) k = 0;
    const dots = () => list.map((e, i) => `<i class="${stOf(e.id) === 'ok' ? 'ok' : stOf(e.id) === 'retry' ? 'ko' : ''}${i === k ? ' cur' : ''}"></i>`).join('');
    function draw() {
        const ex = list[k], last = k === list.length - 1;
        box.innerHTML = `<div class="fc-top"><span>Exercice ${k + 1} / ${list.length}</span><span class="dots" id="pg-dots"></span></div><div id="rq"></div>
          <div class="rq-nav"><button class="btn ghost" id="rq-prev" ${k === 0 ? 'disabled' : ''}>← Précédent</button><button class="btn primary" id="rq-next">${last ? 'Terminé' : 'Suivant →'}</button></div>
          <p class="note center" id="rq-lock">Réponds, ou lis la correction, pour passer à la suite.</p>`;
        const upd = () => { const d = !!stOf(ex.id); $('#rq-next').disabled = !d; $('#rq-lock').hidden = d; $('#pg-dots').innerHTML = dots(); };
        renderEx(ex, $('#rq'), { onState: upd }); upd();
        $('#rq-prev').onclick = () => { if (k > 0) { k--; draw(); window.scrollTo(0, 0); } };
        $('#rq-next').onclick = () => { if (last) { location.hash = back; return; } k++; draw(); window.scrollTo(0, 0); };
    }
    draw();
}
function vExos(sub) {
    const retry = retryList(), keys = Object.keys(THEMES);
    if (sub && sub.slice(0, 2) === 'd-' && DRILLS.some(d => d.k === sub.slice(2))) return vDrill(DRILLS.find(d => d.k === sub.slice(2)));
    if (!sub || (sub !== 'R' && !THEMES[sub])) {
        const s = stats();
        app.innerHTML = `<h1>Exercices</h1><p class="sub">Un exercice à la fois. Chacun a son indice et sa correction détaillée.</p>
        <div class="card total">${meter(s.exos)}</div>
        ${retry.length ? `<a class="row hot" href="#exos/R"><span class="num">↻</span><span class="row-t"><b>À retravailler</b><small>${plur(retry.length, 'exercice')} à refaire</small></span><span class="go">→</span></a>` : ''}
        ${NOTIONS.map(n => `<h2 class="notion">${n.nom}</h2><div class="list">${keys.filter(k => THEMES[k].n === n.id).map(k => { const l = EX.filter(e => e.t === k), ok = l.filter(e => stOf(e.id) === 'ok').length; return `<a class="row" href="#exos/${k}"><span class="row-t"><b>${THEMES[k].nom}</b><small>${plur(l.length, 'exercice')}</small></span><span class="row-m">${meter([ok, l.length])}</span></a>`; }).join('')}
        ${DRILLS.filter(d => d.n === n.id).map(d => `<a class="row" href="#exos/d-${d.k}"><span class="num">∞</span><span class="row-t"><b>${d.title}</b><small>${d.d}</small></span><span class="go">→</span></a>`).join('')}</div>`).join('')}`;
        return;
    }
    const list = sub === 'R' ? retry : EX.filter(e => e.t === sub), nx = sub === 'R' ? null : keys[keys.indexOf(sub) + 1];
    app.innerHTML = `${crumb('exos', 'Exercices', sub === 'R' ? 'À retravailler' : THEMES[sub].nom)}<h1>${sub === 'R' ? 'À retravailler' : THEMES[sub].nom}</h1>
    ${list.length ? '' : '<p class="sub">Plus rien à refaire ici. Liste vidée.</p>'}<div id="exlist"></div>
    <div class="pn"><a class="btn ghost" href="#exos">← Tous les thèmes</a>${nx ? `<a class="btn ghost" href="#exos/${nx}">${THEMES[nx].nom} →</a>` : ''}</div>`;
    if (list.length) pager($('#exlist'), list, '#exos');
}
/* Série sans fin : questions tirées au hasard, une tentative chacune, correction affichée. */
function vDrill(D) {
    let streak = 0;
    app.innerHTML = `${crumb('exos', 'Exercices', D.title)}<h1>${D.title}</h1><p class="sub">${D.d}.</p>${D.intro ? `<div class="card">${D.intro}</div>` : ''}<div id="run"></div>
    <div class="pn"><a class="btn ghost" href="#exos">← Tous les thèmes</a></div>`;
    runner($('#run'), { kind: 'drill', mode: 'once', make: () => ({ g: D.k, seed: rseed() }),
        top: () => `Série : <b>${streak}</b> · Record : <b>${S.drill[D.k] || 0}</b>`,
        onAnswer: ok => { if (ok) { streak++; if (streak > (S.drill[D.k] || 0)) S.drill[D.k] = streak; } else streak = 0; save(); } });
}
/* La prochaine chose à faire, notion par notion : le cours, puis les exercices, puis les révisions. */
function nextAction() {
    const keys = Object.keys(THEMES);
    for (const n of NOTIONS) {
        const c = CH.findIndex(x => x.n === n.id && !S.quick[x.id]);
        if (c >= 0) return { href: '#cours/' + (c + 1), t: Object.keys(S.quick).length ? 'Continuer le cours' : 'Commencer le cours', s: `${n.nom} — ${CH[c].title}` };
        const th = keys.find(k => THEMES[k].n === n.id && EX.some(e => e.t === k && !stOf(e.id)));
        if (th) return { href: '#exos/' + th, t: `S'entraîner`, s: `${n.nom} — ${THEMES[th].nom}` };
    }
    const retry = retryList().length, due = FL.filter((f, i) => S.fl[i] && flDue(i)).length;
    if (retry) return { href: '#exos/R', t: 'Reprendre ce qui reste à retravailler', s: plur(retry, 'exercice') };
    if (S.best === null && BLANC.length) return { href: '#controle/blanc', t: 'Le contrôle blanc', s: `${BLANC.length} questions, noté sur 20` };
    if (due) return { href: '#controle/cartes', t: 'Les cartes du jour', s: `${plur(due, 'carte')} à revoir` };
    return { href: '#controle/fiche', t: 'Relire la fiche récap', s: `Tout l'essentiel sur un écran` };
}
function vHome() {
    const d = daysLeft(), p = pctAll(), na = nextAction();
    let msg;
    if (d === 0) msg = `C'est aujourd'hui. La fiche récap, et tu y vas.`;
    else if (p === 0) msg = `On commence par le début, tranquillement.`;
    else if (d === 1) msg = `C'est demain. Un contrôle blanc, puis la fiche récap.`;
    else if (p < 100) msg = `Déjà ${p} % de fait. On continue.`;
    else msg = `Tout est fait. Chapeau.`;
    app.innerHTML = `
    <section class="hero">
      <h1>Maths 4e.<br><span class="grad">Une chose à la fois.</span></h1>
      <p class="sub">${msg}</p>
      <a class="next" href="${na.href}"><small>Prochaine étape</small><b>${na.t}</b><span>${na.s}</span><i>→</i></a>
      <div class="chips-info">
        ${d !== null ? `<a class="count" href="#controle">${d === 0 ? `Contrôle aujourd'hui` : d === 1 ? 'Contrôle demain' : `Contrôle dans ${d} jours`}</a>` : '<a class="count" href="#controle">Régler la date du contrôle</a>'}
      </div>
    </section>
    <div class="list">${NOTIONS.map(n => { const a = statN(n.id), c = CH.findIndex(x => x.n === n.id); return `<a class="row" href="#cours/${c + 1}"><span class="row-t"><b>${n.nom}</b><small>${n.sub}</small></span><span class="row-m">${a[0] === 0 ? '<i class="pill">pas commencé</i>' : a[0] >= a[1] ? '<i class="pill ok">✓ ok</i>' : meter(a)}</span></a>`; }).join('')}</div>
    <p class="center share-line">Ça peut servir à quelqu'un de ta classe ? ${shareBtn('Partager')}</p>`;
}
/* ================= COURS ================= */
/* Exemples qui se déroulent : une ligne de plus à chaque toucher */
function wireReveal(root) {
    $$('.reveal', root).forEach(box => {
        const li = $$('.rv', box), btn = $('.rv-next', box); let n = 1;
        const upd = () => { li.forEach((x, i) => x.hidden = i >= n); if (btn) btn.hidden = n >= li.length; };
        if (btn) btn.onclick = () => { n++; upd(); }; upd();
    });
}
function vCours(sub) {
    if (!sub || !CH[+sub - 1]) {
        app.innerHTML = `<h1>Le cours</h1><p class="sub">Des chapitres courts. Tu lis, tu déroules l'exemple, tu réponds à la question du bas : le chapitre est validé.</p>
        ${NOTIONS.map(n => `<h2 class="notion">${n.nom}</h2><div class="list">${CH.map((c, k) => c.n !== n.id ? '' : `<a class="row" href="#cours/${k + 1}"><span class="num">${k + 1}</span><span class="row-t"><b>${c.title}</b><small>${c.sub}</small></span><span class="row-s">${S.quick[c.id] ? '<i class="pill ok">✓ validé</i>' : ''}</span></a>`).join('')}</div>`).join('')}`;
        return;
    }
    const k = +sub - 1, c = CH[k], keep = KEEP[c.id] || null, nx = CH[k + 1], endN = !nx || nx.n !== c.n;
    const th = Object.keys(THEMES).find(t => THEMES[t].n === c.n);
    app.innerHTML = `${crumb('cours', 'Cours', `${k + 1} / ${CH.length}`)}
    <article class="chapter"><h1><span class="num">${k + 1}</span>${c.title}</h1><p class="sub">${c.sub}</p>
    ${c.html()}
    ${keep ? `<div class="keep"><div class="keep-h">Je retiens</div><ul>${keep.map(x => `<li>${x}</li>`).join('')}</ul></div>` : ''}
    <div class="card quick" id="quick"></div>
    <div class="pn">${k > 0 ? `<a class="btn ghost" href="#cours/${k}">← ${CH[k - 1].title}</a>` : '<span></span>'}${endN && th ? `<a class="btn primary" href="#exos/${th}">S'entraîner →</a>` : nx ? `<a class="btn ghost" href="#cours/${k + 2}">${nx.title} →</a>` : ''}</div>
    </article>`;
    const host = $('#quick'), q = c.quick;
    host.innerHTML = `<div class="quick-h">La question du chapitre</div><div class="ex-q">${q.q}</div><div class="opts">${shuffled(q.opts.length).map(i => `<button class="opt" data-i="${i}">${q.opts[i]}</button>`).join('')}</div><div class="ex-fb" hidden></div>`;
    if (QH[c.id]) $('.opts', host).insertAdjacentHTML('afterend', hintD(QH[c.id]));
    const fb = $('.ex-fb', host), good = t => { $(`.opt[data-i="${q.a}"]`, host).classList.add('good'); fb.hidden = false; fb.className = 'ex-fb ok'; fb.innerHTML = (t || '<b>Exact.</b>') + ' ' + q.why; };
    $$('.opt', host).forEach(b => b.onclick = () => {
        $$('.opt', host).forEach(x => x.classList.remove('good', 'bad'));
        host.classList.remove('pulse', 'shake'); void host.offsetWidth;
        if (+b.dataset.i === q.a) { good(cheer()); host.classList.add('pulse'); if (!S.quick[c.id]) { S.quick[c.id] = true; save(); toast('Chapitre validé'); } }
        else { serie = 0; host.classList.add('shake'); b.classList.add('bad'); fb.hidden = false; fb.className = 'ex-fb ko'; fb.innerHTML = 'Pas encore. Relis les encadrés au-dessus, puis réessaie.'; }
    });
    if (S.quick[c.id]) good();
    wireReveal(app);
    if (c.fx) { try { c.fx($('.chapter')); } catch (e) { } }
}

/* ================= MÉTHODES ================= */
function vMeth() {
    app.innerHTML = `${crumb('controle', 'Avant le contrôle', 'Méthodes')}<h1>Les méthodes</h1><p class="sub">Des recettes. Tu repères le type d'exercice, tu déroules les étapes dans l'ordre, tu vérifies.</p>
    <div class="card"><h3>Quel exercice ai-je devant moi ?</h3><div class="aig">${AIGUILLAGE.map(a => `<button class="aig-row" data-r="${a[1]}"><span>${a[0]}</span><b>Recette ${a[1]} →</b></button>`).join('')}</div></div>
    ${RC.map((r, k) => `<details class="card rc" id="rc${k}"><summary><span class="num">${k}</span><span><b>${r.title}</b><small>${r.when}</small></span></summary>
      <ol class="steps-l">${r.steps.map(s => `<li>${s}</li>`).join('')}</ol>${r.fig ? `<div class="fig">${r.fig()}</div>` : ''}${r.ex ? `<div class="exb">${r.ex}</div>` : ''}${r.trap ? `<div class="trap">${r.trap}</div>` : ''}</details>`).join('')}
    <div class="card"><h3>Avant de rendre la copie : ${VERIFS.length} vérifications</h3><ul class="checks">${VERIFS.map(v => `<li>${v}</li>`).join('')}</ul></div>
    <div class="pn"><a class="btn ghost" href="#controle">← Avant le contrôle</a><a class="btn primary" href="#exos">S'entraîner →</a></div>`;
    $$('.aig-row').forEach(b => b.onclick = () => { const d = $('#rc' + b.dataset.r); if (!d) return; d.open = true; d.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
}

/* ================= AVANT LE CONTRÔLE ================= */
function vCtrl(sub) {
    if (sub === 'fiche') return vFiche();
    if (sub === 'cartes') return vCartes();
    if (sub === 'blanc') return vBlanc();
    if (sub === 'methodes') return vMeth();
    const s = stats(), d = daysLeft(), due = FL.filter((f, i) => flDue(i)).length;
    app.innerHTML = `<h1>Avant le contrôle</h1><p class="sub">${d === null ? 'Indique la date de ton contrôle pour avoir le compte à rebours.' : d === 0 ? `C'est aujourd'hui. La fiche, les vérifications, et c'est parti.` : d === 1 ? `C'est demain. Méthodes, contrôle blanc, fiche récap.` : `Encore ${d} jours.`}</p>
    <div class="card date"><label for="examDate">Date de mon contrôle</label><input type="date" id="examDate" value="${S.exam || ''}"></div>
    <div class="list">
      <a class="row" href="#controle/methodes"><span class="row-t"><b>Les méthodes</b><small>Quoi faire, étape par étape, devant chaque type d'exercice</small></span><span class="go">→</span></a>
      <a class="row" href="#controle/blanc"><span class="row-t"><b>Contrôle blanc</b><small>${BLANC.length} questions, noté sur 20${S.best !== null ? ` · meilleure note : ${S.best} / 20` : ''}</small></span><span class="go">→</span></a>
      <a class="row" href="#controle/fiche"><span class="row-t"><b>La fiche récap</b><small>Tout l'essentiel sur un écran</small></span><span class="go">→</span></a>
      <a class="row" href="#controle/cartes"><span class="row-t"><b>Cartes mémoire</b><small>${due ? `${plur(due, 'carte')} à voir aujourd'hui` : `Rien à revoir aujourd'hui`} · elles reviennent au bon moment</small></span><span class="row-m">${meter(s.flash)}</span></a>
    </div>
    <p class="reset"><button class="btn ghost small" id="reset">Effacer ma progression</button></p>`;
    $('#examDate').onchange = e => { S.exam = e.target.value; save(); toast(S.exam ? 'Date enregistrée' : 'Date retirée'); route(true); };
    let armed = false;
    $('#reset').onclick = e => {
        if (!armed) { armed = true; e.target.textContent = 'Tout effacer, vraiment ? Appuie encore une fois'; e.target.classList.add('danger'); return; }
        const th = S.theme, ex = S.exam; try { localStorage.removeItem(KEY); } catch (er) { }
        S = BLANK(); S.theme = th; S.exam = ex; write(); progress(); route(true); toast('Progression effacée');
    };
}
function vFiche() {
    app.innerHTML = `${crumb('controle', 'Avant le contrôle', 'Fiche récap')}<h1>La fiche récap</h1>
    <div class="fiche">${FICHE.map(x => `<div class="fbox"><h4>${x[0]}</h4>${x[1]}</div>`).join('')}</div>
    <div class="card"><h3>Les ${VERIFS.length} vérifications</h3><ul class="plan">${VERIFS.map((v, i) => `<li><label><input type="checkbox" data-c="${i}" ${S.check[i] ? 'checked' : ''}><span>${v}</span></label></li>`).join('')}</ul></div>
    <div class="pn"><a class="btn ghost" href="#controle">← Avant le contrôle</a><a class="btn ghost" href="#controle/cartes">Cartes mémoire →</a></div>`;
    $$('[data-c]').forEach(c => c.onchange = () => { S.check[c.dataset.c] = c.checked; save(); });
}
/* Cartes mémoire en répétition espacée : une carte sue revient dans 1, 2 puis 4 jours. */
function vCartes() {
    const GAP = [0, 1, 2, 4], today = dayNum(), all = () => FL.map((f, i) => i);
    let queue = mix(all().filter(flDue)), k = 0, flip = false, again = new Set(), free = false;
    app.innerHTML = `${crumb('controle', 'Avant le contrôle', 'Cartes mémoire')}<h1>Cartes mémoire</h1><p class="sub">Réponds dans ta tête, puis retourne la carte. Une carte sue revient dans 1, 2 puis 4 jours ; les autres reviennent tout de suite.</p><div id="fc"></div>`;
    function draw() {
        const box = $('#fc'), known = all().filter(flKnown).length;
        if (k >= queue.length) {
            box.innerHTML = `<div class="card center"><h3>${known} / ${FL.length} cartes sues</h3><p>${queue.length ? 'Séance terminée.' : `Rien à revoir aujourd'hui.`} Les prochaines cartes reviennent demain : c'est l'espacement qui fait retenir.</p><div class="ex-actions center"><button class="btn ghost" id="fc-all">M'entraîner quand même sur toutes</button><a class="btn primary" href="#controle">Terminé</a></div></div>`;
            $('#fc-all').onclick = () => { queue = mix(all()); k = 0; flip = false; again = new Set(); free = true; draw(); };
            if (queue.length && !free && known === FL.length) confetti();
            return;
        }
        const i = queue[k], c = FL[i];
        box.innerHTML = `<div class="fc-top"><span>Carte ${k + 1} / ${queue.length}</span><span>${known} sue${known > 1 ? 's' : ''}</span></div>
          <button class="flash3d" id="fc-card" aria-label="Retourner la carte"><span class="f-in"><span class="face front"><small>Question</small><span>${c[0]}</span><em>Touche pour retourner</em></span><span class="face back"><small>Réponse</small><span>${c[1]}</span></span></span></button>
          <div class="fc-act" hidden><button class="btn ghost" id="fc-no">À revoir</button><button class="btn primary" id="fc-yes">Je savais</button></div>
          <p class="note center" id="fc-lock">Retourne la carte pour continuer.</p>`;
        $('#fc-card').onclick = () => { if (flip) return; flip = true; $('#fc-card').classList.add('flip'); $('.fc-act').hidden = false; $('#fc-lock').remove(); };
        $('#fc-no').onclick = () => { if (!flip) return; S.fl[i] = { b: 0, d: today }; save(); if (!again.has(i)) { again.add(i); queue.push(i); } k++; flip = false; draw(); };
        $('#fc-yes').onclick = () => {
            if (!flip) return; const early = S.fl[i] && !flDue(i);
            if (!early) { const b = Math.min(3, ((S.fl[i] || {}).b || 0) + 1); S.fl[i] = { b, d: today + GAP[b] }; save(); }
            k++; flip = false; draw();
        };
    }
    draw();
}
function vBlanc() {
    const ids = BLANC.filter(id => EX.some(e => e.id === id)), key = ids.join();
    app.innerHTML = `${crumb('controle', 'Avant le contrôle', 'Contrôle blanc')}<h1>Contrôle blanc</h1><div id="bl"></div>`;
    const box = $('#bl'), saved = () => S.run && S.run.kind === 'blanc' && S.run.key === key ? S.run : null;
    function intro() {
        const r = saved();
        box.innerHTML = `<div class="card"><p><b>${ids.length} questions, ${cl(20 / ids.length)} points chacune.</b> Une seule tentative par question, pas d'indice. Tu peux revoir tes réponses avec « Précédent ». Les corrections sont à la fin.</p><p>Prends une feuille et un stylo, et fais comme le jour J : rédige chaque calcul.</p>${S.best !== null ? `<p class="note">Meilleure note : ${S.best} / 20</p>` : ''}
          <div class="ex-actions">${r ? `<button class="btn primary big" id="bl-res">Reprendre à la question ${Math.min(r.k + 1, ids.length)}</button><button class="btn ghost" id="bl-go">Recommencer à zéro</button>` : '<button class="btn primary big" id="bl-go">Commencer</button>'}</div></div>`;
        $('#bl-go').onclick = () => start(null);
        if (r) $('#bl-res').onclick = () => start(r);
    }
    function start(resume) { runner(box, { kind: 'blanc', mode: 'exam', items: ids.map(id => ({ id })), resume, persist: true, extra: { key }, endLabel: 'Voir ma note', onEnd: end }); window.scrollTo(0, 0); }
    function end(R) {
        const qs = ids.map(id => EX.find(e => e.id === id)), res = R.recs.map(r => r.ok), note = Math.round(res.filter(Boolean).length * 20 / ids.length);
        if (S.best === null || note > S.best) S.best = note; save();
        box.innerHTML = `<div class="card center"><div class="note-big">${note}<small> / 20</small></div><p>${note >= 16 ? 'Le chapitre est maîtrisé. Tu peux y aller en confiance.' : note >= 10 ? 'La base est là. Reprends les questions ci-dessous marquées « à revoir ».' : 'Reprends les corrections ci-dessous une par une, puis les méthodes correspondantes. C\'est pour ça qu\'on fait un contrôle blanc avant le vrai.'}</p><div class="ex-actions center"><button class="btn ghost" id="bl-re">Recommencer</button>${shareBtn('Partager')}</div></div>
          ${qs.map((q, i) => `<details class="card rc ${res[i] ? 'r-ok' : 'r-ko'}"><summary><span class="num">${i + 1}</span><span><b>${res[i] ? 'Réussi' : 'À revoir'}</b><small>${q.q.replace(/<[^>]+>/g, ' ').slice(0, 90)}…</small></span></summary><div class="ex-q">${q.q}</div>${q.fig ? `<div class="fig">${q.fig()}</div>` : ''}<p class="note">Ta réponse : ${R.recs[i].ans}</p><ol class="steps-l">${corrOf(q).map(c => `<li>${c}</li>`).join('')}</ol></details>`).join('')}
          <div class="pn"><a class="btn ghost" href="#exos/R">Mes exercices à retravailler →</a></div>`;
        $('#bl-re').onclick = intro; window.scrollTo(0, 0); if (note >= 16) confetti();
    }
    intro();
}


/* ================= NAVIGATION ================= */
const ROUTES = { accueil: vHome, cours: vCours, exos: vExos, controle: vCtrl };
const SCROLL = {}; let byClick = false, cur = location.hash;
try { history.scrollRestoration = 'manual'; } catch (e) { }
document.addEventListener('click', e => { if (e.target.closest && e.target.closest('a[href^="#"]')) byClick = true; }, true);
window.addEventListener('scroll', () => { SCROLL[cur] = window.scrollY; }, { passive: true });
function route(keep) {
    const [r, sub] = (location.hash.slice(1) || 'accueil').split('/');
    const name = ROUTES[r] ? r : 'accueil', y = keep === true ? window.scrollY : byClick ? 0 : (SCROLL[location.hash] || 0);
    byClick = false; cur = location.hash;
    app.innerHTML = '';
    ROUTES[name](sub);
    $$('#tabs a').forEach(a => a.classList.toggle('on', a.dataset.r === name));
    if (keep !== true) { app.classList.remove('in'); void app.offsetWidth; app.classList.add('in'); }
    window.scrollTo(0, y);
    if (name !== 'accueil' && S.last !== location.hash) { S.last = location.hash; save(); }
}
$('#themeBtn').onclick = () => { S.theme = S.theme === 'dark' ? 'light' : 'dark'; applyTheme(); save(); };
window.addEventListener('hashchange', () => route());
document.addEventListener('keydown', e => {
    if (e.target.matches && e.target.matches('input,select,textarea')) return;
    const card = $('#fc-card'); if (!card) return;
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); card.click(); }
    else if (e.key === 'ArrowRight') $('#fc-yes').click();
    else if (e.key === 'ArrowLeft') $('#fc-no').click();
});
const ct = $('#calcTab'); if (ct) ct.onclick = () => window.Calc && Calc.toggle();
applyTheme(); progress(); route(); suivi();
