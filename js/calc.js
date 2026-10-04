/* Calculatrice scientifique flottante (degrés uniquement) — aucun eval, aucune dépendance.
 *
 * Représentation interne d'une expression : une chaîne ASCII faite de jetons accolés
 *   chiffres 0-9, "." (virgule décimale), + - * / ^ ( ),
 *   "²" (carré, postfixe), "sin(" "cos(" "tan(" "asin(" "sqrt(", "pi", "Ans",
 *   "E" = touche ×10ˣ (suivie d'un signe facultatif et de chiffres : 3E8, 1.0E-5).
 * Exemple : sin⁻¹(0,483) s'écrit "asin(0.483)" ; 3×10⁸ ÷ 1,5×10¹¹ s'écrit "3E8/1.5E11".
 */
var Calc = (function () {
    'use strict';

    var MSG = {
        incomplete: 'Expression incomplète',
        syntax: 'Erreur de syntaxe',
        div0: 'Division par zéro',
        asin: 'sin⁻¹ d\'un nombre plus grand que 1 : impossible. Vérifie que tu n\'as pas inversé n₁ et n₂.',
        sqrt: 'Racine carrée d\'un nombre négatif : impossible',
        tan: 'tan(90°) n\'existe pas',
        big: 'Nombre trop grand',
        nan: 'Calcul impossible'
    };

    function fail(code) { throw { calcError: MSG[code] }; }

    /* ---------- analyse lexicale ---------- */
    var WORDS = [['asin(', 'asin'], ['sin(', 'sin'], ['cos(', 'cos'], ['tan(', 'tan'], ['sqrt(', 'sqrt'], ['√(', 'sqrt']];
    var OPS = { '+': '+', '-': '-', '−': '-', '*': '*', '×': '*', '/': '/', '÷': '/', '^': '^', '(': '(', ')': ')', '²': 'sq' };

    function isDigit(c) { return c >= '0' && c <= '9'; }

    /* lit « [signe]chiffres » après un E situé en s[i] ; renvoie { txt, next } */
    function readExp(s, i) {
        var k = i + 1, sign = '';
        if (s[k] === '-' || s[k] === '−') { sign = '-'; k++; } else if (s[k] === '+') { k++; }
        var d = k;
        while (k < s.length && isDigit(s[k])) k++;
        if (k === d) fail(k >= s.length ? 'incomplete' : 'syntax');
        if (s[k] === '.' || s[k] === ',') fail('syntax');
        return { txt: sign + s.slice(d, k), next: k };
    }

    function lex(s) {
        var out = [], i = 0, n = s.length, c, j, e, w, found;
        while (i < n) {
            c = s[i];
            if (c === ' ' || c === ' ' || c === ' ') { i++; continue; }
            if (isDigit(c) || c === '.' || c === ',') {
                j = i;
                while (j < n && (isDigit(s[j]) || s[j] === '.' || s[j] === ',')) j++;
                var txt = s.slice(i, j).replace(/,/g, '.');
                if (!/^(\d+\.?\d*|\.\d+)$/.test(txt)) fail(txt === '.' && j >= n ? 'incomplete' : 'syntax');
                if (s[j] === 'E') { e = readExp(s, j); txt += 'e' + e.txt; j = e.next; }
                out.push({ t: 'num', v: parseFloat(txt) });
                i = j; continue;
            }
            if (c === 'E') { e = readExp(s, i); out.push({ t: 'exp', v: parseFloat('1e' + e.txt) }); i = e.next; continue; }
            found = false;
            for (w = 0; w < WORDS.length; w++) {
                if (s.substr(i, WORDS[w][0].length) === WORDS[w][0]) { out.push({ t: 'fn', v: WORDS[w][1] }); i += WORDS[w][0].length; found = true; break; }
            }
            if (found) continue;
            if (s.substr(i, 2) === 'pi') { out.push({ t: 'num', v: Math.PI }); i += 2; continue; }
            if (c === 'π') { out.push({ t: 'num', v: Math.PI }); i++; continue; }
            if (s.substr(i, 3) === 'Ans') { out.push({ t: 'ans' }); i += 3; continue; }
            if (OPS[c]) { out.push({ t: OPS[c] }); i++; continue; }
            fail('syntax');
        }
        return out;
    }

    /* ---------- fonctions en degrés ---------- */
    function tidy(v) { return (isFinite(v) && v !== 0) ? Number(v.toPrecision(15)) : v; }
    function sinDeg(x) {
        var r = x % 360;
        if (r % 90 === 0) return [0, 1, 0, -1][((r / 90) % 4 + 4) % 4];
        return tidy(Math.sin(r * Math.PI / 180));
    }
    function cosDeg(x) {
        var r = x % 360;
        if (r % 90 === 0) return [1, 0, -1, 0][((r / 90) % 4 + 4) % 4];
        return tidy(Math.cos(r * Math.PI / 180));
    }
    function applyFn(name, x) {
        if (name === 'sin') return sinDeg(x);
        if (name === 'cos') return cosDeg(x);
        if (name === 'tan') {
            var r = ((x % 180) + 180) % 180;
            if (r === 90) fail('tan');
            if (r === 0) return 0;
            if (r === 45) return 1;
            if (r === 135) return -1;
            return tidy(Math.tan(r * Math.PI / 180));
        }
        if (name === 'asin') {
            if (Math.abs(x) > 1) {
                if (Math.abs(x) - 1 < 1e-12) x = x > 0 ? 1 : -1; else fail('asin');
            }
            return tidy(Math.asin(x) * 180 / Math.PI);
        }
        if (name === 'sqrt') {
            if (x < 0) fail('sqrt');
            return Math.sqrt(x);
        }
        fail('syntax');
    }

    /* ---------- analyseur à descente récursive ----------
     * expr    := term (('+' | '-') term)*
     * term    := unary (('*' | '/') unary | power)*          (multiplication implicite)
     * unary   := ('-' | '+') unary | power
     * power   := postfix ('^' unary)?                         (associatif à droite, −3² = −9)
     * postfix := primary ('²' | ×10ˣ)*
     * primary := nombre | π | Ans | ×10ˣ | '(' expr ')'? | fonction expr ')'?
     */
    function parse(toks, ansValue) {
        var p = 0;
        function peek() { return toks[p] ? toks[p].t : null; }
        function closeParen() {
            if (peek() === ')') p++;
            else if (p < toks.length) fail('syntax');
        }
        function primary() {
            var tk = toks[p], v;
            if (!tk) fail('incomplete');
            if (tk.t === 'num') { p++; return tk.v; }
            if (tk.t === 'ans') { p++; return ansValue; }
            if (tk.t === 'exp') { p++; return tk.v; }
            if (tk.t === '(') {
                p++;
                if (peek() === ')') fail('syntax');
                v = expr(); closeParen(); return v;
            }
            if (tk.t === 'fn') {
                p++;
                if (peek() === ')') fail('syntax');
                v = expr(); closeParen(); return applyFn(tk.v, v);
            }
            fail('syntax');
        }
        function postfix() {
            var v = primary(), t;
            while ((t = peek()) === 'sq' || t === 'exp') {
                v = t === 'sq' ? v * v : v * toks[p].v;
                p++;
            }
            return v;
        }
        function power() {
            var b = postfix(), e, r;
            if (peek() === '^') {
                p++;
                e = unary();
                if (b === 0 && e < 0) fail('div0');
                r = Math.pow(b, e);
                if (isNaN(r)) fail('nan');
                return r;
            }
            return b;
        }
        function unary() {
            if (peek() === '-') { p++; return -unary(); }
            if (peek() === '+') { p++; return unary(); }
            return power();
        }
        function term() {
            var v = unary(), t, d;
            for (;;) {
                t = peek();
                if (t === '*') { p++; v *= unary(); }
                else if (t === '/') { p++; d = unary(); if (d === 0) fail('div0'); v /= d; }
                else if (t === 'num' || t === 'ans' || t === '(' || t === 'fn') { v *= power(); }
                else return v;
            }
        }
        function expr() {
            var v = term(), t;
            while ((t = peek()) === '+' || t === '-') {
                p++;
                v = t === '+' ? v + term() : v - term();
            }
            return v;
        }
        if (!toks.length) fail('incomplete');
        var res = expr();
        if (p < toks.length) fail('syntax');
        if (isNaN(res)) fail('nan');
        if (!isFinite(res)) fail('big');
        res = tidy(res);
        return res === 0 ? 0 : res;
    }

    /* ---------- formatage à la française ---------- */
    var SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻', '−': '⁻', '+': '⁺' };
    function toSup(s) { return String(s).replace(/[0-9+\-−]/g, function (c) { return SUP[c]; }); }
    function fr(s) { return s.replace('.', ',').replace('-', '−'); }

    /* renvoie { m: mantisse, e: exposant ou null } en chaînes déjà francisées */
    function parts(v) {
        if (typeof v !== 'number' || !isFinite(v)) return null;
        if (v === 0) return { m: '0', e: null };
        var r = Number(v.toPrecision(10)), a = Math.abs(r);
        if (a >= 1e10 || a < 1e-4) {
            var x = r.toExponential(9).split('e');
            return { m: fr(String(Number(x[0]))), e: String(Number(x[1])).replace('-', '−') };
        }
        return { m: fr(String(r)), e: null };
    }
    function format(v) {
        var q = parts(v);
        if (!q) return 'Erreur';
        return q.e === null ? q.m : q.m + ' × 10' + toSup(q.e);
    }
    function formatHTML(v) {
        var q = parts(v);
        if (!q) return 'Erreur';
        return q.e === null ? q.m : q.m + ' × 10<sup>' + q.e + '</sup>';
    }

    /* ---------- état ---------- */
    var ans = 0;
    var tokens = [];
    var justEval = false;
    var history = [];
    var isOpen = false;
    var MAX_TOKENS = 80;
    var el = {};

    function evaluate(str, ansValue) {
        try {
            var v = parse(lex(String(str)), typeof ansValue === 'number' ? ansValue : ans);
            return { ok: true, value: v, text: format(v), html: formatHTML(v) };
        } catch (err) {
            if (err && err.calcError) return { ok: false, error: err.calcError };
            return { ok: false, error: MSG.syntax };
        }
    }

    /* ---------- affichage de la saisie ---------- */
    var SHOW = { '*': '×', '/': '÷', '+': '+', 'sin(': 'sin(', 'cos(': 'cos(', 'tan(': 'tan(', 'asin(': 'sin<sup>−1</sup>(', 'sqrt(': '√(', 'pi': 'π', 'Ans': 'Ans', '²': '<sup>2</sup>', '.': ',' };
    function isDigitTok(t) { return t.length === 1 && isDigit(t); }
    function exprHTML(tk) {
        var h = '', i = 0, t, prev, j, sup, unaryMinus;
        while (i < tk.length) {
            t = tk[i]; prev = i ? tk[i - 1] : null;
            if (t === 'E') {
                sup = ''; j = i + 1;
                if (tk[j] === '-' || tk[j] === '+') { sup += tk[j] === '-' ? '−' : '+'; j++; }
                while (j < tk.length && isDigitTok(tk[j])) { sup += tk[j]; j++; }
                h += '×10<sup>' + (sup || '<span class="calc-ph">▫</span>') + '</sup>';
                i = j; continue;
            }
            if (t === '-') {
                unaryMinus = prev === null || /^[+\-*\/^(]$/.test(prev) || /\($/.test(prev);
                h += unaryMinus ? '−' : ' − ';
            } else if (t === '+' || t === '*' || t === '/') {
                h += ' ' + SHOW[t] + ' ';
            } else {
                h += SHOW[t] || t;
            }
            i++;
        }
        return h;
    }

    /* vrai si la fin de la saisie est l'exposant d'un ×10ˣ (E, E-, E-12...) */
    function inExponent() {
        var i = tokens.length - 1;
        while (i >= 0 && isDigitTok(tokens[i])) i--;
        if (i >= 0 && (tokens[i] === '-' || tokens[i] === '+') && tokens[i - 1] === 'E') return true;
        return i >= 0 && tokens[i] === 'E';
    }
    /* vrai si le nombre en cours de saisie contient déjà une virgule */
    function hasComma() {
        var i = tokens.length - 1;
        while (i >= 0 && isDigitTok(tokens[i])) i--;
        return i >= 0 && tokens[i] === '.';
    }

    function render() {
        if (!el.expr) return;
        el.expr.innerHTML = exprHTML(tokens) + (justEval ? '' : '<span class="calc-caret" aria-hidden="true"></span>');
        el.expr.scrollLeft = el.expr.scrollWidth;
    }
    function showResult(html, kind) {
        if (!el.res) return;
        el.res.className = 'calc-res' + (kind ? ' ' + kind : '');
        el.res.innerHTML = html;
    }
    function renderHistory() {
        if (!el.hist) return;
        var h = '', i;
        for (i = 0; i < history.length; i++) {
            h += '<button type="button" class="calc-chip" data-h="' + i + '" aria-label="Réinsérer ' + history[i].text + '">' + history[i].html + '</button>';
        }
        el.hist.innerHTML = h;
    }

    /* ---------- saisie ---------- */
    var CONTINUES = { '+': 1, '-': 1, '*': 1, '/': 1, '^': 1, '²': 1, 'E': 1 };

    function insert(k) {
        if (justEval) {
            tokens = CONTINUES[k] ? ['Ans'] : [];
            justEval = false;
            showResult('');
        }
        if (tokens.length >= MAX_TOKENS) return;
        if (k === '.') {
            if (inExponent() || hasComma()) return;
            if (!tokens.length || !isDigitTok(tokens[tokens.length - 1])) tokens.push('0');
        }
        tokens.push(k);
        render();
    }
    function insertValue(v) {
        var s = String(Number(Math.abs(v).toPrecision(10))), last, wrap, i;
        if (s.indexOf('e') >= 0) s = s.replace('e+', 'E').replace('e', 'E');
        if (justEval) { tokens = []; justEval = false; showResult(''); }
        last = tokens.length ? tokens[tokens.length - 1] : null;
        wrap = v < 0 || (last !== null && (isDigitTok(last) || last === '.'));
        if (tokens.length + s.length + 3 > MAX_TOKENS) return;
        if (wrap) tokens.push('(');
        if (v < 0) tokens.push('-');
        for (i = 0; i < s.length; i++) tokens.push(s[i]);
        if (wrap) tokens.push(')');
        render();
    }
    function equals() {
        if (!tokens.length || justEval) return;
        var r = evaluate(tokens.join(''));
        if (!r.ok) { showResult(r.error, 'err'); return; }
        ans = r.value;
        history.unshift({ html: r.html, text: r.text, value: r.value });
        if (history.length > 3) history.length = 3;
        justEval = true;
        render();
        showResult('= ' + r.html, r.text.length > 13 ? 'long' : '');
        renderHistory();
    }
    function press(k) {
        if (k === 'AC') { tokens = []; justEval = false; showResult(''); render(); }
        else if (k === 'DEL') {
            if (justEval) { justEval = false; showResult(''); }
            tokens.pop(); render();
        }
        else if (k === '=') equals();
        else insert(k);
    }

    /* ---------- interface ---------- */
    var KEYS = [
        ['asin(', 'sin<sup>−1</sup>', 'fn hl', 'sinus inverse (arc sinus)'], ['sin(', 'sin', 'fn', 'sinus'], ['cos(', 'cos', 'fn', 'cosinus'], ['tan(', 'tan', 'fn', 'tangente'], ['sqrt(', '√', 'fn', 'racine carrée'],
        ['²', 'x<sup>2</sup>', 'fn', 'au carré'], ['^', 'x<sup>y</sup>', 'fn', 'puissance'], ['(', '(', 'fn', 'parenthèse ouvrante'], [')', ')', 'fn', 'parenthèse fermante'], ['pi', 'π', 'fn', 'pi'],
        ['7', '7', 'num'], ['8', '8', 'num'], ['9', '9', 'num'], ['DEL', '⌫', 'del', 'effacer un caractère'], ['AC', 'AC', 'del', 'tout effacer'],
        ['4', '4', 'num'], ['5', '5', 'num'], ['6', '6', 'num'], ['*', '×', 'op', 'multiplier'], ['/', '÷', 'op', 'diviser'],
        ['1', '1', 'num'], ['2', '2', 'num'], ['3', '3', 'num'], ['+', '+', 'op', 'plus'], ['-', '−', 'op', 'moins'],
        ['0', '0', 'num'], ['.', ',', 'num', 'virgule'], ['E', '×10<sup>x</sup>', 'hl', 'fois dix puissance'], ['Ans', 'Ans', 'fn', 'dernier résultat'], ['=', '=', 'eq', 'égal']
    ];
    var ICON = '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2.5" width="14" height="19" rx="2.5"/><path d="M8.5 6.5h7v3h-7z"/><path d="M8.5 13.5h.01M12 13.5h.01M15.5 13.5h.01M8.5 17.5h.01M12 17.5h.01M15.5 17.5h.01"/></svg>';

    function build() {
        var i, k, h = '';
        el.fab = document.createElement('button');
        el.fab.id = 'calcFab';
        el.fab.type = 'button';
        el.fab.setAttribute('aria-label', 'Calculatrice');
        el.fab.setAttribute('aria-expanded', 'false');
        el.fab.setAttribute('aria-controls', 'calc');
        el.fab.title = 'Calculatrice';
        el.fab.innerHTML = ICON;

        el.panel = document.createElement('section');
        el.panel.id = 'calc';
        el.panel.setAttribute('role', 'dialog');
        el.panel.setAttribute('aria-label', 'Calculatrice');
        el.panel.setAttribute('aria-hidden', 'true');

        for (i = 0; i < KEYS.length; i++) {
            k = KEYS[i];
            h += '<button type="button" class="calc-k ' + k[2].replace(/(\w+)/g, 'k-$1') + '" data-k="' + k[0] + '"' + (k[3] ? ' aria-label="' + k[3] + '"' : '') + '>' + k[1] + '</button>';
        }
        el.panel.innerHTML =
            '<div class="calc-head">' +
                '<span class="calc-deg" title="Angles en degrés">DEG</span>' +
                '<div class="calc-hist" aria-label="Derniers résultats"></div>' +
                '<button type="button" class="calc-close" aria-label="Fermer la calculatrice"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
            '</div>' +
            '<div class="calc-screen">' +
                '<div class="calc-expr" aria-label="Saisie"></div>' +
                '<div class="calc-res" aria-live="polite"></div>' +
            '</div>' +
            '<div class="calc-keys">' + h + '</div>';

        document.body.appendChild(el.fab);
        document.body.appendChild(el.panel);
        el.expr = el.panel.querySelector('.calc-expr');
        el.res = el.panel.querySelector('.calc-res');
        el.hist = el.panel.querySelector('.calc-hist');
        el.close = el.panel.querySelector('.calc-close');

        el.fab.addEventListener('click', toggle);
        el.close.addEventListener('click', close);
        /* un clic souris/tactile ne déplace pas le focus sur une touche : Entrée reste « = » */
        el.panel.addEventListener('mousedown', function (ev) {
            if (ev.target.closest && ev.target.closest('.calc-k, .calc-chip')) ev.preventDefault();
        });
        el.panel.addEventListener('click', function (ev) {
            var b = ev.target.closest ? ev.target.closest('button') : null;
            if (!b) return;
            if (b.hasAttribute('data-k')) press(b.getAttribute('data-k'));
            else if (b.hasAttribute('data-h')) {
                var it = history[Number(b.getAttribute('data-h'))];
                if (it) insertValue(it.value);
            }
        });
        document.addEventListener('keydown', onKey);
        window.addEventListener('resize', measure);
        render();
    }

    /* hauteur réelle de la barre d'onglets fixe (mobile) et du panneau, pour le CSS */
    function measure() {
        var root = document.documentElement, tabs = document.getElementById('tabs'), fixed = false;
        try { fixed = !!tabs && window.getComputedStyle(tabs).position === 'fixed'; } catch (e) { fixed = false; }
        if (fixed && tabs.offsetHeight) root.style.setProperty('--calc-tabs', tabs.offsetHeight + 'px');
        else root.style.removeProperty('--calc-tabs');
        if (isOpen && el.panel) root.style.setProperty('--calc-h', el.panel.offsetHeight + 'px');
    }

    var KEYMAP = { '+': '+', '-': '-', '*': '*', 'x': '*', '/': '/', ':': '/', '^': '^', '(': '(', ')': ')', ',': '.', '.': '.', 's': 'sin(', 'e': 'E', 'E': 'E', '=': '=' };
    function onKey(ev) {
        if (!isOpen || ev.ctrlKey || ev.metaKey || ev.altKey) return;
        var t = ev.target, tag = t && t.tagName ? t.tagName.toUpperCase() : '', key = ev.key, k = null;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (t && t.isContentEditable)) return;
        if (key === 'Escape') { ev.preventDefault(); close(); return; }
        if (key === 'Enter') {
            /* Entrée sur un bouton/lien ayant le focus clavier garde son rôle habituel */
            if (tag === 'BUTTON' || tag === 'A' || tag === 'SUMMARY') return;
            k = '=';
        }
        else if (key === 'Backspace') k = 'DEL';
        else if (key && key.length === 1 && isDigit(key)) k = key;
        else if (key === 'Dead' && ev.code === 'BracketLeft') k = '^';
        else if (KEYMAP.hasOwnProperty(key)) k = KEYMAP[key];
        if (k === null) return;
        ev.preventDefault();
        press(k);
    }

    function open() {
        if (!el.panel || isOpen) return;
        isOpen = true;
        el.panel.classList.add('open');
        el.panel.setAttribute('aria-hidden', 'false');
        el.fab.setAttribute('aria-expanded', 'true');
        el.fab.classList.add('off');
        document.documentElement.classList.add('calc-open');
        measure();
        render();
    }
    function close() {
        if (!el.panel || !isOpen) return;
        var inside = el.panel.contains(document.activeElement);
        isOpen = false;
        el.panel.classList.remove('open');
        el.panel.setAttribute('aria-hidden', 'true');
        el.fab.setAttribute('aria-expanded', 'false');
        el.fab.classList.remove('off');
        document.documentElement.classList.remove('calc-open');
        if (inside) el.fab.focus();
    }
    function toggle() { if (isOpen) close(); else open(); }

    if (typeof document !== 'undefined' && document.body) build();

    return {
        open: open, close: close, toggle: toggle,
        evaluate: evaluate, format: format, formatHTML: formatHTML,
        press: press,
        isOpen: function () { return isOpen; }
    };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = Calc;
