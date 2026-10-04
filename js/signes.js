'use strict';
/* Notion « Multiplier et diviser des nombres relatifs (règle des signes) » :
   cours, méthodes, exercices, cartes mémoire, fiche, séries sans fin.
   Chargé après gfx.js et data.js, avant app.js. Tout est dans une IIFE (aucun nom global ajouté). */
(function () {

NOTIONS.push({ id: 'signes', nom: 'Règle des signes', sub: 'Multiplier et diviser des nombres relatifs' });

/* ============ COURS ============ */
CH.push(
{ id: 'sg-produit', n: 'signes', title: `Le produit de deux nombres relatifs`, sub: `La règle des signes`,
  html: () => `
<p>Tu sais déjà additionner des nombres relatifs. Pour les <b>multiplier</b>, tout se joue sur le signe.</p>
<div class="def"><b>Règle des signes</b><br>
<b>Mêmes signes</b> → le produit est <b>positif</b>.<br>
<b>Signes différents</b> → le produit est <b>négatif</b>.</div>
<table class="tbl"><tr><th>×</th><th>+</th><th>−</th></tr><tr><th>+</th><td>+</td><td>−</td></tr><tr><th>−</th><td>−</td><td>+</td></tr></table>
<div class="def"><b>Méthode en 2 temps</b><br>
1. Je trouve le <b>signe</b>.<br>
2. Je calcule avec les nombres <b>sans leur signe</b>.</div>
${reveal(`Exemple : (−6) × 4`, [`Signes : un − et un +. Ils sont différents.`, `Donc le produit est négatif.`, `Sans les signes : 6 × 4 = 24.`, `(−6) × 4 = <b>−24</b>`])}
${reveal(`Exemple : (−5) × (−8)`, [`Signes : un − et un −. Ce sont les mêmes.`, `Donc le produit est positif.`, `Sans les signes : 5 × 8 = 40.`, `(−5) × (−8) = <b>40</b>`])}
<div class="exb"><b>Dans un jeu vidéo</b><br>Un piège enlève 10 points de vie. Tu le touches 3 fois.<br>3 × (−10) = −30. Tu perds 30 points de vie.</div>
<p class="note">Pour t'en souvenir : « l'ennemi de mon ennemi est mon ami ». (−) × (−) = (+).</p>`,
  quick: { q: `(−9) × (−2) = ?`, opts: [`18`, `−18`, `−11`, `11`], a: 0, why: `Mêmes signes, donc produit positif. Puis 9 × 2 = 18.` } },

{ id: 'sg-quotient', n: 'signes', title: `Le quotient de deux nombres relatifs`, sub: `Même règle que pour le produit`,
  html: () => `
<p>Pour <b>diviser</b>, rien de nouveau. C'est la même règle des signes.</p>
<div class="def"><b>Mêmes signes</b> → le quotient est <b>positif</b>.<br>
<b>Signes différents</b> → le quotient est <b>négatif</b>.</div>
<table class="tbl"><tr><th>Calcul</th><th>Signes</th><th>Résultat</th></tr>
<tr><td>30 ÷ 5</td><td>+ et +</td><td>6</td></tr>
<tr><td>(−30) ÷ (−5)</td><td>− et −</td><td>6</td></tr>
<tr><td>(−30) ÷ 5</td><td>− et +</td><td>−6</td></tr>
<tr><td>30 ÷ (−5)</td><td>+ et −</td><td>−6</td></tr></table>
${reveal(`Exemple : (−35) ÷ 7`, [`Signes : un − et un +. Ils sont différents.`, `Donc le quotient est négatif.`, `Sans les signes : 35 ÷ 7 = 5.`, `(−35) ÷ 7 = <b>−5</b>`])}
${reveal(`Exemple : (−54) ÷ (−6)`, [`Signes : un − et un −. Ce sont les mêmes.`, `Donc le quotient est positif.`, `Sans les signes : 54 ÷ 6 = 9.`, `(−54) ÷ (−6) = <b>9</b>`])}
<div class="exb"><b>Avec un trait de fraction</b><br>Le trait de fraction veut dire « divisé par ».<br>${F('−18', '3')} = (−18) ÷ 3 = −6</div>
<p class="note">On ne divise jamais par 0.</p>`,
  quick: { q: `28 ÷ (−4) = ?`, opts: [`−7`, `7`, `−24`, `24`], a: 0, why: `Signes différents, donc quotient négatif. Puis 28 ÷ 4 = 7.` } },

{ id: 'sg-plusieurs', n: 'signes', title: `Plusieurs facteurs`, sub: `Je compte les signes −`,
  html: () => `
<p>Trois facteurs ou plus ? Pas besoin d'avancer deux par deux.</p>
<div class="def"><b>Je compte les signes −.</b><br>
Nombre <b>pair</b> de signes − (0, 2, 4…) → produit <b>positif</b>.<br>
Nombre <b>impair</b> de signes − (1, 3, 5…) → produit <b>négatif</b>.</div>
<p>Pourquoi ? Deux signes − ensemble donnent un +. Ils s'annulent par paires.</p>
${reveal(`Exemple : (−2) × 3 × (−5) × (−1)`, [`Je compte les signes − : il y en a 3.`, `3 est impair. Le produit est négatif.`, `Sans les signes : 2 × 3 × 5 × 1 = 30.`, `Résultat : <b>−30</b>`])}
${reveal(`Exemple : (−2) × (−2) × (−5) × (−3)`, [`Je compte les signes − : il y en a 4.`, `4 est pair. Le produit est positif.`, `Sans les signes : 2 × 2 × 5 × 3 = 60.`, `Résultat : <b>60</b>`])}
<div class="trap"><b>Piège.</b> Je compte les signes −, pas les facteurs. Les facteurs positifs ne changent pas le signe.</div>`,
  quick: { q: `Quel est le signe de (−1) × (−2) × (−3) × (−4) × 5 ?`, opts: [`Positif`, `Négatif`, `On ne peut pas savoir`], a: 0, why: `Il y a 4 signes −. 4 est pair, donc le produit est positif.` } },

{ id: 'sg-piege', n: 'signes', title: `Le piège : + et − contre × et ÷`, sub: `La règle des signes ne sert pas partout`,
  html: () => `
<div class="trap"><b>Le piège du contrôle.</b> La règle des signes, c'est pour <b>×</b> et <b>÷</b> seulement. Jamais pour une addition.</div>
<table class="tbl"><tr><th>Addition</th><th>Produit</th></tr>
<tr><td>(−3) + (−5) = −8</td><td>(−3) × (−5) = 15</td></tr>
<tr><td>(−7) + 2 = −5</td><td>(−7) × 2 = −14</td></tr>
<tr><td>6 + (−2) = 4</td><td>6 × (−2) = −12</td></tr></table>
<div class="def"><b>Rappel : additionner deux relatifs</b><br>
Mêmes signes → j'additionne les deux nombres et je garde ce signe.<br>
Signes différents → je soustrais, et je prends le signe du nombre le plus loin de zéro.</div>
<p>Soustraire, c'est ajouter l'<b>opposé</b> : 5 − (−8) = 5 + 8 = 13.</p>
${reveal(`Exemple : (−4) + (−9), puis (−4) × (−9)`, [`Je regarde d'abord l'opération.`, `<b>Addition</b> : deux pertes qui s'ajoutent. 4 + 9 = 13, je garde le signe −.`, `(−4) + (−9) = <b>−13</b>`, `<b>Produit</b> : là, j'utilise la règle des signes. Mêmes signes, donc positif.`, `(−4) × (−9) = <b>36</b>`])}
<p class="note">Avant de calculer, pose-toi une seule question : quelle est l'opération ?</p>`,
  quick: { q: `(−6) + (−2) = ?`, opts: [`−8`, `8`, `12`, `−12`], a: 0, why: `C'est une addition : pas de règle des signes. Deux nombres négatifs qui s'ajoutent : 6 + 2 = 8, et on garde le signe −.` } },

{ id: 'sg-priorites', n: 'signes', title: `Priorités et carrés`, sub: `Plusieurs opérations dans un calcul`,
  html: () => `
<div class="def"><b>L'ordre des calculs</b><br>
1. Les calculs entre parenthèses.<br>
2. Les <b>×</b> et les <b>÷</b>.<br>
3. Les <b>+</b> et les <b>−</b>.</div>
${reveal(`Exemple : 5 + (−3) × 4`, [`Il y a un + et un ×. Le × passe en premier.`, `(−3) × 4 = −12 (signes différents).`, `Je réécris : 5 + (−12).`, `C'est une addition : 5 + (−12) = <b>−7</b>`])}
<div class="trap"><b>Piège.</b> Je ne calcule pas de gauche à droite. 5 + (−3) ne se fait pas en premier.</div>
<p><b>Le carré d'un nombre négatif.</b> Les parenthèses changent tout.</p>
<table class="tbl"><tr><th>Écriture</th><th>Ce que ça veut dire</th><th>Résultat</th></tr>
<tr><td>(−4)<sup>2</sup></td><td>(−4) × (−4)</td><td>16</td></tr>
<tr><td>−4<sup>2</sup></td><td>l'opposé de 4 × 4</td><td>−16</td></tr></table>
${reveal(`Exemple : (−4)<sup>2</sup> contre −4<sup>2</sup>`, [`(−4)<sup>2</sup> : le signe − est dans la parenthèse. Il est au carré lui aussi.`, `(−4) × (−4) = <b>16</b>`, `−4<sup>2</sup> : pas de parenthèse. Le carré ne touche que le 4.`, `4 × 4 = 16, puis je prends l'opposé : <b>−16</b>`])}
<p class="note">Sur la calculatrice aussi, tape les parenthèses autour du nombre négatif.</p>`,
  quick: { q: `−3<sup>2</sup> = ?`, opts: [`−9`, `9`, `−6`, `6`], a: 0, why: `Pas de parenthèse : le carré ne touche que le 3. 3 × 3 = 9, puis l'opposé : −9.` } }
);

KEEP['sg-produit'] = [`Mêmes signes → produit positif. Signes différents → produit négatif.`, `D'abord le signe, ensuite le calcul sans les signes.`];
KEEP['sg-quotient'] = [`Le quotient suit la même règle des signes que le produit.`, `D'abord le signe, ensuite la division sans les signes.`];
KEEP['sg-plusieurs'] = [`Je compte les signes −.`, `Nombre pair → positif. Nombre impair → négatif.`, `Les facteurs positifs ne changent pas le signe.`];
KEEP['sg-piege'] = [`La règle des signes sert pour × et ÷, jamais pour + et −.`, `Je regarde l'opération avant de calculer.`, `Soustraire, c'est ajouter l'opposé.`];
KEEP['sg-priorites'] = [`Parenthèses, puis × et ÷, puis + et −.`, `(−4)² = 16, mais −4² = −16.`];

QH['sg-produit'] = `Méthode en 2 temps. Les deux facteurs ont-ils le même signe ? Ensuite, calcule sans les signes.`;
QH['sg-quotient'] = `C'est la même règle que pour un produit. Les deux nombres ont-ils le même signe ?`;
QH['sg-plusieurs'] = `Compte les signes − : combien y en a-t-il ? Ce nombre est-il pair ou impair ?`;
QH['sg-piege'] = `Regarde l'opération : est-ce un × ou un + ? La règle des signes ne sert que pour × et ÷.`;
QH['sg-priorites'] = `Y a-t-il une parenthèse autour du nombre négatif ? Sinon, le carré ne touche que le 3.`;

/* ============ MÉTHODES ============ */
const base = RC.length;
RC.push(
{ title: `Produit ou quotient de relatifs`, when: `Je vois un × ou un ÷ avec des nombres négatifs.`,
  steps: [`<b>Je regarde l'opération.</b> C'est bien un × ou un ÷ ?`, `<b>Je trouve le signe.</b> Deux nombres : mêmes signes → +, signes différents → −. Plus de deux facteurs : je compte les signes − (pair → +, impair → −).`, `<b>Je calcule sans les signes.</b>`, `<b>J'écris le résultat</b> avec son signe.`],
  ex: `(−7) × (−6) : mêmes signes → positif. 7 × 6 = 42. Résultat : <b>42</b>.<br>(−40) ÷ 8 : signes différents → négatif. 40 ÷ 8 = 5. Résultat : <b>−5</b>.`,
  trap: `Devant une addition, je n'utilise pas cette méthode : (−7) + (−6) = −13.` },
{ title: `Calcul avec plusieurs opérations`, when: `Je vois des + ou des − mélangés à des × ou des ÷.`,
  steps: [`<b>Je repère les opérations.</b> Je souligne les × et les ÷.`, `<b>Je calcule d'abord les parenthèses</b>, s'il y a un calcul dedans.`, `<b>Je calcule les × et les ÷</b> avec la règle des signes.`, `<b>Je réécris la ligne</b> avec ce qui reste.`, `<b>Je termine par les + et les −</b>, sans la règle des signes.`],
  ex: `7 + (−2) × 6 = 7 + (−12) = <b>−5</b>`,
  trap: `(−5)<sup>2</sup> = 25, mais −5<sup>2</sup> = −25. Sans parenthèse, le carré ne touche pas le signe −.` }
);
AIGUILLAGE.push(
    [`Un × ou un ÷ entre deux nombres relatifs`, base],
    [`Un produit de trois facteurs ou plus`, base],
    [`Des + ou des − mélangés à des × ou des ÷`, base + 1],
    [`Un carré avec un signe − devant`, base + 1]
);
VERIFS.push(
    `<b>Le signe.</b> Ai-je regardé l'opération avant d'utiliser la règle des signes ?`,
    `<b>Les parenthèses.</b> Ai-je écrit chaque nombre négatif entre parenthèses après un × ou un ÷ ?`,
    `<b>Les priorités.</b> Ai-je fait les × et les ÷ avant les + et les − ?`
);

/* ============ EXERCICES ============ */
THEMES.SA = { nom: 'Produit de deux relatifs', short: 'Produit', n: 'signes' };
THEMES.SB = { nom: 'Quotient de deux relatifs', short: 'Quotient', n: 'signes' };
THEMES.SC = { nom: 'Plusieurs facteurs', short: 'Plusieurs facteurs', n: 'signes' };
THEMES.SD = { nom: 'Le piège : + et − contre × et ÷', short: 'Le piège', n: 'signes' };
THEMES.SE = { nom: 'Priorités et carrés', short: 'Priorités', n: 'signes' };
THEMES.SF = { nom: 'Avec des nombres décimaux', short: 'Décimaux', n: 'signes' };

const PN = [`Positif`, `Négatif`];
const H2 = `Méthode en 2 temps : d'abord le signe, ensuite le calcul sans les signes.`;

const sgEx = [
/* ---- SA : produit de deux relatifs ---- */
{ id: 'SA1', t: 'SA', lvl: 1, type: 'qcm', fixed: true, q: `Quel est le signe du produit (−7) × (−3) ?`, opts: PN, a: 0,
  hint: `Regarde les signes des deux facteurs. Sont-ils les mêmes ou sont-ils différents ?`,
  corr: [`Les deux facteurs sont négatifs : mêmes signes.`, `Mêmes signes → le produit est <b>positif</b>.`] },
{ id: 'SA2', t: 'SA', lvl: 1, type: 'qcm', fixed: true, q: `Quel est le signe du produit 6 × (−9) ?`, opts: PN, a: 1,
  hint: `Regarde les signes des deux facteurs. Sont-ils les mêmes ou sont-ils différents ?`,
  corr: [`Un facteur positif, un facteur négatif : signes différents.`, `Signes différents → le produit est <b>négatif</b>.`] },
{ id: 'SA3', t: 'SA', lvl: 1, type: 'order', q: `Remets dans l'ordre les étapes pour calculer un produit de deux nombres relatifs.`,
  items: [`Je regarde les signes des deux facteurs`, `J'en déduis le signe du produit`, `Je multiplie les nombres sans leur signe`, `J'écris le résultat avec son signe`],
  hint: `Méthode en 2 temps : qu'est-ce qu'on cherche en premier, avant de calculer ?`,
  corr: [`1. Je regarde les signes des deux facteurs.`, `2. J'en déduis le signe du produit.`, `3. Je multiplie les nombres sans leur signe.`, `4. J'écris le résultat avec son signe.`] },
{ id: 'SA4', t: 'SA', lvl: 1, type: 'num', q: `Calcule : (−8) × 5`, a: -40, tol: 0, hint: H2,
  corr: [`Signes différents → négatif.`, `8 × 5 = 40.`, `(−8) × 5 = <b>−40</b>`] },
{ id: 'SA5', t: 'SA', lvl: 1, type: 'num', q: `Calcule : (−9) × (−6)`, a: 54, tol: 0, hint: H2,
  corr: [`Mêmes signes → positif.`, `9 × 6 = 54.`, `(−9) × (−6) = <b>54</b>`] },
{ id: 'SA6', t: 'SA', lvl: 1, type: 'num', q: `Calcule : 7 × (−4)`, a: -28, tol: 0, hint: H2,
  corr: [`Signes différents → négatif.`, `7 × 4 = 28.`, `7 × (−4) = <b>−28</b>`] },
{ id: 'SA7', t: 'SA', lvl: 2, type: 'qcm', q: `Quel produit est égal à −12 ?`, opts: [`(−3) × 4`, `(−3) × (−4)`, `(−6) × (−2)`, `3 × 4`], a: 0,
  hint: `Tous ces produits donnent 12 sans les signes. Pour chacun, trouve seulement le signe.`,
  corr: [`−12 est négatif : il faut deux facteurs de signes différents.`, `(−3) × 4 : un − et un +.`, `(−3) × 4 = <b>−12</b>`] },
{ id: 'SA8', t: 'SA', lvl: 2, type: 'num', q: `Dans un jeu vidéo, un piège enlève 15 points de vie à chaque fois. Tu tombes dessus 4 fois.<br>Calcule 4 × (−15) pour trouver la variation de tes points de vie.`, a: -60, tol: 0,
  hint: `Regarde les signes des deux facteurs. Puis calcule 4 × 15.`,
  corr: [`Signes différents → négatif.`, `4 × 15 = 60.`, `4 × (−15) = <b>−60</b>. Tu perds 60 points de vie.`] },
{ id: 'SA9', t: 'SA', lvl: 2, type: 'num', q: `Une descente en trottinette. À chaque virage, l'altitude varie de −2 m. Il y a 7 virages.<br>Quelle est la variation totale d'altitude ?`, a: -14, tol: 0, unit: 'm',
  hint: `La même variation se répète 7 fois. Quelle opération écris-tu ?`,
  corr: [`Je calcule 7 × (−2).`, `Signes différents → négatif. 7 × 2 = 14.`, `7 × (−2) = <b>−14 m</b>. On est descendu de 14 m.`] },
{ id: 'SA10', t: 'SA', lvl: 3, type: 'num', q: `Trouve le nombre manquant : (−7) × … = 56`, a: -8, tol: 0,
  hint: `Regarde le signe du résultat : les deux facteurs ont-ils le même signe ou des signes différents ? Ensuite, cherche dans la table de 7.`,
  corr: [`56 est positif : les deux facteurs ont le même signe.`, `Le premier est négatif, donc le second aussi.`, `7 × 8 = 56. Le nombre manquant est <b>−8</b>.`] },

/* ---- SB : quotient de deux relatifs ---- */
{ id: 'SB1', t: 'SB', lvl: 1, type: 'qcm', fixed: true, q: `Quel est le signe du quotient (−45) ÷ (−9) ?`, opts: PN, a: 0,
  hint: `Même règle que pour un produit. Les deux nombres ont-ils le même signe ?`,
  corr: [`Les deux nombres sont négatifs : mêmes signes.`, `Mêmes signes → le quotient est <b>positif</b>.`] },
{ id: 'SB2', t: 'SB', lvl: 1, type: 'qcm', fixed: true, q: `Quel est le signe du quotient 32 ÷ (−8) ?`, opts: PN, a: 1,
  hint: `Même règle que pour un produit. Les deux nombres ont-ils le même signe ?`,
  corr: [`Un nombre positif, un nombre négatif : signes différents.`, `Signes différents → le quotient est <b>négatif</b>.`] },
{ id: 'SB3', t: 'SB', lvl: 1, type: 'num', q: `Calcule : (−42) ÷ 6`, a: -7, tol: 0, hint: H2,
  corr: [`Signes différents → négatif.`, `42 ÷ 6 = 7.`, `(−42) ÷ 6 = <b>−7</b>`] },
{ id: 'SB4', t: 'SB', lvl: 1, type: 'num', q: `Calcule : (−63) ÷ (−7)`, a: 9, tol: 0, hint: H2,
  corr: [`Mêmes signes → positif.`, `63 ÷ 7 = 9.`, `(−63) ÷ (−7) = <b>9</b>`] },
{ id: 'SB5', t: 'SB', lvl: 1, type: 'num', q: `Calcule : 56 ÷ (−8)`, a: -7, tol: 0, hint: H2,
  corr: [`Signes différents → négatif.`, `56 ÷ 8 = 7.`, `56 ÷ (−8) = <b>−7</b>`] },
{ id: 'SB6', t: 'SB', lvl: 2, type: 'num', q: `Calcule : ${F('−72', '−9')}`, a: 8, tol: 0,
  hint: `Le trait de fraction veut dire « divisé par ». Écris la division, puis applique la méthode en 2 temps.`,
  corr: [`C'est (−72) ÷ (−9).`, `Mêmes signes → positif.`, `72 ÷ 9 = 8. Résultat : <b>8</b>`] },
{ id: 'SB7', t: 'SB', lvl: 2, type: 'qcm', q: `Quel quotient est égal à −5 ?`, opts: [`(−40) ÷ 8`, `(−40) ÷ (−8)`, `40 ÷ 8`, `(−8) ÷ 40`], a: 0,
  hint: `Le résultat cherché est négatif. Quels signes faut-il pour les deux nombres ? Vérifie aussi l'ordre de la division.`,
  corr: [`−5 est négatif : il faut deux nombres de signes différents.`, `(−40) ÷ 8 : signes différents, et 40 ÷ 8 = 5.`, `(−40) ÷ 8 = <b>−5</b>`] },
{ id: 'SB8', t: 'SB', lvl: 2, type: 'num', q: `Un sous-marin descend régulièrement. En 4 minutes, son altitude varie de −120 m.<br>Quelle est la variation d'altitude par minute ?`, a: -30, tol: 0, unit: 'm',
  hint: `La variation totale est partagée en 4 minutes égales. Quelle opération écris-tu ?`,
  corr: [`Je calcule (−120) ÷ 4.`, `Signes différents → négatif. 120 ÷ 4 = 30.`, `(−120) ÷ 4 = <b>−30 m</b> par minute.`] },
{ id: 'SB9', t: 'SB', lvl: 2, type: 'num', q: `Au basket, sur 4 matchs, l'écart de points total d'une équipe est de −36.<br>Quel est l'écart moyen par match ?`, a: -9, tol: 0,
  hint: `Une moyenne par match : on partage le total entre les 4 matchs.`,
  corr: [`Je calcule (−36) ÷ 4.`, `Signes différents → négatif. 36 ÷ 4 = 9.`, `(−36) ÷ 4 = <b>−9</b> points par match.`] },
{ id: 'SB10', t: 'SB', lvl: 3, type: 'num', q: `Trouve le nombre manquant : … ÷ (−4) = −9`, a: 36, tol: 0,
  hint: `Pour retrouver le nombre du début, fais le chemin inverse : multiplie le quotient par le diviseur.`,
  corr: [`Le nombre manquant est (−9) × (−4).`, `Mêmes signes → positif. 9 × 4 = 36.`, `Le nombre manquant est <b>36</b>. Vérification : 36 ÷ (−4) = −9.`] },

/* ---- SC : plusieurs facteurs ---- */
{ id: 'SC1', t: 'SC', lvl: 1, type: 'qcm', fixed: true, q: `Quel est le signe du produit (−2) × (−3) × (−5) ?`, opts: PN, a: 1,
  hint: `Compte les signes − : combien y en a-t-il ? Ce nombre est-il pair ou impair ?`,
  corr: [`Il y a 3 signes −.`, `3 est impair → le produit est <b>négatif</b>.`] },
{ id: 'SC2', t: 'SC', lvl: 1, type: 'qcm', fixed: true, q: `Quel est le signe du produit (−1) × 4 × (−2) × (−3) × (−5) ?`, opts: PN, a: 0,
  hint: `Compte seulement les signes −, pas les facteurs. Ce nombre est-il pair ou impair ?`,
  corr: [`Il y a 4 signes − (le facteur 4 ne compte pas).`, `4 est pair → le produit est <b>positif</b>.`] },
{ id: 'SC3', t: 'SC', lvl: 1, type: 'num', q: `Calcule : (−2) × 5 × (−3)`, a: 30, tol: 0,
  hint: `Compte les signes −. Puis multiplie les nombres sans leur signe.`,
  corr: [`2 signes − : pair → positif.`, `2 × 5 × 3 = 30.`, `Résultat : <b>30</b>`] },
{ id: 'SC4', t: 'SC', lvl: 1, type: 'num', q: `Calcule : (−4) × (−2) × (−3)`, a: -24, tol: 0,
  hint: `Compte les signes −. Puis multiplie les nombres sans leur signe.`,
  corr: [`3 signes − : impair → négatif.`, `4 × 2 × 3 = 24.`, `Résultat : <b>−24</b>`] },
{ id: 'SC5', t: 'SC', lvl: 2, type: 'num', q: `Calcule : (−1) × (−1) × (−1) × (−1) × (−7)`, a: -7, tol: 0,
  hint: `Compte tous les signes −, y compris celui du dernier facteur.`,
  corr: [`5 signes − : impair → négatif.`, `1 × 1 × 1 × 1 × 7 = 7.`, `Résultat : <b>−7</b>`] },
{ id: 'SC6', t: 'SC', lvl: 2, type: 'num', q: `Calcule : (−2)<sup>3</sup>, c'est-à-dire (−2) × (−2) × (−2)`, a: -8, tol: 0,
  hint: `C'est un produit de trois facteurs. Compte les signes −.`,
  corr: [`3 signes − : impair → négatif.`, `2 × 2 × 2 = 8.`, `(−2)<sup>3</sup> = <b>−8</b>`] },
{ id: 'SC7', t: 'SC', lvl: 2, type: 'multi', fixed: true, q: `Quels produits sont positifs ? (plusieurs réponses)`,
  opts: [`(−2) × (−3) × 4`, `(−1) × (−1) × (−1)`, `(−5) × 2 × (−2) × 3`, `(−2) × (−2) × (−2) × (−2) × (−2)`], a: [0, 2],
  hint: `Pour chaque produit, compte les signes −. Pas besoin de calculer.`,
  corr: [`(−2) × (−3) × 4 : 2 signes −, pair → <b>positif</b>.`, `(−1) × (−1) × (−1) : 3 signes −, impair → négatif.`, `(−5) × 2 × (−2) × 3 : 2 signes −, pair → <b>positif</b>.`, `Cinq fois (−2) : 5 signes −, impair → négatif.`] },
{ id: 'SC8', t: 'SC', lvl: 2, type: 'qcm', fixed: true, q: `Un produit a 20 facteurs. Ils sont tous négatifs. Quel est son signe ?`, opts: PN, a: 0,
  hint: `Combien y a-t-il de signes − ? Ce nombre est-il pair ou impair ?`,
  corr: [`Il y a 20 signes −.`, `20 est pair → le produit est <b>positif</b>.`] },
{ id: 'SC9', t: 'SC', lvl: 2, type: 'num', q: `Dans un jeu vidéo, un malus vaut −5 points. En mode difficile, il compte double. Tu le prends 3 fois.<br>Calcule 3 × 2 × (−5).`, a: -30, tol: 0,
  hint: `Trois facteurs : compte les signes −, puis calcule 3 × 2 × 5.`,
  corr: [`1 signe − : impair → négatif.`, `3 × 2 × 5 = 30.`, `3 × 2 × (−5) = <b>−30</b>. Tu perds 30 points.`] },
{ id: 'SC10', t: 'SC', lvl: 3, type: 'num', q: `Calcule : (−10) × (−2) × 5 × (−1) × (−3)`, a: 300, tol: 0,
  hint: `Compte les signes −. Pour le calcul, regroupe : 10 × 2, puis × 5, puis × 3.`,
  corr: [`4 signes − : pair → positif.`, `10 × 2 × 5 × 1 × 3 = 300.`, `Résultat : <b>300</b>`] },

/* ---- SD : le piège + / − contre × / ÷ ---- */
{ id: 'SD1', t: 'SD', lvl: 1, type: 'qcm', fixed: true, q: `Quel est le signe de la somme (−3) + (−5) ?`, opts: PN, a: 1,
  hint: `Attention à l'opération : c'est une addition. Imagine deux pertes qui s'ajoutent.`,
  corr: [`C'est une addition : pas de règle des signes.`, `Deux nombres négatifs qui s'ajoutent : la somme est <b>négative</b>.`, `(−3) + (−5) = −8`] },
{ id: 'SD2', t: 'SD', lvl: 1, type: 'multi', fixed: true, q: `Dans quels calculs utilise-t-on la règle des signes ? (plusieurs réponses)`,
  opts: [`(−8) × 2`, `(−8) + 2`, `(−8) ÷ (−2)`, `(−8) − 2`], a: [0, 2],
  hint: `Regarde seulement l'opération de chaque calcul.`,
  corr: [`La règle des signes sert pour × et ÷ seulement.`, `<b>(−8) × 2</b> et <b>(−8) ÷ (−2)</b> : oui.`, `(−8) + 2 et (−8) − 2 : non, ce sont une addition et une soustraction.`] },
{ id: 'SD3', t: 'SD', lvl: 1, type: 'num', q: `Calcule : (−7) + (−2)`, a: -9, tol: 0,
  hint: `Quelle est l'opération ? Pense à deux pertes qui s'ajoutent.`,
  corr: [`C'est une addition : pas de règle des signes.`, `Mêmes signes : 7 + 2 = 9, et je garde le signe −.`, `(−7) + (−2) = <b>−9</b>`] },
{ id: 'SD4', t: 'SD', lvl: 1, type: 'num', q: `Calcule : (−7) × (−2)`, a: 14, tol: 0,
  hint: `Quelle est l'opération ? Cette fois, la règle des signes s'applique.`,
  corr: [`C'est un produit : règle des signes.`, `Mêmes signes → positif. 7 × 2 = 14.`, `(−7) × (−2) = <b>14</b>`] },
{ id: 'SD5', t: 'SD', lvl: 2, type: 'num', q: `Calcule : (−9) + 4`, a: -5, tol: 0,
  hint: `C'est une addition de deux nombres de signes différents. Lequel est le plus loin de zéro ?`,
  corr: [`C'est une addition : pas de règle des signes.`, `Signes différents : 9 − 4 = 5. Le plus loin de zéro est −9, donc signe −.`, `(−9) + 4 = <b>−5</b>`] },
{ id: 'SD6', t: 'SD', lvl: 2, type: 'qcm', q: `Combien valent (−4) + (−6) et (−4) × (−6) ?`, opts: [`−10 et 24`, `10 et 24`, `−10 et −24`, `10 et −24`], a: 0,
  hint: `Deux opérations différentes, deux méthodes différentes. Pour laquelle utilise-t-on la règle des signes ?`,
  corr: [`Addition : deux nombres négatifs, 4 + 6 = 10, je garde le signe −. Résultat −10.`, `Produit : mêmes signes → positif. 4 × 6 = 24.`, `Réponse : <b>−10 et 24</b>`] },
{ id: 'SD7', t: 'SD', lvl: 2, type: 'num', q: `Calcule : 5 − (−8)`, a: 13, tol: 0,
  hint: `Soustraire un nombre, c'est ajouter son opposé. Quel est l'opposé de −8 ?`,
  corr: [`Soustraire −8, c'est ajouter son opposé, 8.`, `5 − (−8) = 5 + 8.`, `Résultat : <b>13</b>`] },
{ id: 'SD8', t: 'SD', lvl: 2, type: 'num', q: `Au basket, une équipe a un écart de −6 points à la mi-temps. Pendant le troisième quart-temps, l'écart varie encore de −5 points.<br>Quel est l'écart après le troisième quart-temps ?`, a: -11, tol: 0,
  hint: `Les deux variations se suivent. Faut-il les additionner ou les multiplier ?`,
  corr: [`Les variations s'ajoutent : (−6) + (−5).`, `Addition de deux nombres négatifs : 6 + 5 = 11, je garde le signe −.`, `L'écart est de <b>−11</b> points.`] },
{ id: 'SD9', t: 'SD', lvl: 2, type: 'num', q: `Le matin, il fait −4 °C. L'après-midi, la température a augmenté de 7 °C.<br>Quelle est la température l'après-midi ?`, a: 3, tol: 0, unit: '°C',
  hint: `Une augmentation, c'est une addition. Écris le calcul, puis demande-toi quel nombre est le plus loin de zéro.`,
  corr: [`Je calcule (−4) + 7.`, `Signes différents : 7 − 4 = 3. Le plus loin de zéro est 7, donc signe +.`, `Il fait <b>3 °C</b>.`] },
{ id: 'SD10', t: 'SD', lvl: 3, type: 'qcm', q: `Sur un brouillon, on lit : « (−5) + (−3) = 8, car moins et moins, ça fait plus. » Qu'en penses-tu ?`,
  opts: [`La règle des signes ne sert pas pour une addition. Le résultat est −8.`, `C'est correct.`, `Le résultat est −2.`, `Le résultat est 2.`], a: 0,
  hint: `Regarde l'opération. « Moins et moins, ça fait plus » : pour quelles opérations cette phrase est-elle vraie ?`,
  corr: [`« Moins et moins, ça fait plus » : seulement pour × et ÷.`, `Ici c'est une addition de deux nombres négatifs : 5 + 3 = 8, je garde le signe −.`, `(−5) + (−3) = <b>−8</b>`] },

/* ---- SE : priorités et carrés ---- */
{ id: 'SE1', t: 'SE', lvl: 1, type: 'qcm', q: `Dans 9 + (−2) × 3, quel calcul fait-on en premier ?`, opts: [`(−2) × 3`, `9 + (−2)`, `9 + 3`], a: 0,
  hint: `Quelles opérations vois-tu ? Laquelle est prioritaire ?`,
  corr: [`Il y a un + et un ×.`, `La multiplication est prioritaire : on calcule d'abord <b>(−2) × 3</b>.`] },
{ id: 'SE2', t: 'SE', lvl: 1, type: 'num', q: `Calcule : 8 + (−2) × 5`, a: -2, tol: 0,
  hint: `Commence par le ×. Réécris ensuite la ligne avant de faire l'addition.`,
  corr: [`D'abord le produit : (−2) × 5 = −10.`, `Je réécris : 8 + (−10).`, `Résultat : <b>−2</b>`] },
{ id: 'SE3', t: 'SE', lvl: 2, type: 'num', q: `Calcule : 10 − 3 × (−4)`, a: 22, tol: 0,
  hint: `Commence par le ×. Ensuite, soustraire un nombre, c'est ajouter son opposé.`,
  corr: [`D'abord le produit : 3 × (−4) = −12.`, `Je réécris : 10 − (−12) = 10 + 12.`, `Résultat : <b>22</b>`] },
{ id: 'SE4', t: 'SE', lvl: 1, type: 'qcm', fixed: true, q: `Quel est le signe de (−7)<sup>2</sup> ?`, opts: PN, a: 0,
  hint: `Écris le carré comme un produit de deux facteurs. Quels sont leurs signes ?`,
  corr: [`(−7)<sup>2</sup> = (−7) × (−7).`, `Mêmes signes → <b>positif</b>. (−7)<sup>2</sup> = 49.`] },
{ id: 'SE5', t: 'SE', lvl: 1, type: 'num', q: `Calcule : (−6)<sup>2</sup>`, a: 36, tol: 0,
  hint: `Le signe − est dans la parenthèse. Écris le produit que cela représente.`,
  corr: [`(−6)<sup>2</sup> = (−6) × (−6).`, `Mêmes signes → positif. 6 × 6 = 36.`, `Résultat : <b>36</b>`] },
{ id: 'SE6', t: 'SE', lvl: 2, type: 'num', q: `Calcule : −5<sup>2</sup>`, a: -25, tol: 0,
  hint: `Il n'y a pas de parenthèse. Sur quel nombre porte le carré ?`,
  corr: [`Pas de parenthèse : le carré ne touche que le 5.`, `5 × 5 = 25, puis je prends l'opposé.`, `−5<sup>2</sup> = <b>−25</b>`] },
{ id: 'SE7', t: 'SE', lvl: 2, type: 'num', q: `Calcule : (−3 + 7) × (−2)`, a: -8, tol: 0,
  hint: `Il y a un calcul entre parenthèses. Par quoi commence-t-on ?`,
  corr: [`D'abord la parenthèse : −3 + 7 = 4.`, `Puis 4 × (−2) : signes différents → négatif.`, `Résultat : <b>−8</b>`] },
{ id: 'SE8', t: 'SE', lvl: 2, type: 'num', q: `Dans un jeu vidéo, tu as 50 points. Tu touches 3 pièges. Chaque piège fait varier ton score de −20 points.<br>Calcule ton score : 50 + 3 × (−20).`, a: -10, tol: 0,
  hint: `Calcule d'abord la variation due aux 3 pièges. Ajoute-la ensuite aux 50 points.`,
  corr: [`D'abord le produit : 3 × (−20) = −60.`, `Puis 50 + (−60).`, `Ton score est de <b>−10</b> points.`] },
{ id: 'SE9', t: 'SE', lvl: 2, type: 'num', q: `Tu as 12 €. Tu commandes 2 roues de trottinette. Chaque roue fait varier ton argent de −9 €.<br>Calcule 12 + 2 × (−9).`, a: -6, tol: 0, unit: '€',
  hint: `Le × passe avant le +. Combien coûtent les deux roues ensemble ?`,
  corr: [`D'abord le produit : 2 × (−9) = −18.`, `Puis 12 + (−18).`, `Résultat : <b>−6 €</b>. Il te manque 6 €.`] },
{ id: 'SE10', t: 'SE', lvl: 3, type: 'num', q: `Calcule : (−3)<sup>2</sup> − 4 × (−2)`, a: 17, tol: 0,
  hint: `Calcule d'abord le carré et le produit, chacun de son côté. Termine par la soustraction.`,
  corr: [`Le carré : (−3)<sup>2</sup> = 9. Le produit : 4 × (−2) = −8.`, `Je réécris : 9 − (−8) = 9 + 8.`, `Résultat : <b>17</b>`] },

/* ---- SF : avec des nombres décimaux (même règle, même méthode) ---- */
{ id: 'SF1', t: 'SF', lvl: 1, type: 'num', q: `Calcule : (−2,5) × 4`, a: -10, tol: 0,
  hint: `Même méthode qu'avec des entiers. D'abord le signe, puis 2,5 × 4 sans les signes.`,
  corr: [`Signes différents → le produit est négatif.`, `Sans les signes : 2,5 × 4 = 10.`, `Résultat : <b>−10</b>`] },
{ id: 'SF2', t: 'SF', lvl: 1, type: 'num', q: `Calcule : (−0,5) × (−6)`, a: 3, tol: 0,
  hint: `Multiplier par 0,5, c'est prendre la moitié. Et le signe : les deux facteurs ont-ils le même ?`,
  corr: [`Mêmes signes → le produit est positif.`, `Sans les signes : 0,5 × 6 = 3 (la moitié de 6).`, `Résultat : <b>3</b>`] },
{ id: 'SF3', t: 'SF', lvl: 1, type: 'num', q: `Calcule : 1,5 × (−4)`, a: -6, tol: 0,
  hint: `Trouve le signe. Puis calcule 1,5 × 4 : c'est 4 + la moitié de 4.`,
  corr: [`Signes différents → le produit est négatif.`, `Sans les signes : 1,5 × 4 = 6.`, `Résultat : <b>−6</b>`] },
{ id: 'SF4', t: 'SF', lvl: 2, type: 'num', q: `Calcule : (−12,8) ÷ 2`, a: -6.4, tol: 0,
  hint: `La règle des signes marche aussi pour un quotient. Puis prends la moitié de 12,8.`,
  corr: [`Signes différents → le quotient est négatif.`, `Sans les signes : 12,8 ÷ 2 = 6,4.`, `Résultat : <b>−6,4</b>`] },
{ id: 'SF5', t: 'SF', lvl: 2, type: 'num', q: `Calcule : (−7,2) ÷ (−9)`, a: 0.8, tol: 0,
  hint: `Trouve le signe. Puis pense à 72 ÷ 9 : où va la virgule ?`,
  corr: [`Mêmes signes → le quotient est positif.`, `72 ÷ 9 = 8, donc 7,2 ÷ 9 = 0,8.`, `Résultat : <b>0,8</b>`] },
{ id: 'SF6', t: 'SF', lvl: 2, type: 'num', q: `Calcule : 2,4 × (−0,5)`, a: -1.2, tol: 0,
  hint: `Multiplier par 0,5, c'est prendre la moitié. N'oublie pas de chercher le signe d'abord.`,
  corr: [`Signes différents → le produit est négatif.`, `Sans les signes : 2,4 × 0,5 = 1,2 (la moitié de 2,4).`, `Résultat : <b>−1,2</b>`] },
{ id: 'SF7', t: 'SF', lvl: 3, type: 'num', q: `Calcule : (−6,3) ÷ (−0,7)`, a: 9, tol: 0,
  hint: `Trouve le signe. Puis 6,3 ÷ 0,7, c'est comme 63 ÷ 7 : on multiplie les deux nombres par 10.`,
  corr: [`Mêmes signes → le quotient est positif.`, `6,3 ÷ 0,7 = 63 ÷ 7 = 9.`, `Résultat : <b>9</b>`] },
{ id: 'SF8', t: 'SF', lvl: 2, type: 'num', q: `Un plongeur descend de 1,5 m chaque seconde. On note sa variation de profondeur par seconde : −1,5 m. Quelle est sa variation de profondeur au bout de 8 secondes ?`, a: -12, tol: 0, unit: 'm',
  hint: `Écris le calcul comme un produit : le nombre de secondes × la variation par seconde.`,
  corr: [`Le calcul : 8 × (−1,5).`, `Signes différents → négatif. Sans les signes : 8 × 1,5 = 12.`, `Résultat : <b>−12 m</b>. Il est descendu de 12 m.`] }
];
/* Retour ciblé sur les réponses numériques : le bon nombre avec le mauvais signe. */
for (const e of sgEx) if (e.type === 'num') e.diag = ({ v }) => (e.a !== 0 && v === -e.a) ? `Le nombre est bon, regarde le signe.` : '';
EX.push(...sgEx);

BLANC.push('SA5', 'SB3', 'SC4', 'SD5', 'SE10');

/* ============ CARTES MÉMOIRE ============ */
FL.push(
[`Signe du produit de deux nombres de même signe ?`, `<b>Positif.</b> Exemple : (−3) × (−4) = 12.`],
[`Signe du produit de deux nombres de signes différents ?`, `<b>Négatif.</b> Exemple : (−3) × 4 = −12.`],
[`Et pour un quotient ?`, `<b>La même règle</b> que pour un produit. (−12) ÷ (−4) = 3 et (−12) ÷ 4 = −3.`],
[`La méthode en 2 temps ?`, `1. Je trouve le <b>signe</b>. 2. Je calcule <b>sans les signes</b>.`],
[`Un produit de plusieurs facteurs : comment trouver son signe ?`, `Je compte les signes −. <b>Pair → positif. Impair → négatif.</b>`],
[`La règle des signes sert pour quelles opérations ?`, `Pour <b>×</b> et <b>÷</b> seulement. Jamais pour + et −. (−3) + (−5) = −8.`],
[`Dans 5 + (−3) × 4, par quoi je commence ?`, `Par le <b>×</b>. (−3) × 4 = −12, puis 5 + (−12) = −7.`],
[`(−4)<sup>2</sup> et −4<sup>2</sup> : même résultat ?`, `<b>Non.</b> (−4)<sup>2</sup> = 16. −4<sup>2</sup> = −16 : sans parenthèse, le carré ne touche que le 4.`]
);

/* ============ FICHE RÉCAP ============ */
FICHE.push(
[`La règle des signes (× et ÷)`, `<p><b>Mêmes signes</b> → résultat <b>positif</b>. <b>Signes différents</b> → résultat <b>négatif</b>.</p>
<table class="tbl"><tr><th>×</th><th>+</th><th>−</th></tr><tr><th>+</th><td>+</td><td>−</td></tr><tr><th>−</th><td>−</td><td>+</td></tr></table>
<p><b>Méthode.</b> 1. Je trouve le signe. 2. Je calcule sans les signes.</p>
<p><b>Plusieurs facteurs.</b> Je compte les signes − : pair → positif, impair → négatif.</p>
<p>(−5) × (−8) = 40 &nbsp;·&nbsp; (−35) ÷ 7 = −5 &nbsp;·&nbsp; (−2) × 3 × (−5) × (−1) = −30</p>`],
[`Les pièges`, `<p><b>+ contre ×.</b> La règle des signes ne sert pas pour une addition. (−3) + (−5) = −8, mais (−3) × (−5) = 15.</p>
<p><b>Priorités.</b> Parenthèses, puis × et ÷, puis + et −. 5 + (−3) × 4 = 5 + (−12) = −7.</p>
<p><b>Carrés.</b> (−4)<sup>2</sup> = 16, mais −4<sup>2</sup> = −16.</p>`]
);

/* ============ SÉRIES SANS FIN ============ */
/* Entier relatif non nul, de distance à zéro comprise entre lo et hi. */
const sgN = (rnd, lo, hi) => rPick(rnd, [-1, 1]) * rInt(rnd, lo, hi);
const sgCnt = arr => arr.filter(x => x < 0).length;
const sgWhy2 = (x, y) => (x < 0) === (y < 0) ? `Mêmes signes → positif.` : `Signes différents → négatif.`;
const sgDiag = a => ({ v }) => (a !== 0 && v === -a) ? `Le nombre est bon, regarde le signe.` : '';

function sgGen(rnd) {
    const k = rInt(rnd, 0, 9);
    let q, a, hint, corr;
    if (k <= 3) {                                   /* produit de deux relatifs */
        let x = sgN(rnd, 2, 10), y = sgN(rnd, 2, 10);
        if (x > 0 && y > 0) { if (rnd() < 0.5) x = -x; else y = -y; }
        a = x * y;
        q = `Calcule : ${rel(x)} × ${rel(y)}`;
        hint = `Méthode en 2 temps : d'abord le signe, ensuite le calcul sans les signes.`;
        corr = [sgWhy2(x, y), `${Math.abs(x)} × ${Math.abs(y)} = ${Math.abs(a)}.`, `${rel(x)} × ${rel(y)} = <b>${nb(a)}</b>`];
    } else if (k <= 6) {                            /* quotient exact */
        let d = sgN(rnd, 2, 10), r = sgN(rnd, 2, 10);
        if (d > 0 && r > 0) { if (rnd() < 0.5) d = -d; else r = -r; }
        const n = d * r;
        a = r;
        q = `Calcule : ${rel(n)} ÷ ${rel(d)}`;
        hint = `Même règle que pour un produit : d'abord le signe, ensuite la division sans les signes.`;
        corr = [sgWhy2(n, d), `${Math.abs(n)} ÷ ${Math.abs(d)} = ${Math.abs(a)}.`, `${rel(n)} ÷ ${rel(d)} = <b>${nb(a)}</b>`];
    } else if (k <= 8) {                            /* produit de trois facteurs */
        const f = [sgN(rnd, 2, 5), sgN(rnd, 2, 5), sgN(rnd, 2, 5)];
        if (sgCnt(f) === 0) f[rInt(rnd, 0, 2)] *= -1;
        a = f[0] * f[1] * f[2];
        const c = sgCnt(f), txt = f.map(rel).join(' × ');
        q = `Calcule : ${txt}`;
        hint = `Compte les signes −. Ce nombre est-il pair ou impair ? Puis calcule sans les signes.`;
        corr = [`${c} signe${c > 1 ? 's' : ''} − : ${c % 2 ? 'impair → négatif' : 'pair → positif'}.`, `${f.map(Math.abs).join(' × ')} = ${Math.abs(a)}.`, `${txt} = <b>${nb(a)}</b>`];
    } else {                                        /* priorité : a + b × c */
        const x = sgN(rnd, 1, 10);
        let y = sgN(rnd, 2, 6), z = sgN(rnd, 2, 6);
        if (y > 0 && z > 0) { if (rnd() < 0.5) y = -y; else z = -z; }
        const p = y * z;
        a = x + p;
        q = `Calcule : ${rel(x)} + ${rel(y)} × ${rel(z)}`;
        hint = `Le × passe avant le +. Calcule d'abord le produit, puis réécris la ligne.`;
        corr = [`D'abord le produit : ${rel(y)} × ${rel(z)} = ${nb(p)}.`, `Je réécris : ${rel(x)} + ${rel(p)}. C'est une addition : pas de règle des signes.`, `Résultat : <b>${nb(a)}</b>`];
    }
    return { type: 'num', q, a, tol: 0, hint, corr, diag: sgDiag(a) };
}

DRILLS.push({ k: 'signes', n: 'signes', title: 'Séries sans fin', d: 'Des produits et des quotients, autant que tu veux',
    intro: `<div class="def"><b>Mêmes signes</b> → positif. <b>Signes différents</b> → négatif.<br>Plusieurs facteurs : je compte les signes − (pair → positif, impair → négatif).<br>Le × passe avant le +.</div>`,
    gen: sgGen });

})();
