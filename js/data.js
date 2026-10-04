'use strict';
/* Les conteneurs du contenu. Chaque notion a son fichier (signes.js, pythagore.js…) qui les remplit.
   Chargé après gfx.js, avant les fichiers de notion et app.js. */

/* Notions : { id, nom, sub } — une entrée par fichier de notion, dans l'ordre d'affichage. */
const NOTIONS = [];
/* Chapitres de cours : { id, n (id de la notion), title, sub, html: () => …, quick: { q, opts, a, why }, fx?: racine => … } */
const CH = [];
const KEEP = {};   /* « Je retiens » : KEEP[idChapitre] = [phrases] */
const QH = {};     /* indice de la question du chapitre : QH[idChapitre] = phrase */

/* Méthodes : recettes en étapes. RC[0] est la méthode générale, les notions ajoutent les leurs. */
const RC = [
{ title: `Ma méthode pour chaque exercice`, when: `Valable partout, le jour du contrôle comme à la maison.`,
  steps: [`<b>Je lis l'énoncé jusqu'au bout.</b> Je souligne les données et la question.`, `<b>Je choisis mon outil.</b> Quelle règle, quelle formule ? Un schéma à main levée m'aide-t-il ?`, `<b>J'écris la règle ou la formule</b> avant de mettre les nombres.`, `<b>Je calcule</b>, une étape par ligne.`, `<b>Je n'oublie pas l'unité</b> quand il y en a une (cm, m…).`, `<b>Je me relis</b> comme si je corrigeais la copie d'un copain : le résultat est-il logique ?`] }
];
const AIGUILLAGE = [];   /* [`ce que je vois dans l'énoncé`, index de la recette dans RC] */
const VERIFS = [];       /* vérifications avant de rendre la copie */

/* Exercices. THEMES[clé] = { nom, short, n (id de la notion) } ; EX = liste des exercices. */
const THEMES = {};
const EX = [];
const BLANC = [];        /* ids des exercices du contrôle blanc */
const FL = [];           /* cartes mémoire : [question, réponse] */
const FICHE = [];        /* fiche récap : [titre, html] */
/* Séries sans fin : { k, n (id de la notion), title, d, intro (html court), gen: rnd => exercice } */
const DRILLS = [];
