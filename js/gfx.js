'use strict';
/* Aides d'affichage communes : fractions, nombres, carrés, racines, exemple qui se déroule, tirage aléatoire. */

const F = (a, b) => `<span class="frac"><span>${a}</span><span>${b}</span></span>`;
const fr = (x, d = 2) => Number(x).toFixed(d).replace('.', ',');
/* Nombre affiché à la française : virgule, vrai signe moins. nb(-3.5) → « −3,5 » */
const nb = x => String(Number(Number(x).toFixed(4))).replace('.', ',').replace('-', '−');
/* Nombre relatif entre parenthèses s'il est négatif. rel(-4) → « (−4) », rel(4) → « 4 » */
const rel = x => x < 0 ? `(${nb(x)})` : nb(x);
const sq = x => `${x}<sup>2</sup>`;
const rac = x => `√<span class="rac">${x}</span>`;

/* Exemple qui se déroule ligne par ligne : chaque ligne apparaît au toucher (le moteur gère le bouton). */
const reveal = (titre, lignes) => `<div class="exb reveal"><b>${titre}</b><ol>${lignes.map(l => `<li class="rv">${l}</li>`).join('')}</ol><button type="button" class="btn ghost small rv-next">Étape suivante</button></div>`;

/* Générateur pseudo-aléatoire déterministe (une graine → toujours la même suite). */
function mulberry(seed) {
    let a = seed >>> 0;
    return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
/* Aides pour les générateurs : entier entre a et b inclus, élément d'un tableau. */
const rInt = (rnd, a, b) => a + Math.floor(rnd() * (b - a + 1));
const rPick = (rnd, arr) => arr[Math.floor(rnd() * arr.length)];
