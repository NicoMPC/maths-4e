# Maths 4e

Site de révision de maths de 4e, à utiliser seul sur téléphone : cours en
chapitres courts, exercices corrigés avec indices, séries sans fin, méthodes,
fiche récap, cartes mémoire et contrôle blanc.

- En ligne : https://nicompc.github.io/maths-4e/
- Dépôt : https://github.com/NicoMPC/maths-4e (public, GitHub Pages sur `main`)
- Construit le 4 octobre 2026 à partir du moteur de `lumiere-2nde`, pour un
  contrôle sur la règle des signes et le théorème de Pythagore. Site public :
  aucun prénom, formulations neutres.

HTML / CSS / JavaScript sans dépendance, sans serveur, sans étape de build.
La progression est enregistrée dans le navigateur (`localStorage`, clé
`maths-4e-v1`).

## Le principe : une chose à la fois

- **Une seule porte d'entrée** : l'accueil propose « Prochaine étape », qui
  enchaîne notion par notion le cours, puis les exercices, puis les révisions.
- **Un seul exercice à l'écran** (pas de liste à faire défiler). « Suivant » se
  débloque quand l'exercice est réussi ou sa correction lue.
- **Des exemples qui se déroulent** ligne par ligne au toucher (`reveal`).
- **Réponses au doigt** quand c'est possible ; bouton `+/−` à côté du champ de
  réponse, parce que le clavier numérique des téléphones n'a pas toujours de
  touche « moins ».
- Pas de points, pas de badges, pas de minuteur.

## Ce qu'il y a dedans

| Onglet | Contenu |
|---|---|
| **Cours** | Les chapitres, groupés par notion : règle, exemple déroulé, piège, « Je retiens », question qui valide le chapitre. |
| **Exercices** | Par notion puis par thème, un exercice à la fois ; liste « à retravailler » ; une « série sans fin » par notion (questions tirées au hasard). |
| **Contrôle** | Date du contrôle, méthodes (recettes en étapes), contrôle blanc noté sur 20, fiche récap, cartes mémoire. |
| **Calculette** | Celle de `lumiere-2nde` (touches x² et √). |

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | La page : en-tête, onglets, zone `#app`, ordre de chargement des scripts. |
| `css/style.css`, `css/calc.css` | Le style (repris de `lumiere-2nde`, ajouts en fin de fichier). |
| `js/gfx.js` | Aides d'affichage : `F` (fraction), `nb`, `rel`, `sq`, `rac`, `reveal`, `mulberry`, `rInt`, `rPick`. |
| `js/data.js` | Les conteneurs vides (`NOTIONS`, `CH`, `EX`, `THEMES`, `RC`, `FL`, `FICHE`, `DRILLS`…) et la méthode générale `RC[0]`. |
| `js/signes.js` | Notion « règle des signes » : remplit les conteneurs. |
| `js/pythagore.js` | Notion « théorème de Pythagore » : remplit les conteneurs, définit ses figures (`pyTri`…). |
| `js/calc.js` | La calculatrice. |
| `js/suivi.js` | Envoi de la progression vers le tableau de suivi (voir plus bas). |
| `js/app.js` | Le moteur : sauvegarde, navigation par `#hash`, cours, exercices un par un, séries, cartes, contrôle blanc. |
| `tests/` | `verif-contenu.js` (structure d'ensemble) et un `verif-<notion>.js` par notion (recalcule chaque réponse). |

## Ajouter une notion

1. Créer `js/<notion>.js` sur le modèle de `signes.js` : il pousse dans
   `NOTIONS`, `CH` (avec `n: '<id de la notion>'`), `KEEP`, `QH`, `THEMES`
   (avec `n`), `EX`, `BLANC`, `FL`, `RC` + `AIGUILLAGE`, `VERIFS`, `FICHE`, et
   éventuellement `DRILLS` (un générateur `gen: rnd => exercice`).
2. Ajouter la balise `<script>` dans `index.html`, avant `calc.js`. L'ordre des
   balises est l'ordre d'affichage des notions.
3. Écrire `tests/verif-<notion>.js`, qui recalcule chaque réponse numérique.

Types d'exercices : `qcm` (`opts`, `a` = index, `fixed: true` pour ne pas
mélanger), `multi` (`a` = tableau d'index), `num` (`a`, `tol`, `unit`, réponse
négative possible), `order` (`items` dans le bon ordre). Champs facultatifs :
`fig: () => svg`, `diag: ({ v }) => phrase` (retour ciblé sur une erreur
classique). Un chapitre peut avoir `fx: racine => …` pour brancher une petite
interaction après l'affichage.

## Règles de contenu

- **Vocabulaire du programme** de cycle 4.
- **Un indice partout, qui ne donne jamais la réponse** (ni le signe attendu).
- **Chaque calcul est vérifié** par les tests avant publication.
- **Jamais de prénom**, jamais de rappel d'échec : on écrit « à retravailler ».
- **Phrases courtes**, un chapitre = un ou deux écrans de téléphone.

## Suivi de la progression (Google Sheet)

`js/suivi.js` est le même fichier que dans `lumiere-2nde`. Il n'envoie rien
tant que le site n'a pas été ouvert une fois avec un lien personnel
(`…/?k=code`). Le code est alors gardé dans le navigateur (les deux sites
partagent la même origine, donc un seul lien suffit pour les deux), et un
résumé de la progression part vers un script Google Apps Script qui tient un
onglet par élève dans un Google Sheet : une ligne par jour et par site.

- Le site ne contient aucun nom : la correspondance code → onglet est dans le
  script, dont la source est dans `../suivi-sheet/Code.gs` (hors des dépôts
  publics).
- L'adresse du script est la constante `ENDPOINT` de `js/suivi.js`. Vide = suivi
  désactivé.
- Le résumé est calculé par `snapshot()` dans `app.js` ; il ne modifie jamais
  la progression enregistrée.

## Vérifier avant de publier

```bash
for f in js/*.js; do node --check "$f"; done
for t in tests/verif-*.js; do node "$t" | tail -1; done
```

Rendu, sans interface, à 360 px puis 320 px :

```bash
google-chrome --headless=new --hide-scrollbars --window-size=360,1200 \
  --virtual-time-budget=3000 --screenshot=/tmp/c.png "file://$PWD/index.html#cours/1"
```

## Publier

```bash
git add -A && git commit -m "…" && git push
```

## Limites connues

- Testé dans Chrome en taille téléphone, pas encore sur un vrai téléphone.
- La progression vit dans le navigateur : vider les données du site l'efface
  (et le code de suivi avec).
- Pas encore de fiche PDF à imprimer pour ce site.
