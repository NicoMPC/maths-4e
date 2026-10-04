/* Vérification du contenu de js/signes.js : node tests/verif-signes.js
   Charge gfx.js, data.js, signes.js ; contrôle la structure ; recalcule chaque réponse numérique
   (table `want` écrite à la main à partir des énoncés) ; fait tourner le générateur 500 fois. */
const fs = require('fs'); const d = require('path').join(__dirname, '..', 'js') + '/';
globalThis.window = globalThis;
globalThis.document = { head: { appendChild() {} }, createElement() { return { set textContent(v) {}, id: '' }; }, getElementById() { return null; } };
(0, eval)(['gfx.js', 'data.js', 'signes.js'].map(f => fs.readFileSync(d + f, 'utf8')).join('\n;') +
    ';globalThis.X={NOTIONS,CH,EX,FL,RC,BLANC,THEMES,KEEP,AIGUILLAGE,VERIFS,FICHE,DRILLS,QH,mulberry};');
const { NOTIONS, CH, EX, FL, RC, BLANC, THEMES, KEEP, AIGUILLAGE, VERIFS, FICHE, DRILLS, QH, mulberry } = X;

let bad = 0; const B = m => { console.log('***', m); bad++; };
const N = 'signes';
const ex = EX.filter(e => THEMES[e.t] && THEMES[e.t].n === N || /^S[A-E]\d+$/.test(e.id));
const ch = CH.filter(c => c.n === N);

/* Réponses attendues, recalculées à partir des énoncés (pas copiées des `a`). */
const want = {
    SA4: (-8) * 5, SA5: (-9) * (-6), SA6: 7 * (-4), SA8: 4 * (-15), SA9: 7 * (-2), SA10: 56 / (-7),
    SB3: (-42) / 6, SB4: (-63) / (-7), SB5: 56 / (-8), SB6: (-72) / (-9), SB8: (-120) / 4, SB9: (-36) / 4, SB10: (-9) * (-4),
    SC3: (-2) * 5 * (-3), SC4: (-4) * (-2) * (-3), SC5: (-1) * (-1) * (-1) * (-1) * (-7), SC6: Math.pow(-2, 3), SC9: 3 * 2 * (-5), SC10: (-10) * (-2) * 5 * (-1) * (-3),
    SD3: (-7) + (-2), SD4: (-7) * (-2), SD5: (-9) + 4, SD7: 5 - (-8), SD8: (-6) + (-5), SD9: (-4) + 7,
    SE2: 8 + (-2) * 5, SE3: 10 - 3 * (-4), SE5: (-6) * (-6), SE6: -(5 * 5), SE7: (-3 + 7) * (-2), SE8: 50 + 3 * (-20), SE9: 12 + 2 * (-9), SE10: (-3) * (-3) - 4 * (-2),
    SF1: (-2.5) * 4, SF2: (-0.5) * (-6), SF3: 1.5 * (-4), SF4: (-12.8) / 2, SF5: (-7.2) / (-9), SF6: 2.4 * (-0.5), SF7: (-6.3) / (-0.7), SF8: 8 * (-1.5)
};
/* QCM « Positif / Négatif » : valeur du calcul de l'énoncé, recalculée. La bonne option doit avoir le bon signe. */
const signOf = {
    SA1: (-7) * (-3), SA2: 6 * (-9), SB1: (-45) / (-9), SB2: 32 / (-8), SC1: (-2) * (-3) * (-5), SC2: (-1) * 4 * (-2) * (-3) * (-5),
    SC8: Math.pow(-1, 20), SD1: (-3) + (-5), SE4: (-7) * (-7)
};
/* Autres QCM / multi : index attendus, relus à la main. */
const wantIdx = { SA7: 0, SB7: 0, SD6: 0, SD10: 0, SE1: 0, SC7: [0, 2], SD2: [0, 2] };
/* Contrôle indépendant des options de ces QCM : valeur de chaque option. */
const optVal = {
    SA7: { vals: [(-3) * 4, (-3) * (-4), (-6) * (-2), 3 * 4], ok: v => v === -12 },
    SB7: { vals: [(-40) / 8, (-40) / (-8), 40 / 8, (-8) / 40], ok: v => v === -5 },
    SC7: { vals: [(-2) * (-3) * 4, (-1) * (-1) * (-1), (-5) * 2 * (-2) * 3, Math.pow(-2, 5)], ok: v => v > 0 }
};

const seen = new Set();
const txtOf = e => [e.q, e.hint, ...(e.corr || []), ...(e.opts || []), ...(e.items || [])].join(' ');
const badChars = s => /-\d|\d\s*\*\s*\d|\d\s*\/\s*\d|undefined|NaN/.test(s.replace(/<[^>]*>/g, ' '));

