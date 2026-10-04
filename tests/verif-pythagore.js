/* Vérification du contenu « Pythagore » : node tests/verif-pythagore.js
   Charge gfx.js, data.js, pythagore.js ; contrôle la structure et RECALCULE chaque réponse numérique. */
const fs = require('fs'); const d = require('path').join(__dirname, '..', 'js') + '/';
globalThis.window = globalThis;
globalThis.document = { head: { appendChild() {} }, createElement() { return { set textContent(v) {}, id: '' }; }, getElementById() { return null; } };
(0, eval)(['gfx.js', 'data.js', 'pythagore.js'].map(f => fs.readFileSync(d + f, 'utf8')).join('\n;') +
    ';globalThis.X={NOTIONS,CH,KEEP,QH,RC,AIGUILLAGE,VERIFS,THEMES,EX,BLANC,FL,FICHE,DRILLS,mulberry,pyTri,pyRect,pyMur,pyRampe,pyGrille};');
const { NOTIONS, CH, KEEP, QH, RC, AIGUILLAGE, VERIFS, THEMES, EX, BLANC, FL, FICHE, DRILLS, mulberry, pyTri, pyRect, pyMur, pyRampe, pyGrille } = X;

let bad = 0; const B = m => { console.log('***', m); bad++; };
const BADTXT = /undefined|NaN|\[object|Infinity/;
const figOk = (s, who) => { if (typeof s !== 'string' || !s.startsWith('<svg') || BADTXT.test(s) || !/role="img"/.test(s) || !/aria-label="[^"]+"/.test(s) || !/viewBox="[-\d. ]+"/.test(s)) B('fig ' + who); };

/* Réponses numériques recalculées à la main depuis les énoncés (pas copiées des « a »). */
const r1 = x => Math.round(x * 10) / 10;
const want = {
    PB1: 9 * 9, PB2: Math.sqrt(144), PB4: Math.sqrt(196), PB5: 8 * 8 + 15 * 15, PB6: Math.sqrt(74), PB8: 1.5 * 1.5,
    PC1: Math.hypot(3, 4), PC2: Math.hypot(6, 8), PC3: Math.hypot(8, 15), PC4: Math.hypot(12, 5), PC5: Math.hypot(1.5, 2),
    PC6: Math.hypot(80, 60), PC7: Math.hypot(3, 5), PC8: Math.hypot(28, 15),
    PD1: Math.sqrt(10 * 10 - 6 * 6), PD2: Math.sqrt(13 * 13 - 12 * 12), PD4: Math.sqrt(2.5 * 2.5 - 1.5 * 1.5),
    PD5: Math.sqrt(2.9 * 2.9 - 2.1 * 2.1), PD6: Math.sqrt(20 * 20 - 16 * 16), PD8: Math.sqrt(9 * 9 - 5 * 5)
};
/* Exercices où l'énoncé demande un arrondi au dixième : la valeur affichée doit être l'arrondi exact. */
const arrondis = ['PB6', 'PC7', 'PC8', 'PD8'];
/* QCM « rectangle ou non » : réponse recalculée (true = rectangle). */
const rect = (a, b, c) => Math.abs(c * c - (a * a + b * b)) < 1e-9;
const wantQcm = { PE2: rect(12, 16, 20) ? 0 : 1, PE3: rect(4, 5, 6) ? 0 : 1, PE5: rect(6, 9, 11) ? 0 : 1, PE7: rect(2.4, 3.2, 4) ? 0 : 1, PE8: rect(3, 4, 5.1) ? 0 : 1 };

if (!NOTIONS.some(n => n.id === 'pythagore')) B('NOTIONS');
const mine = EX.filter(e => /^P[A-E]\d+$/.test(e.id));
const ids = new Set();
for (const e of EX) { if (ids.has(e.id)) B('id en double ' + e.id); ids.add(e.id); }
for (const e of mine) {
    if (!THEMES[e.t] || THEMES[e.t].n !== 'pythagore') B('theme ' + e.id);
    if (e.id.slice(0, 2) !== e.t) B('id/theme ' + e.id);
    if (!e.hint || !String(e.hint).trim()) B('hint ' + e.id);
    if (!Array.isArray(e.corr) || !e.corr.length || e.corr.some(l => !l || BADTXT.test(l))) B('corr ' + e.id);
    if (!e.q || BADTXT.test(e.q)) B('q ' + e.id);
    if (![1, 2, 3].includes(e.lvl)) B('lvl ' + e.id);
    if (e.type === 'qcm') {
        if (!(Number.isInteger(e.a) && e.a >= 0 && e.a < e.opts.length)) B('qcm ' + e.id);
        if (new Set(e.opts).size !== e.opts.length) B('qcm options en double ' + e.id);
        if (e.id in wantQcm && wantQcm[e.id] !== e.a) B('ECART qcm ' + e.id);
    } else if (e.type === 'multi') {
        if (!Array.isArray(e.a) || !e.a.length || e.a.some(i => !(i >= 0 && i < e.opts.length))) B('multi ' + e.id);
    } else if (e.type === 'order') {
        if (!Array.isArray(e.items) || e.items.length < 3 || e.items.some(l => BADTXT.test(l))) B('order ' + e.id);
    } else if (e.type === 'num') {
        const w = want[e.id];
        if (w === undefined) { B('no ref ' + e.id); continue; }
        if (typeof e.a !== 'number' || !(Math.abs(w - e.a) <= e.tol + 1e-9)) B('ECART ' + e.id + ' attendu ' + w + ' écrit ' + e.a);
        if (arrondis.includes(e.id)) { if (Math.abs(r1(w) - e.a) > 1e-9 || !/dixième/.test(e.q)) B('arrondi ' + e.id); }
        else if (Math.abs(w - e.a) > 1e-9) B('valeur non exacte ' + e.id);
        /* la correction doit afficher la réponse, à la française */
        const shown = String(e.a).replace('.', ',');
        if (!e.corr[e.corr.length - 1].includes(shown)) B('corr sans la réponse ' + e.id);
        if (e.diag) { const dOk = e.diag({ v: e.a + 1000 }); if (typeof dOk !== 'string') B('diag ' + e.id); for (const v of [0, 1, w * w, 2 * w]) if (BADTXT.test(String(e.diag({ v })))) B('diag txt ' + e.id); }
    } else B('type ' + e.id);
    /* l'indice ne doit pas contenir la réponse numérique */
    if (e.type === 'num') { const shown = String(e.a).replace('.', ','); if (new RegExp('(^|[^\\d,])' + shown.replace(',', '\\,') + '([^\\d,]|$)').test(e.hint.replace(/<[^>]+>/g, ''))) B('hint donne la réponse ? ' + e.id); }
    if (e.fig) figOk(e.fig(), e.id);
}
for (const t of ['PA', 'PB', 'PC', 'PD', 'PE']) { const n = mine.filter(e => e.t === t).length; if (!THEMES[t] || n < 6 || n > 8) B('thème ' + t + ' : ' + n + ' exercices'); }

const blancPy = BLANC.filter(b => /^P[A-E]/.test(b));
if (blancPy.length !== 5 || !blancPy.every(b => EX.some(e => e.id === b)) || new Set(blancPy.map(b => b.slice(0, 2))).size !== 5) B('BLANC');

const chPy = CH.filter(c => c.n === 'pythagore');
if (chPy.length !== 6) B('nombre de chapitres ' + chPy.length);
for (const c of chPy) {
    if (!/^py-/.test(c.id)) B('id chapitre ' + c.id);
    const h = c.html();
    if (BADTXT.test(h)) B('CH html ' + c.id);
    if (!c.title || !c.sub) B('CH titre ' + c.id);
    if (!Array.isArray(KEEP[c.id]) || KEEP[c.id].length < 2 || KEEP[c.id].length > 3) B('KEEP ' + c.id);
    if (!QH[c.id]) B('QH ' + c.id);
    const q = c.quick;
    if (!q || !q.q || !q.why || !(q.a >= 0 && q.a < q.opts.length)) B('quick ' + c.id);
    (h.match(/<svg[\s\S]*?<\/svg>/g) || []).forEach((s, i) => figOk(s, c.id + ' #' + i));
    if (c.fx) { try { c.fx(null); c.fx({}); c.fx({ querySelector() { return null; } }); } catch (err) { B('fx fragile ' + c.id + ' ' + err.message); } }
}
if (!chPy.slice(1).every(c => /class="exb reveal"/.test(c.html()))) B('un chapitre 2 à 6 sans exemple déroulé');
if (!/py-pick/.test(chPy[0].html()) || typeof chPy[0].fx !== 'function') B('interaction chapitre 1');

for (const a of AIGUILLAGE) if (!RC[a[1]]) B('aiguillage');
for (const r of RC) { if (!r.title || !r.steps || !r.steps.length) B('RC ' + r.title); if (r.fig) figOk(r.fig(), 'RC ' + r.title); if (BADTXT.test(JSON.stringify(r))) B('RC txt ' + r.title); }
if (VERIFS.length < 3 || FICHE.length < 3 || FICHE.some(x => x.length !== 2 || BADTXT.test(x[1]))) B('VERIFS / FICHE');
if (FL.some(x => x.length !== 2 || BADTXT.test(x.join(' ')))) B('FL');

/* Figures : toutes les orientations, tous les sommets, et les textes ≥ 13 px via les classes (pas de font-size en dur plus petit). */
for (let o = 0; o < 6; o++) for (const right of ['A', 'B', 'C']) for (const legs of [[3, 4], [9, 40], [40, 9], [1, 1]]) {
    const s = pyTri({ names: 'ABC', right, legs, o, hyp: true, len: { AB: '12,5 cm', AC: '?', BC: '37,5 cm' } });
    figOk(s, `pyTri o=${o} ${right}`);
    const vb = s.match(/viewBox="([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+)"/).slice(1).map(Number);
    if (vb[2] < 299 || vb[2] > 320 || vb[3] < 60 || vb[3] > 330) B(`pyTri viewBox o=${o} ${right} ${legs} : ${vb}`);
    if ((s.match(/class="py-sq"/g) || []).length !== 1 || (s.match(/py-hyp/g) || []).length !== 1) B('pyTri codage ' + o);
    /* l'angle droit est bien au sommet annoncé : les deux côtés qui en partent sont perpendiculaires */
    const L = [...s.matchAll(/<line x1="([-\d.]+)" y1="([-\d.]+)" x2="([-\d.]+)" y2="([-\d.]+)" class="py-side[^"]*" data-i="(\d)"/g)].map(m => m.slice(1, 5).map(Number));
    const dot = (L[0][2] - L[0][0]) * (L[1][2] - L[1][0]) + (L[0][3] - L[0][1]) * (L[1][3] - L[1][1]);
    if (L.length !== 3 || Math.abs(dot) > 2 || L[0][0] !== L[1][0] || L[0][1] !== L[1][1]) B(`pyTri angle droit o=${o} ${right}`);
}
figOk(pyTri(), 'pyTri défaut'); figOk(pyTri({ names: 'RST', right: 'S', pick: true, o: 4 }), 'pyTri pick');
if ((pyTri({ pick: true }).match(/class="py-hit"/g) || []).length !== 3) B('pyTri pick : 3 zones');
figOk(pyRect({ w: '28 m', h: '15 m', d: '?' }), 'pyRect'); figOk(pyRect({ names: 'ABCD' }), 'pyRect noms');
figOk(pyMur({ v: '?', h: '1,5 m', d: '2,5 m' }), 'pyMur'); figOk(pyMur({ kind: 'cable', v: '8 m', h: '15 m', d: '?' }), 'pyMur câble');
figOk(pyRampe({ v: '?', h: '2,1 m', d: '2,9 m' }), 'pyRampe'); figOk(pyGrille({ dx: 12, dy: 5 }), 'pyGrille'); figOk(pyGrille(), 'pyGrille défaut');

/* Séries sans fin : 500 tirages. Les longueurs sont relues DANS L'ÉNONCÉ, et la réponse recalculée. */
const D = DRILLS.find(x => x.k === 'pythagore');
if (!D || D.n !== 'pythagore' || !D.title || !D.intro) B('DRILLS');
else {
    const seen = { hyp: 0, cote: 0 };
    for (let k = 1; k <= 500; k++) {
        const e = D.gen(mulberry(k * 7919 + 3)), e2 = D.gen(mulberry(k * 7919 + 3));
        if (BADTXT.test(JSON.stringify(e)) || !e.hint || !e.corr.length || e.type !== 'num' || !e.unit || e.tol !== 0.001 || !THEMES[e.t]) { B('gen struct ' + k); continue; }
        if (e.q !== e2.q || e.a !== e2.a) B('gen non déterministe ' + k);
        figOk(e.fig(), 'gen ' + k);
        const nums = (e.q.replace(/<[^>]+>/g, '').match(/\d+(,\d+)?/g) || []).map(s => Number(s.replace(',', '.')));
        if (nums.length !== 2) { B('gen énoncé ' + k + ' ' + e.q); continue; }
        const isHyp = /^Repère/.test(e.hint) ? e.meta.kind === 'hyp' : e.meta.kind === 'cote';
        const w = e.meta.kind === 'hyp' ? Math.hypot(nums[0], nums[1]) : Math.sqrt(nums[0] * nums[0] - nums[1] * nums[1]);
        seen[e.meta.kind]++;
        if (!isHyp || !(Math.abs(w - e.a) < 1e-6) || !(e.a > 0)) B('gen ECART ' + k + ' ' + e.q + ' → ' + e.a);
        if (e.meta.kind === 'cote' && !(nums[0] > nums[1] && e.a < nums[0])) B('gen côté plus long que hypoténuse ' + k);
        if (!e.corr[e.corr.length - 1].includes(`<b>${String(Number(e.a.toFixed(4))).replace('.', ',')} ${e.unit}</b>`)) B('gen corr ' + k + ' ' + e.corr[e.corr.length - 1]);
        if (e.diag({ v: e.a }) === undefined) B('gen diag ' + k);
    }
    if (seen.hyp < 150 || seen.cote < 150) B('gen déséquilibré ' + JSON.stringify(seen));
}

console.log('chapitres', chPy.length, '· exercices', mine.length, '· cartes', FL.length, '· recettes', RC.length - 1, '· aiguillage', AIGUILLAGE.length, '· fiche', FICHE.length);
console.log(bad ? 'PROBLEMES ' + bad : 'CONTENU OK');
process.exit(bad ? 1 : 0);
