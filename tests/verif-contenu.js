/* Vérification d'ensemble : charge tout le contenu comme le fait la page et contrôle sa structure.
   Les calculs de chaque notion sont recalculés dans tests/verif-<notion>.js. */
const fs = require('fs'); const d = require('path').join(__dirname, '..', 'js') + '/';
globalThis.window = globalThis;
globalThis.document = { head: { appendChild() { } }, createElement() { return { set textContent(v) { }, id: '' }; }, getElementById() { return null; } };
const html = fs.readFileSync(require('path').join(__dirname, '..', 'index.html'), 'utf8');
const files = [...html.matchAll(/<script src="js\/([\w-]+\.js)"/g)].map(m => m[1]).filter(f => !['calc.js', 'suivi.js', 'app.js'].includes(f));
(0, eval)(files.map(f => fs.readFileSync(d + f, 'utf8')).join('\n;') + ';globalThis.X={NOTIONS,CH,EX,FL,RC,BLANC,THEMES,KEEP,AIGUILLAGE,QH,FICHE,VERIFS,DRILLS,mulberry};');
const { NOTIONS, CH, EX, FL, RC, BLANC, THEMES, KEEP, AIGUILLAGE, QH, FICHE, DRILLS, mulberry } = X;
let bad = 0; const B = m => { console.log('***', m); bad++; };
const ids = new Set();
for (const e of EX) {
    if (ids.has(e.id)) B('id en double ' + e.id); ids.add(e.id);
    if (!THEMES[e.t] || !e.hint || !(e.corr || e.items)) B('structure ' + e.id);
    if (e.type === 'qcm' && !(e.a >= 0 && e.a < e.opts.length)) B('qcm ' + e.id);
    if (e.type === 'num' && typeof e.a !== 'number') B('num ' + e.id);
    if (e.fig && !/^<svg/.test(e.fig().trim())) B('fig ' + e.id);
    if (/undefined|NaN/.test(JSON.stringify(e) + (e.fig ? e.fig() : ''))) B('texte ' + e.id);
    if (/rat[ée]|échou/i.test(e.q + e.hint)) B('vocabulaire ' + e.id);
}
for (const k in THEMES) { if (!NOTIONS.some(n => n.id === THEMES[k].n)) B('thème sans notion ' + k); if (!EX.some(e => e.t === k)) B('thème vide ' + k); }
if (!BLANC.length || !BLANC.every(b => EX.some(e => e.id === b))) B('BLANC');
for (const c of CH) {
    if (!NOTIONS.some(n => n.id === c.n)) B('chapitre sans notion ' + c.id);
    if (/undefined|NaN/.test(c.html())) B('CH ' + c.id); if (!KEEP[c.id]) B('KEEP ' + c.id); if (!QH[c.id]) B('QH ' + c.id);
    if (!(c.quick.a >= 0 && c.quick.a < c.quick.opts.length)) B('quick ' + c.id);
}
for (const a of AIGUILLAGE) if (!RC[a[1]]) B('aiguillage');
for (const D of DRILLS) for (let k = 1; k < 300; k++) { const e = D.gen(mulberry(k * 7919)); if (/undefined|NaN/.test(JSON.stringify(e) + (e.fig ? e.fig() : '')) || !e.hint || !e.corr) B('série ' + D.k); }
console.log('notions', NOTIONS.length, 'chapitres', CH.length, 'exos', EX.length, 'cartes', FL.length, 'recettes', RC.length, 'fiche', FICHE.length, 'séries', DRILLS.length);
console.log(bad ? 'PROBLEMES ' + bad : 'CONTENU OK');