if (!NOTIONS.some(n => n.id === N)) B('NOTIONS');
for (const e of ex) {
    if (seen.has(e.id)) B('id en double ' + e.id); seen.add(e.id);
    if (!THEMES[e.t] || THEMES[e.t].n !== N) B('theme ' + e.id);
    if (!e.id.startsWith(e.t)) B('id/theme ' + e.id);
    if (![1, 2, 3].includes(e.lvl)) B('lvl ' + e.id);
    if (!e.q || typeof e.hint !== 'string' || !e.hint.trim()) B('hint ' + e.id);
    if (!Array.isArray(e.corr) || !e.corr.length || e.corr.some(l => !l)) B('corr ' + e.id);
    else if (!/<b>/.test(e.corr.join('')) && e.type !== 'order') B('corr sans gras ' + e.id);
    if (badChars(txtOf(e))) B('typo (- * / undefined NaN) ' + e.id);
    if (/rat[ée]|erreur|faux|fausse/i.test(txtOf(e))) B('rappel d\'échec ' + e.id);
    if (e.type === 'qcm') {
        if (!(Number.isInteger(e.a) && e.a >= 0 && e.a < e.opts.length)) B('qcm bornes ' + e.id);
        if (new Set(e.opts).size !== e.opts.length) B('qcm options en double ' + e.id);
        if (e.id in signOf) {
            if (!e.fixed || e.opts[0] !== 'Positif' || e.opts[1] !== 'Négatif') B('qcm signe : forme ' + e.id);
            if (e.a !== (signOf[e.id] > 0 ? 0 : 1)) B('ECART signe ' + e.id);
            if (/positif|négatif/i.test(e.hint)) B('hint donne le signe ' + e.id);
        } else if (e.id in wantIdx) { if (e.a !== wantIdx[e.id]) B('ECART qcm ' + e.id); }
        else B('qcm sans référence ' + e.id);
    } else if (e.type === 'multi') {
        if (!Array.isArray(e.a) || !e.a.length || e.a.some(i => !(i >= 0 && i < e.opts.length))) B('multi bornes ' + e.id);
        if (!(e.id in wantIdx)) B('multi sans référence ' + e.id);
        else if (JSON.stringify([...e.a].sort()) !== JSON.stringify(wantIdx[e.id])) B('ECART multi ' + e.id);
    } else if (e.type === 'num') {
        const w = want[e.id];
        if (w === undefined) { B('pas de référence ' + e.id); continue; }
        if (typeof e.a !== 'number' || (e.t !== 'SF' && !Number.isInteger(e.a)) || Object.is(e.a, -0)) B('a non entier ' + e.id);
        if (e.tol !== 0) B('tol ' + e.id);
        if (Math.abs(w - e.a) > 1e-9) B(`ECART ${e.id} : attendu ${w}, écrit ${e.a}`);
        /* le résultat (signe compris) doit figurer en gras dans la correction, et ne pas figurer dans l'indice */
        const res = String(e.a).replace('-', '−');
        if (!new RegExp(`<b>[^<]*(^|[^\\d−])?${res}(?!\\d)`).test(e.corr.join(' ')) && !e.corr.join(' ').includes(`<b>${res}`)) B('corr sans le résultat en gras ' + e.id);
        if (new RegExp(`(^|[^\\d−,])${res}(?![\\d,])`).test(e.hint.replace(/<[^>]*>/g, ' '))) B('hint contient la réponse ' + e.id);
        if (/positif|négatif/i.test(e.hint)) B('hint donne le signe ' + e.id);
        if (e.diag) { if (e.diag({ v: -e.a }) === '' || e.diag({ v: e.a + 1 }) !== '' || e.diag({ v: NaN }) !== '') B('diag ' + e.id); }
    } else if (e.type === 'order') {
        if (!Array.isArray(e.items) || e.items.length < 3 || new Set(e.items).size !== e.items.length) B('order ' + e.id);
    } else B('type inconnu ' + e.id);
    if (optVal[e.id]) {
        const o = optVal[e.id], good = o.vals.map((v, i) => o.ok(v) ? i : -1).filter(i => i >= 0);
        if (o.vals.length !== e.opts.length || JSON.stringify(good) !== JSON.stringify([].concat(e.a))) B('ECART options ' + e.id);
    }
}
for (const k of ['SA', 'SB', 'SC', 'SD', 'SE', 'SF']) {
    const n = ex.filter(e => e.t === k).length;
    if (!THEMES[k]) B('THEMES ' + k); if (n < 8 || n > 10) B(`thème ${k} : ${n} exercices`);
}
const blanc = BLANC.filter(b => /^S[A-E]/.test(b));
if (blanc.length !== 5 || !blanc.every(b => ex.some(e => e.id === b))) B('BLANC');

if (ch.length !== 5) B('nombre de chapitres ' + ch.length);
for (const c of ch) {
    const h = c.html();
    if (!c.id.startsWith('sg-')) B('CH id ' + c.id);
    if (badChars(h)) B('CH html ' + c.id);
    if (!h.includes('class="exb reveal"')) B('CH sans reveal ' + c.id);
    if (!Array.isArray(KEEP[c.id]) || KEEP[c.id].length < 2 || KEEP[c.id].length > 3) B('KEEP ' + c.id);
    if (!QH[c.id]) B('QH ' + c.id);
    const q = c.quick;
    if (!q || !q.q || !q.why || !(q.a >= 0 && q.a < q.opts.length) || new Set(q.opts).size !== q.opts.length) B('quick ' + c.id);
}
/* Questions de chapitre : bonne réponse recalculée. */
const quickWant = { 'sg-produit': (-9) * (-2), 'sg-quotient': 28 / (-4), 'sg-piege': (-6) + (-2), 'sg-priorites': -(3 * 3) };
for (const c of ch) {
    if (c.id in quickWant) { if (c.quick.opts[c.quick.a] !== String(quickWant[c.id]).replace('-', '−')) B('ECART quick ' + c.id); }
    else if (c.id === 'sg-plusieurs') { if (c.quick.opts[c.quick.a] !== ((-1) * (-2) * (-3) * (-4) * 5 > 0 ? 'Positif' : 'Négatif')) B('ECART quick ' + c.id); }
    else B('quick sans référence ' + c.id);
}
if (!ch[0].html().includes('<table class="tbl">')) B('tableau des signes absent du chapitre 1');

for (const a of AIGUILLAGE) if (!RC[a[1]] || !a[0]) B('aiguillage');
if (AIGUILLAGE.length < 3) B('AIGUILLAGE ' + AIGUILLAGE.length);
for (const r of RC) if (!r.title || !r.when || !Array.isArray(r.steps) || !r.steps.length || badChars(JSON.stringify(r))) B('RC ' + r.title);
if (RC.length !== 3) B('RC ' + RC.length);
if (VERIFS.length < 2 || VERIFS.length > 3) B('VERIFS ' + VERIFS.length);
if (FL.length !== 8 || FL.some(c => c.length !== 2 || !c[0] || !c[1] || badChars(c.join(' ')))) B('FL');
if (FICHE.length !== 2 || FICHE.some(c => c.length !== 2 || !c[0] || !c[1] || badChars(c.join(' ')))) B('FICHE');

/* Générateur : 500 tirages, réponse recalculée à partir du texte de l'énoncé. */
const evalQ = q => {
    const s = q.replace(/^Calcule : /, '').replace(/−/g, '-').replace(/×/g, '*').replace(/÷/g, '/');
    if (!/^[-\d\s()+*/]+$/.test(s)) return NaN;
    return Function(`"use strict";return (${s});`)();
};
const dr = DRILLS.find(x => x.k === N);
const kinds = { prod2: 0, quot: 0, prod3: 0, prio: 0 };
if (!dr || dr.n !== N || !dr.title || !dr.d || !dr.intro || typeof dr.gen !== 'function') B('DRILLS');
else for (let k = 1; k <= 500; k++) {
    const e = dr.gen(mulberry(k * 7919 + 3)), tag = 'gen ' + k + ' « ' + (e && e.q) + ' »';
    if (!e || e.type !== 'num' || e.tol !== 0 || !e.q || !e.hint || !Array.isArray(e.corr) || !e.corr.length) { B(tag + ' structure'); continue; }
    if (badChars([e.q, e.hint, ...e.corr].join(' '))) B(tag + ' typo');
    if (!Number.isInteger(e.a) || Object.is(e.a, -0)) B(tag + ' réponse non entière ou −0');
    if (/[÷]\s*\(?[−]?0(?!\d)/.test(e.q)) B(tag + ' division par 0');
    const w = evalQ(e.q);
    if (!(w === e.a)) B(tag + ` ECART : attendu ${w}, écrit ${e.a}`);
    const nums = (e.q.match(/\d+/g) || []).map(Number);
    if (e.q.includes('÷')) { kinds.quot++; if (nums[1] > 10 || Math.abs(e.a) > 10 || nums[1] === 0) B(tag + ' hors tables'); }
    else if (e.q.includes('+')) { kinds.prio++; }
    else if (nums.length === 3) { kinds.prod3++; }
    else { kinds.prod2++; if (nums.some(n => n > 10 || n < 2)) B(tag + ' hors tables'); }
    if (!e.corr[e.corr.length - 1].includes(`<b>${String(e.a).replace('-', '−')}</b>`)) B(tag + ' corr sans le résultat');
    if (/positif|négatif/i.test(e.hint)) B(tag + ' hint donne le signe');
    if (e.diag && (e.a !== 0 && e.diag({ v: -e.a }) === '' || e.diag({ v: e.a }) !== '' && e.a !== 0)) B(tag + ' diag');
}
if (Object.values(kinds).some(n => n < 20)) B('générateur : un type manque ' + JSON.stringify(kinds));
/* même graine → même exercice */
if (dr && JSON.stringify(dr.gen(mulberry(42))) !== JSON.stringify(dr.gen(mulberry(42)))) B('générateur non déterministe');

console.log('chapitres', ch.length, 'exos', ex.length, 'cartes', FL.length, 'recettes', RC.length, 'aiguillage', AIGUILLAGE.length, 'verifs', VERIFS.length, 'tirages', JSON.stringify(kinds));
console.log(bad ? 'PROBLEMES ' + bad : 'CONTENU OK');
process.exit(bad ? 1 : 0);
