'use strict';
/* Notion « Théorème de Pythagore » : cours, figures, méthodes, exercices, cartes mémoire, fiche, séries sans fin.
   Chargé après gfx.js et data.js, avant app.js. Tous les noms globaux et les classes CSS commencent par « py ». */

/* ---------- Styles propres à la notion (préfixe py-) ---------- */
(function () {
    if (typeof document === 'undefined' || !document.head) return;
    const st = document.createElement('style');
    st.id = 'py-style';
    st.textContent = `
.py-fill { fill: var(--def-bg); stroke: none; }
.py-side { stroke: var(--text); stroke-width: 2.4; stroke-linecap: round; fill: none; }
.py-side.py-hyp { stroke: var(--accent); stroke-width: 4; }
.py-side.py-yes { stroke: var(--ok); stroke-width: 6; }
.py-side.py-no { stroke: var(--warm); stroke-width: 6; }
.py-sq { fill: none; stroke: var(--warm); stroke-width: 2; stroke-linejoin: miter; }
.py-v { font-size: 15px; font-weight: 700; }
.py-len { font-size: 14px; font-weight: 500; }
.py-len.py-sm { font-size: 13px; }
.py-len.py-acc { fill: var(--accent); font-weight: 700; }
.py-len.py-q { fill: var(--accent); font-weight: 700; font-size: 17px; }
.py-halo { paint-order: stroke; stroke: var(--surface); stroke-width: 5px; stroke-linejoin: round; }
.py-hit { stroke: transparent; stroke-width: 38; fill: none; pointer-events: stroke; cursor: pointer; }
.py-wall { fill: var(--surface2); stroke: var(--line); stroke-width: 1.5; }
.py-ground { stroke: var(--muted); stroke-width: 2; stroke-linecap: round; }
.py-pole { stroke: var(--text); stroke-width: 6; stroke-linecap: round; }
.py-rung { stroke: var(--accent); stroke-width: 2; stroke-linecap: round; }
.py-dim { stroke: var(--muted); stroke-width: 1.2; }
.py-grid { stroke: var(--line); stroke-width: 1; }
.py-dash { stroke: var(--text); stroke-width: 2; stroke-dasharray: 5 4; fill: none; }
.py-pt { fill: var(--accent); }
.py-pick { border: 1px solid var(--line); border-radius: 12px; padding: 10px 12px; margin: 12px 0; background: var(--surface); }
.py-pick .fig { margin: 6px 0; }
.py-pick svg { touch-action: manipulation; }
.py-fb { min-height: 1.6em; font-weight: 600; margin: 6px 0; }
.py-fb.py-ok { color: var(--ok); }
.py-fb.py-ko { color: var(--warm); }
.py-eq { font-size: 1.2rem; font-weight: 700; text-align: center; margin: 8px 0; color: var(--accent); }
.py-steps { margin: 8px 0; padding-left: 22px; }
.py-steps li { margin: 5px 0; }
.py-redac { line-height: 1.9; }
`;
    document.head.appendChild(st);
})();

/* ---------- Figures ---------- */
const pyF = x => x.toFixed(1);
const pyEsc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const pyLenCls = (txt, acc) => `py-len${String(txt).trim() === '?' ? ' py-q' : acc ? ' py-acc' : ''}`;

/* Triangle rectangle paramétrable.
   o.names  : les 3 sommets, tableau ou chaîne ('ABC').
   o.right  : sommet de l'angle droit (par défaut le premier).
   o.len    : étiquettes des côtés, texte libre : { AB: '9 cm', AC: '12 cm', BC: '?' } (ordre des lettres indifférent).
   o.legs   : [longueur du côté angle droit → 1er autre sommet, longueur vers le 2e] pour la forme (rapport borné de 0,5 à 2).
   o.o      : orientation, de 0 à 5. 0 angle droit en bas à gauche, 1 en bas à droite, 2 en haut à gauche,
              3 en haut à droite, 4 hypoténuse à plat en bas, 5 hypoténuse à plat en haut.
   o.rot    : rotation supplémentaire en degrés.
   o.hyp    : true → hypoténuse en couleur. o.mark : false → pas de codage de l'angle droit.
   o.along  : true → étiquettes écrites le long des côtés (pour les textes longs).
   o.pick   : true → trois zones de toucher larges (data-py="hyp" ou "leg", data-i = numéro du côté). */
function pyTri(o = {}) {
    const nm = (typeof o.names === 'string' ? o.names.split('') : (o.names || ['A', 'B', 'C'])).slice(0, 3);
    while (nm.length < 3) nm.push('ABC'[nm.length]);
    const R = nm.includes(o.right) ? o.right : nm[0];
    const [P, Q] = nm.filter(x => x !== R);
    const V = [R, P, Q];
    const lg = Array.isArray(o.legs) ? o.legs : [3, 4];
    const ratio = Math.max(0.5, Math.min(2, (Number(lg[0]) / Number(lg[1])) || 0.75));
    const ori = (((o.o | 0) % 6) + 6) % 6;
    const rotate = (pts, t) => pts.map(([x, y]) => [x * Math.cos(t) - y * Math.sin(t), x * Math.sin(t) + y * Math.cos(t)]);
    let c = [[0, 0], [0, -ratio], [1, 0]];
    if (ori < 4) c = c.map(([x, y]) => [ori & 1 ? -x : x, ori & 2 ? -y : y]);
    else {
        c = rotate(c, -Math.atan2(ratio, 1));
        if ((c[0][1] > c[1][1]) !== (ori === 5)) c = c.map(([x, y]) => [x, -y]);
    }
    if (o.rot) c = rotate(c, Number(o.rot) * Math.PI / 180);
    const len = o.len || {};
    const lab = (X, Y) => { const v = len[X + Y] !== undefined ? len[X + Y] : len[Y + X]; return v === undefined || v === null ? '' : String(v); };
    const SIDES = [[0, 1, 2], [0, 2, 1], [1, 2, 0]];   /* le dernier est l'hypoténuse */
    const xs = c.map(p => p[0]), ys = c.map(p => p[1]);
    const bw = Math.max(...xs) - Math.min(...xs), bh = Math.max(...ys) - Math.min(...ys);

    function layout(S) {
        const s = Math.min(S / bw, S * 0.9 / bh);
        const p = c.map(([x, y]) => [x * s, y * s]);
        const G = [(p[0][0] + p[1][0] + p[2][0]) / 3, (p[0][1] + p[1][1] + p[2][1]) / 3];
        const box = [Math.min(...p.map(q => q[0])), Math.min(...p.map(q => q[1])), Math.max(...p.map(q => q[0])), Math.max(...p.map(q => q[1]))];
        const grow = (x0, y0, x1, y1) => { box[0] = Math.min(box[0], x0); box[1] = Math.min(box[1], y0); box[2] = Math.max(box[2], x1); box[3] = Math.max(box[3], y1); };
        let g = `<polygon points="${p.map(q => pyF(q[0]) + ',' + pyF(q[1])).join(' ')}" class="py-fill"/>`;
        let hits = '', txt = '';
        if (o.mark !== false) {
            const un = k => { const d = [p[k][0] - p[0][0], p[k][1] - p[0][1]], L = Math.hypot(d[0], d[1]); return [d[0] / L * 13, d[1] / L * 13]; };
            const u = un(1), v = un(2);
            g += `<path d="M${pyF(p[0][0] + u[0])},${pyF(p[0][1] + u[1])} L${pyF(p[0][0] + u[0] + v[0])},${pyF(p[0][1] + u[1] + v[1])} L${pyF(p[0][0] + v[0])},${pyF(p[0][1] + v[1])}" class="py-sq"/>`;
        }
        SIDES.forEach(([i, j, k], n) => {
            const isHyp = n === 2, A = p[i], B = p[j];
            const seg = `x1="${pyF(A[0])}" y1="${pyF(A[1])}" x2="${pyF(B[0])}" y2="${pyF(B[1])}"`;
            g += `<line ${seg} class="py-side${isHyp && o.hyp ? ' py-hyp' : ''}" data-i="${n}"/>`;
            if (o.pick) hits += `<line ${seg} class="py-hit" data-py="${isHyp ? 'hyp' : 'leg'}" data-i="${n}"/>`;
            const t = o.pick ? '' : lab(V[i], V[j]);
            if (!t) return;
            const d = [B[0] - A[0], B[1] - A[1]], L = Math.hypot(d[0], d[1]);
            const M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
            let nx = -d[1] / L, ny = d[0] / L;
            if (nx * (p[k][0] - M[0]) + ny * (p[k][1] - M[1]) > 0) { nx = -nx; ny = -ny; }
            const cls = pyLenCls(t, isHyp && o.hyp) + (o.along ? ' py-sm' : '');
            const w = t.length * (o.along ? 7.4 : 8.3);
            if (o.along) {
                let th = Math.atan2(d[1], d[0]) * 180 / Math.PI;
                if (th > 90) th -= 180; if (th <= -90) th += 180;
                const tr = th * Math.PI / 180, up = nx * Math.sin(tr) - ny * Math.cos(tr);
                const off = up > 0 ? 8 : 19;
                const x = M[0] + nx * off, y = M[1] + ny * off;
                const cx = M[0] + nx * 13, cy = M[1] + ny * 13;
                const hx = Math.abs(Math.cos(tr)) * w / 2 + Math.abs(Math.sin(tr)) * 9, hy = Math.abs(Math.sin(tr)) * w / 2 + Math.abs(Math.cos(tr)) * 9;
                grow(cx - hx, cy - hy, cx + hx, cy + hy);
                txt += `<text x="${pyF(x)}" y="${pyF(y)}" text-anchor="middle" transform="rotate(${pyF(th)} ${pyF(x)} ${pyF(y)})" class="${cls}">${pyEsc(t)}</text>`;
            } else if (Math.abs(nx) < 0.35) {
                const x = M[0] + nx * 12, y = M[1] + (ny > 0 ? 20 : -9);
                grow(x - w / 2, y - 14, x + w / 2, y + 4);
                txt += `<text x="${pyF(x)}" y="${pyF(y)}" text-anchor="middle" class="${cls}">${pyEsc(t)}</text>`;
            } else {
                const x = M[0] + nx * 10, y = M[1] + ny * 12 + 5;
                grow(nx > 0 ? x : x - w, y - 14, nx > 0 ? x + w : x, y + 4);
                txt += `<text x="${pyF(x)}" y="${pyF(y)}" text-anchor="${nx > 0 ? 'start' : 'end'}" class="${cls}">${pyEsc(t)}</text>`;
            }
        });
        p.forEach((q, i) => {
            const d = [q[0] - G[0], q[1] - G[1]], L = Math.hypot(d[0], d[1]) || 1;
            const x = q[0] + d[0] / L * 15, y = q[1] + d[1] / L * 15 + 5;
            grow(x - 9, y - 15, x + 9, y + 4);
            txt += `<text x="${pyF(x)}" y="${pyF(y)}" text-anchor="middle" class="py-v">${pyEsc(V[i])}</text>`;
        });
        return { g: g + txt + hits, box };
    }
    let out;
    for (const S of [175, 150, 128, 108]) { out = layout(S); if (out.box[2] - out.box[0] <= 288) break; }
    const b = out.box, W = Math.max(300, b[2] - b[0] + 12), H = b[3] - b[1] + 16;
    const x0 = (b[0] + b[2]) / 2 - W / 2, y0 = b[1] - 8;
    const desc = SIDES.map(([i, j]) => { const t = o.pick ? '' : lab(V[i], V[j]); return t ? `, ${V[i]}${V[j]} : ${t}` : ''; }).join('');
    const aria = o.mark === false ? `Triangle ${nm.join('')}${desc}` : `Triangle ${nm.join('')} rectangle en ${R}${desc}`;
    return `<svg class="illu py" viewBox="${pyF(x0)} ${pyF(y0)} ${pyF(W)} ${pyF(H)}" role="img" aria-label="${pyEsc(aria)}">${out.g}</svg>`;
}

/* Rectangle et sa diagonale. o.w (largeur), o.h (hauteur), o.d (diagonale) : étiquettes. o.names : 'ABCD' (A en bas à gauche, puis sens inverse des aiguilles). o.ratio : largeur / hauteur. */
function pyRect(o = {}) {
    const ratio = Math.max(1.2, Math.min(2.4, Number(o.ratio) || 1.7));
    const rw = 188, rh = rw / ratio, x0 = 48, y0 = 32, x1 = x0 + rw, y1 = y0 + rh, H = y1 + 34;
    const nm = o.names ? (typeof o.names === 'string' ? o.names.split('') : o.names) : null;
    let s = `<rect x="${x0}" y="${pyF(y0)}" width="${rw}" height="${pyF(rh)}" class="py-fill"/>`;
    s += `<path d="M${x1 - 13},${pyF(y1)} V${pyF(y1 - 13)} H${x1}" class="py-sq"/>`;
    s += `<path d="M${x0},${pyF(y1)} H${x1} V${pyF(y0)} H${x0} Z" class="py-side"/>`;
    s += `<line x1="${x0}" y1="${pyF(y1)}" x2="${x1}" y2="${pyF(y0)}" class="py-side py-hyp"/>`;
    if (o.w) s += `<text x="${x0 + rw / 2}" y="${pyF(y1 + 20)}" text-anchor="middle" class="${pyLenCls(o.w)}">${pyEsc(o.w)}</text>`;
    if (o.h) s += `<text x="${x1 + 9}" y="${pyF(y0 + rh / 2 + 5)}" class="${pyLenCls(o.h)}">${pyEsc(o.h)}</text>`;
    if (o.d) {
        const L = Math.hypot(rw, rh), q = String(o.d).trim() === '?', off = q ? 17 : 10, mx = x0 + rw / 2 - rh / L * off, my = y0 + rh / 2 - rw / L * off + (q ? 6 : 0), th = q ? 0 : -Math.atan2(rh, rw) * 180 / Math.PI;
        s += `<text x="${pyF(mx)}" y="${pyF(my)}" text-anchor="middle" transform="rotate(${pyF(th)} ${pyF(mx)} ${pyF(my)})" class="${pyLenCls(o.d, true)}">${pyEsc(o.d)}</text>`;
    }
    if (nm && nm.length >= 4) {
        const t = (x, y, n) => `<text x="${pyF(x)}" y="${pyF(y)}" text-anchor="middle" class="py-v">${pyEsc(n)}</text>`;
        s += t(x0 - 12, y1 + 14, nm[0]) + t(x1 + 12, y1 + 16, nm[1]) + t(x1 + 12, y0 - 5, nm[2]) + t(x0 - 12, y0 - 5, nm[3]);
    }
    const aria = `Rectangle${nm ? ' ' + nm.join('') : ''} et sa diagonale${o.w ? `, largeur : ${o.w}` : ''}${o.h ? `, hauteur : ${o.h}` : ''}${o.d ? `, diagonale : ${o.d}` : ''}`;
    return `<svg class="illu py" viewBox="0 0 300 ${pyF(H)}" role="img" aria-label="${pyEsc(aria)}">${s}</svg>`;
}

/* Échelle contre un mur (kind 'echelle') ou câble tendu depuis le haut d'un poteau (kind 'cable').
   o.v : hauteur, o.h : distance au sol, o.d : longueur de l'échelle ou du câble. */
function pyMur(o = {}) {
    const cable = o.kind === 'cable', gy = 178, X = 205, yT = cable ? 46 : 58, xF = cable ? 92 : 118;
    let s = `<line x1="18" y1="${gy}" x2="284" y2="${gy}" class="py-ground"/>`;
    if (cable) s += `<line x1="${X}" y1="${gy}" x2="${X}" y2="${yT}" class="py-pole"/>`;
    else s += `<rect x="${X}" y="26" width="18" height="${gy - 26}" class="py-wall"/>`;
    s += `<path d="M${X - 13},${gy} V${gy - 13} H${X}" class="py-sq"/>`;
    s += `<line x1="${xF}" y1="${gy}" x2="${X}" y2="${yT}" class="py-side py-hyp"/>`;
    const dx = X - xF, dy = yT - gy, L = Math.hypot(dx, dy), nx = dy / L, ny = -dx / L;   /* normale vers le haut à gauche */
    if (!cable) for (let k = 1; k <= 6; k++) {
        const t = k / 7, mx = xF + dx * t, my = gy + dy * t;
        s += `<line x1="${pyF(mx - nx * 6)}" y1="${pyF(my - ny * 6)}" x2="${pyF(mx + nx * 6)}" y2="${pyF(my + ny * 6)}" class="py-rung"/>`;
    }
    const dimX = cable ? X + 14 : X + 28;
    if (o.v) {
        s += `<path d="M${dimX - 4},${yT} H${dimX + 4} M${dimX},${yT} V${gy} M${dimX - 4},${gy} H${dimX + 4}" class="py-dim" fill="none"/>`;
        s += `<text x="${dimX + 7}" y="${(yT + gy) / 2 + 5}" class="${pyLenCls(o.v)}">${pyEsc(o.v)}</text>`;
    }
    if (o.h) s += `<text x="${(xF + X) / 2}" y="${gy + 21}" text-anchor="middle" class="${pyLenCls(o.h)}">${pyEsc(o.h)}</text>`;
    if (o.d) s += `<text x="${pyF(xF + dx / 2 + nx * (cable ? 12 : 18))}" y="${pyF(gy + dy / 2 + ny * (cable ? 12 : 18) + 5)}" text-anchor="end" class="${pyLenCls(o.d, true)}">${pyEsc(o.d)}</text>`;
    const aria = cable
        ? `Un câble tendu entre le haut d'un poteau vertical et le sol${o.v ? `, poteau : ${o.v}` : ''}${o.h ? `, distance au sol : ${o.h}` : ''}${o.d ? `, câble : ${o.d}` : ''}`
        : `Une échelle appuyée contre un mur vertical${o.v ? `, hauteur atteinte : ${o.v}` : ''}${o.h ? `, distance au pied du mur : ${o.h}` : ''}${o.d ? `, échelle : ${o.d}` : ''}`;
    return `<svg class="illu py" viewBox="0 0 300 208" role="img" aria-label="${pyEsc(aria)}">${s}</svg>`;
}

/* Rampe ou tremplin vu de côté. o.v : hauteur, o.h : longueur au sol, o.d : longueur de la pente. */
function pyRampe(o = {}) {
    const gy = 132, xa = 38, xb = 226, yt = 56;
    let s = `<line x1="14" y1="${gy}" x2="286" y2="${gy}" class="py-ground"/>`;
    s += `<polygon points="${xa},${gy} ${xb},${gy} ${xb},${yt}" class="py-wall"/>`;
    s += `<path d="M${xb - 13},${gy} V${gy - 13} H${xb}" class="py-sq"/>`;
    s += `<path d="M${xa},${gy} H${xb} V${yt}" class="py-side"/>`;
    s += `<line x1="${xa}" y1="${gy}" x2="${xb}" y2="${yt}" class="py-side py-hyp"/>`;
    const dx = xb - xa, dy = yt - gy, L = Math.hypot(dx, dy), th = Math.atan2(dy, dx) * 180 / Math.PI;
    if (o.h) s += `<text x="${(xa + xb) / 2}" y="${gy + 21}" text-anchor="middle" class="${pyLenCls(o.h)}">${pyEsc(o.h)}</text>`;
    if (o.v) s += `<text x="${xb + 9}" y="${(gy + yt) / 2 + 5}" class="${pyLenCls(o.v)}">${pyEsc(o.v)}</text>`;
    if (o.d) {
        const mx = xa + dx / 2 + dy / L * 10, my = gy + dy / 2 - dx / L * 10;
        s += `<text x="${pyF(mx)}" y="${pyF(my)}" text-anchor="middle" transform="rotate(${pyF(th)} ${pyF(mx)} ${pyF(my)})" class="${pyLenCls(o.d, true)}">${pyEsc(o.d)}</text>`;
    }
    const aria = `Une rampe vue de côté${o.v ? `, hauteur : ${o.v}` : ''}${o.h ? `, longueur au sol : ${o.h}` : ''}${o.d ? `, pente : ${o.d}` : ''}`;
    return `<svg class="illu py" viewBox="0 0 300 164" role="img" aria-label="${pyEsc(aria)}">${s}</svg>`;
}

/* Carte quadrillée : deux points, o.dx cases d'écart en largeur, o.dy en hauteur.
   o.a, o.b : noms des points. o.lx, o.ly, o.ld : étiquettes (par défaut « dx cases », « dy cases », « ? »). */
function pyGrille(o = {}) {
    const dx = Math.max(1, o.dx | 0 || 4), dy = Math.max(1, o.dy | 0 || 3);
    const cs = Math.min(24, 216 / (dx + 2)), x0 = 14, y0 = 12, gw = (dx + 2) * cs, gh = (dy + 2) * cs;
    const A = [x0 + cs, y0 + (dy + 1) * cs], B = [x0 + (dx + 1) * cs, y0 + cs];
    const lx = o.lx !== undefined ? o.lx : `${dx} cases`, ly = o.ly !== undefined ? o.ly : `${dy} cases`, ld = o.ld !== undefined ? o.ld : '?';
    let s = '';
    for (let i = 0; i <= dx + 2; i++) s += `<line x1="${pyF(x0 + i * cs)}" y1="${y0}" x2="${pyF(x0 + i * cs)}" y2="${pyF(y0 + gh)}" class="py-grid"/>`;
    for (let j = 0; j <= dy + 2; j++) s += `<line x1="${x0}" y1="${pyF(y0 + j * cs)}" x2="${pyF(x0 + gw)}" y2="${pyF(y0 + j * cs)}" class="py-grid"/>`;
    s += `<path d="M${pyF(A[0])},${pyF(A[1])} H${pyF(B[0])} V${pyF(B[1])}" class="py-dash"/>`;
    s += `<path d="M${pyF(B[0] - 9)},${pyF(A[1])} V${pyF(A[1] - 9)} H${pyF(B[0])}" class="py-sq"/>`;
    s += `<line x1="${pyF(A[0])}" y1="${pyF(A[1])}" x2="${pyF(B[0])}" y2="${pyF(B[1])}" class="py-side py-hyp"/>`;
    s += `<circle cx="${pyF(A[0])}" cy="${pyF(A[1])}" r="5" class="py-pt"/><circle cx="${pyF(B[0])}" cy="${pyF(B[1])}" r="5" class="py-pt"/>`;
    s += `<text x="${pyF(A[0] - 2)}" y="${pyF(A[1] - 9)}" text-anchor="middle" class="py-v py-halo">${pyEsc(o.a || 'A')}</text>`;
    s += `<text x="${pyF(B[0] + 2)}" y="${pyF(B[1] - 9)}" text-anchor="middle" class="py-v py-halo">${pyEsc(o.b || 'B')}</text>`;
    if (lx) s += `<text x="${pyF((A[0] + B[0]) / 2)}" y="${pyF(y0 + gh + 18)}" text-anchor="middle" class="${pyLenCls(lx)}">${pyEsc(lx)}</text>`;
    if (ly) s += `<text x="${pyF(x0 + gw + 7)}" y="${pyF((A[1] + B[1]) / 2 + 5)}" class="${pyLenCls(ly)}">${pyEsc(ly)}</text>`;
    if (ld) {
        const L = Math.hypot(B[0] - A[0], B[1] - A[1]);
        const mx = (A[0] + B[0]) / 2 + (B[1] - A[1]) / L * 13, my = (A[1] + B[1]) / 2 - (B[0] - A[0]) / L * 13 + 5;
        s += `<text x="${pyF(mx)}" y="${pyF(my)}" text-anchor="middle" class="${pyLenCls(ld, true)} py-halo">${pyEsc(ld)}</text>`;
    }
    const aria = `Carte quadrillée : du point ${o.a || 'A'} au point ${o.b || 'B'}, ${dx} cases vers la droite et ${dy} cases vers le haut`;
    return `<svg class="illu py" viewBox="0 0 300 ${pyF(y0 + gh + 28)}" role="img" aria-label="${pyEsc(aria)}">${s}</svg>`;
}

/* ---------- Rédactions modèles (les mêmes lignes que sur la copie) ---------- */
/* Nom d'un côté, lettres dans l'ordre du nom du triangle. */
const pySeg = (T, X, Y) => T.indexOf(X) <= T.indexOf(Y) ? X + Y : Y + X;
const pyRound1 = x => Math.round(x * 10) / 10;
const pyExact = x => Math.abs(x - Math.round(x * 1000) / 1000) < 1e-9;
const pyRes = (nom, s2, u) => { const r = Math.sqrt(s2); return pyExact(r) ? `${nom} = ${rac(nb(s2))} = <b>${nb(r)} ${u}</b>` : `${nom} = ${rac(nb(s2))} ≈ <b>${nb(pyRound1(r))} ${u}</b> (arrondi au dixième)`; };
/* Calcul de l'hypoténuse. T = 'ABC', R = sommet de l'angle droit, a et b = côtés de l'angle droit (vers le 1er puis le 2e autre sommet). */
function pyRedH(T, R, a, b, u) {
    const [P, Q] = T.split('').filter(x => x !== R), h = pySeg(T, P, Q), c1 = pySeg(T, R, P), c2 = pySeg(T, R, Q);
    return [`Le triangle ${T} est rectangle en ${R}.`,
        `D'après le théorème de Pythagore : ${sq(h)} = ${sq(c1)} + ${sq(c2)}`,
        `${sq(h)} = ${sq(nb(a))} + ${sq(nb(b))} = ${nb(a * a)} + ${nb(b * b)} = ${nb(a * a + b * b)}`,
        pyRes(h, a * a + b * b, u)];
}
/* Calcul d'un côté de l'angle droit. c = hypoténuse, a = côté connu (vers le sommet K), on cherche l'autre. */
function pyRedC(T, R, K, c, a, u) {
    const [P, Q] = T.split('').filter(x => x !== R), X = K === P ? Q : P, h = pySeg(T, P, Q), ck = pySeg(T, R, K), cx = pySeg(T, R, X);
    return [`Le triangle ${T} est rectangle en ${R}.`,
        `D'après le théorème de Pythagore : ${sq(h)} = ${sq(pySeg(T, R, P))} + ${sq(pySeg(T, R, Q))}`,
        `Je cherche un côté de l'angle droit : ${sq(cx)} = ${sq(h)} − ${sq(ck)}`,
        `${sq(cx)} = ${sq(nb(c))} − ${sq(nb(a))} = ${nb(c * c)} − ${nb(a * a)} = ${nb(c * c - a * a)}`,
        pyRes(cx, c * c - a * a, u)];
}
/* Même rédaction avec des mots (échelle, câble, diagonale…). */
function pyRedMotsH(intro, h, c1, c2, a, b, u) {
    return [intro, `D'après le théorème de Pythagore : ${sq(h)} = ${sq(c1)} + ${sq(c2)}`,
        `${sq(h)} = ${sq(nb(a))} + ${sq(nb(b))} = ${nb(a * a)} + ${nb(b * b)} = ${nb(a * a + b * b)}`, pyRes(h, a * a + b * b, u)];
}
function pyRedMotsC(intro, h, ck, cx, c, a, u) {
    return [intro, `D'après le théorème de Pythagore : ${sq(h)} = ${sq(ck)} + ${sq(cx)}`,
        `Je cherche un côté de l'angle droit : ${sq(cx)} = ${sq(h)} − ${sq(ck)}`,
        `${sq(cx)} = ${sq(nb(c))} − ${sq(nb(a))} = ${nb(c * c)} − ${nb(a * a)} = ${nb(c * c - a * a)}`, pyRes(cx, c * c - a * a, u)];
}
/* Retours ciblés sur les confusions classiques (sans donner la réponse). */
const pyNear = (v, t) => Math.abs(v - t) < 0.051;
const pyDiagH = (a, b) => ({ v }) =>
    pyNear(v, a * a + b * b) ? `Tu as trouvé le carré de la longueur. Il reste une étape : la racine carrée.`
    : pyNear(v, a + b) ? `Tu as ajouté les longueurs. Ce sont les <b>carrés</b> qu'on ajoute.`
    : pyNear(v, 2 * a + 2 * b) ? `Attention : le carré d'un nombre, c'est le nombre multiplié par lui-même, pas par 2.`
    : pyNear(v, Math.sqrt(Math.abs(a * a - b * b))) ? `Tu as soustrait. Pour l'hypoténuse, on <b>additionne</b> les carrés.`
    : v < Math.max(a, b) ? `L'hypoténuse est le plus long côté : ton résultat est trop petit.` : '';
const pyDiagC = (c, a) => ({ v }) =>
    pyNear(v, c * c - a * a) ? `Tu as trouvé le carré de la longueur. Il reste une étape : la racine carrée.`
    : pyNear(v, Math.sqrt(c * c + a * a)) ? `Tu as additionné. Ici tu cherches un côté de l'angle droit : on <b>soustrait</b>.`
    : pyNear(v, c - a) ? `Tu as soustrait les longueurs. Ce sont les <b>carrés</b> qu'on soustrait.`
    : pyNear(v, 2 * c - 2 * a) ? `Attention : le carré d'un nombre, c'est le nombre multiplié par lui-même, pas par 2.`
    : v >= c ? `Un côté de l'angle droit est plus court que l'hypoténuse : ton résultat est trop grand.` : '';

/* ---------- La notion ---------- */
NOTIONS.push({ id: 'pythagore', nom: 'Théorème de Pythagore', sub: 'Calculer une longueur dans un triangle rectangle' });

/* Triangles de la manipulation « touche l'hypoténuse » (chapitre 1). */
const PY_PICKS = [
    { names: 'ABC', right: 'A', legs: [3, 4], o: 0 },
    { names: 'RST', right: 'S', legs: [4, 3], o: 4 },
    { names: 'EFG', right: 'G', legs: [2, 3], o: 3 },
    { names: 'KLM', right: 'L', legs: [3, 2], o: 1, rot: 20 },
    { names: 'IJK', right: 'I', legs: [1, 1], o: 5 },
    { names: 'MNP', right: 'P', legs: [4, 2.2], o: 2 },
    { names: 'UVW', right: 'V', legs: [2, 3.5], o: 0, rot: -35 }
];

/* ---------- Cours ---------- */
CH.push(
{ id: 'py-hyp', n: 'pythagore', title: `Le triangle rectangle et son hypoténuse`, sub: `Le mot à connaître, et comment la repérer`,
  html: () => `
    <div class="def">Un <b>triangle rectangle</b> a un angle droit.<br>Le côté <b>en face de l'angle droit</b> s'appelle l'<b>hypoténuse</b>.<br>C'est toujours le <b>plus long</b> côté.</div>
    <div class="fig">${pyTri({ names: 'ABC', right: 'A', legs: [4, 5], hyp: true, along: true, len: { BC: 'hypoténuse', AB: 'côté de l’angle droit', AC: 'côté de l’angle droit' } })}</div>
    <p>Les deux autres côtés sont les <b>côtés de l'angle droit</b>. Ils touchent le petit carré.</p>
    <p><b>Avec le nom.</b> ABC est rectangle en A. L'hypoténuse est le côté <b>sans</b> la lettre A : c'est [BC].</p>
    <div class="trap">L'hypoténuse n'est pas toujours « en biais ». Cherche d'abord le petit carré. Puis regarde en face.</div>
    <div class="py-pick">
      <p><b>À toi.</b> Touche l'hypoténuse.</p>
      <div class="fig py-pick-fig">${pyTri(Object.assign({ pick: true }, PY_PICKS[0]))}</div>
      <p class="py-fb" aria-live="polite"></p>
      <button type="button" class="btn ghost small py-other">Autre triangle</button>
    </div>`,
  fx: root => {
    const box = root && root.querySelector ? root.querySelector('.py-pick') : null;
    if (!box) return;
    const fig = box.querySelector('.py-pick-fig'), fb = box.querySelector('.py-fb'), bt = box.querySelector('.py-other');
    if (!fig || !fb) return;
    let k = 0;
    fig.addEventListener('click', ev => {
        const h = ev.target && ev.target.closest ? ev.target.closest('[data-py]') : null;
        if (!h) return;
        const ok = h.getAttribute('data-py') === 'hyp';
        fig.querySelectorAll('.py-side').forEach(l => l.classList.remove('py-yes', 'py-no'));
        const l = fig.querySelector(`.py-side[data-i="${h.getAttribute('data-i')}"]`);
        if (l) l.classList.add(ok ? 'py-yes' : 'py-no');
        fb.textContent = ok ? `Oui, c'est le côté en face de l'angle droit.` : `Ce côté touche l'angle droit, ce n'est pas lui.`;
        fb.className = 'py-fb ' + (ok ? 'py-ok' : 'py-ko');
    });
    if (bt) bt.addEventListener('click', () => {
        k = (k + 1) % PY_PICKS.length;
        fig.innerHTML = pyTri(Object.assign({ pick: true }, PY_PICKS[k]));
        fb.textContent = ''; fb.className = 'py-fb';
    });
  },
  quick: { q: `Le triangle RST est rectangle en S. Quelle est son hypoténuse ?`, opts: [`[RS]`, `[ST]`, `[RT]`], a: 2, why: `L'angle droit est en S. Le côté en face ne touche pas S : c'est [RT].` } },

{ id: 'py-carre', n: 'pythagore', title: `Carré et racine carrée`, sub: `Les deux touches dont tu as besoin`,
  html: () => `
    <div class="def"><b>Le carré</b> d'un nombre : le nombre multiplié par lui-même.<br>${sq(5)} = 5 × 5 = 25<br><br><b>La racine carrée</b> : le chemin inverse.<br>${rac(25)} = 5, car ${sq(5)} = 25.</div>
    <div class="trap">${sq(5)} = 5 × 5 = 25. Ce n'est <b>pas</b> 5 × 2.</div>
    <p><b>Les carrés à connaître.</b></p>
    <table class="tbl">
      <tr><th>n</th><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td></tr>
      <tr><th>${sq('n')}</th><td>1</td><td>4</td><td>9</td><td>16</td><td>25</td></tr>
      <tr><th>n</th><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td></tr>
      <tr><th>${sq('n')}</th><td>36</td><td>49</td><td>64</td><td>81</td><td>100</td></tr>
      <tr><th>n</th><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td></tr>
      <tr><th>${sq('n')}</th><td>121</td><td>144</td><td>169</td><td>196</td><td>225</td></tr>
    </table>
    <p class="note">Le tableau se lit dans les deux sens : ${sq(12)} = 144, donc ${rac(144)} = 12.</p>
    ${reveal(`${sq('AB')} = 81 et AB est une longueur en cm. Trouve AB.`, [`${sq('AB')} = 81`, `AB = ${rac(81)}`, `AB = <b>9 cm</b>`])}
    <p><b>Avec la calculatrice.</b> Le nombre n'est pas dans le tableau ? Touche √, tape le nombre, puis =.</p>
    ${reveal(`${sq('EF')} = 30. Trouve EF, arrondi au dixième.`, [`EF = ${rac(30)}`, `La calculatrice affiche 5,477…`, `Le chiffre des centièmes est 7. Il vaut 5 ou plus : j'arrondis au-dessus.`, `EF ≈ <b>5,5 cm</b>`])}`,
  quick: { q: `Combien vaut ${sq(7)} ?`, opts: [`14`, `49`, `9`], a: 1, why: `${sq(7)} = 7 × 7 = 49. Le piège : 7 × 2 = 14.` } },

{ id: 'py-theo', n: 'pythagore', title: `Le théorème de Pythagore`, sub: `L'égalité à écrire avant tout calcul`,
  html: () => `
    <div class="def"><b>Si</b> un triangle est rectangle, <b>alors</b> le carré de l'hypoténuse est égal à la somme des carrés des deux autres côtés.</div>
    <div class="fig">${pyTri({ names: 'ABC', right: 'A', legs: [3, 4], hyp: true, o: 1 })}</div>
    <p>ABC est rectangle en A. L'hypoténuse est [BC].</p>
    <p class="py-eq">${sq('BC')} = ${sq('AB')} + ${sq('AC')}</p>
    <p><b>Pour écrire l'égalité sans figure :</b></p>
    <ol class="py-steps"><li>Je lis « rectangle en… ».</li><li>L'hypoténuse est le côté <b>sans</b> cette lettre.</li><li>Je l'écris <b>seule</b>, à gauche du signe =.</li></ol>
    ${reveal(`EFG est rectangle en F. Écris l'égalité de Pythagore.`, [`Le triangle EFG est rectangle en F.`, `L'hypoténuse est [EG] : pas de lettre F.`, `D'après le théorème de Pythagore : <b>${sq('EG')} = ${sq('EF')} + ${sq('FG')}</b>`])}
    <div class="trap">Le théorème ne marche <b>que</b> dans un triangle rectangle. Sur la copie, commence toujours par : « Le triangle … est rectangle en … ».</div>`,
  quick: { q: `KLM est rectangle en K. Quelle égalité est juste ?`, opts: [`${sq('LM')} = ${sq('KL')} + ${sq('KM')}`, `${sq('KL')} = ${sq('KM')} + ${sq('LM')}`, `LM = KL + KM`], a: 0, why: `L'angle droit est en K, donc l'hypoténuse est [LM]. Elle est seule à gauche, et tout est au carré.` } },

{ id: 'py-calc-hyp', n: 'pythagore', title: `Calculer l'hypoténuse`, sub: `Je connais les deux côtés de l'angle droit`,
  html: () => `
    <p>Je connais les deux côtés de l'angle droit. Je cherche le plus long côté.</p>
    <div class="fig">${pyTri({ names: 'ABC', right: 'A', legs: [6, 8], hyp: true, len: { AB: '6 cm', AC: '8 cm', BC: '?' } })}</div>
    <ol class="py-steps"><li>J'écris l'égalité.</li><li>Je remplace par les nombres. J'<b>additionne</b> les carrés.</li><li>Je prends la <b>racine carrée</b>.</li></ol>
    ${reveal(`ABC est rectangle en A. AB = 6 cm et AC = 8 cm. Calcule BC.`, pyRedH('ABC', 'A', 6, 8, 'cm'))}
    <div class="trap">${sq('BC')} = 100 n'est pas la réponse. Il reste la racine carrée.</div>
    <p class="note">Je vérifie : 10 cm est plus grand que 6 cm et que 8 cm. C'est bien le plus long côté.</p>`,
  quick: { q: `ABC est rectangle en A. AB = 3 cm et AC = 4 cm. Combien mesure BC ?`, opts: [`7 cm`, `5 cm`, `25 cm`], a: 1, why: `${sq('BC')} = ${sq(3)} + ${sq(4)} = 9 + 16 = 25, donc BC = ${rac(25)} = 5 cm. 25 est le carré, 7 est la somme sans les carrés.` } },

{ id: 'py-calc-cote', n: 'pythagore', title: `Calculer un côté de l'angle droit`, sub: `Je connais l'hypoténuse : je soustrais`,
  html: () => `
    <p>Je connais l'hypoténuse et un autre côté. Je cherche un <b>petit</b> côté.</p>
    <div class="fig">${pyTri({ names: 'RST', right: 'R', legs: [8, 15], hyp: true, o: 3, len: { ST: '17 cm', RS: '8 cm', RT: '?' } })}</div>
    <ol class="py-steps"><li>J'écris la <b>même</b> égalité : hypoténuse seule à gauche.</li><li>Je <b>soustrais</b> : carré de l'hypoténuse moins carré du côté connu.</li><li>Je prends la <b>racine carrée</b>.</li></ol>
    ${reveal(`RST est rectangle en R. ST = 17 cm et RS = 8 cm. Calcule RT.`, pyRedC('RST', 'R', 'S', 17, 8, 'cm'))}
    <div class="trap">Si tu additionnes ici, tu trouves un côté plus long que l'hypoténuse. Impossible.</div>
    <p class="note">Je vérifie : 15 cm est plus petit que 17 cm. C'est cohérent.</p>`,
  quick: { q: `Je cherche un côté de l'angle droit. Que fais-je avec les carrés ?`, opts: [`Je les additionne`, `Carré de l'hypoténuse moins carré de l'autre côté`, `Je les multiplie`], a: 1, why: `L'hypoténuse est le plus long côté. Pour trouver un côté plus court, on soustrait à partir de son carré.` } },

{ id: 'py-rect', n: 'pythagore', title: `Le triangle est-il rectangle ?`, sub: `Je connais les trois côtés : je compare`,
  html: () => `
    <p>Je connais les <b>trois</b> longueurs. Pas d'angle droit sur la figure.</p>
    <ol class="py-steps"><li>Je repère le <b>plus grand</b> côté. Je calcule son carré.</li><li>Je calcule la <b>somme des carrés</b> des deux autres.</li><li>Je compare.</li></ol>
    <table class="tbl left">
      <tr><td>Égal</td><td>Le triangle est rectangle. Je cite la <b>réciproque</b> du théorème de Pythagore.</td></tr>
      <tr><td>Pas&nbsp;égal</td><td>L'égalité de Pythagore n'est pas vérifiée, donc le triangle n'est pas rectangle.</td></tr>
    </table>
    <div class="fig">${pyTri({ names: 'ABC', right: 'A', legs: [9, 12], mark: false, o: 1, len: { AB: '9 cm', AC: '12 cm', BC: '15 cm' } })}</div>
    ${reveal(`ABC : AB = 9 cm, AC = 12 cm et BC = 15 cm. Est-il rectangle ?`, [`Le plus grand côté est [BC].`, `${sq('BC')} = ${sq(15)} = 225`, `${sq('AB')} + ${sq('AC')} = ${sq(9)} + ${sq(12)} = 81 + 144 = 225`, `${sq('BC')} = ${sq('AB')} + ${sq('AC')} : l'égalité de Pythagore est vérifiée.`, `D'après la réciproque du théorème de Pythagore, <b>le triangle ABC est rectangle en A</b>.`])}
    ${reveal(`DEF : DE = 5 cm, DF = 7 cm et EF = 9 cm. Est-il rectangle ?`, [`Le plus grand côté est [EF].`, `${sq('EF')} = ${sq(9)} = 81`, `${sq('DE')} + ${sq('DF')} = ${sq(5)} + ${sq(7)} = 25 + 49 = 74`, `81 ≠ 74 : l'égalité de Pythagore n'est pas vérifiée.`, `Donc <b>le triangle DEF n'est pas rectangle</b>.`])}
    <div class="trap">Calcule les deux nombres <b>séparément</b>. N'écris l'égalité qu'après avoir comparé.</div>
    <p class="note">S'il est rectangle, l'angle droit est en face du plus grand côté.</p>`,
  quick: { q: `Un triangle a pour côtés 6 cm, 8 cm et 10 cm. Est-il rectangle ?`, opts: [`Oui`, `Non`, `On ne peut pas savoir`], a: 0, why: `${sq(10)} = 100 et ${sq(6)} + ${sq(8)} = 36 + 64 = 100. L'égalité est vérifiée : d'après la réciproque, il est rectangle.` } }
);

KEEP['py-hyp'] = [`L'hypoténuse est le côté <b>en face de l'angle droit</b>.`, `C'est le <b>plus long</b> côté du triangle rectangle.`, `« Rectangle en A » : l'hypoténuse est le côté sans la lettre A.`];
KEEP['py-carre'] = [`${sq(5)} = 5 × 5 = 25, pas 5 × 2.`, `${rac(25)} = 5 : la racine carrée est le chemin inverse du carré.`, `Si le nombre n'est pas un carré connu : touche √, puis j'arrondis comme demandé.`];
KEEP['py-theo'] = [`Dans un triangle rectangle : (hypoténuse)² = somme des carrés des deux autres côtés.`, `ABC rectangle en A : ${sq('BC')} = ${sq('AB')} + ${sq('AC')}.`, `J'écris d'abord « Le triangle … est rectangle en … ».`];
KEEP['py-calc-hyp'] = [`Pour l'hypoténuse : j'<b>additionne</b> les carrés.`, `Je termine par la <b>racine carrée</b>.`, `Le résultat doit être le plus long côté.`];
KEEP['py-calc-cote'] = [`Pour un côté de l'angle droit : je <b>soustrais</b>.`, `Carré de l'hypoténuse moins carré du côté connu, puis racine carrée.`, `Le résultat doit être plus petit que l'hypoténuse.`];
KEEP['py-rect'] = [`Je compare le carré du plus grand côté et la somme des carrés des deux autres.`, `Égal : rectangle, d'après la <b>réciproque</b> du théorème de Pythagore.`, `Pas égal : l'égalité de Pythagore n'est pas vérifiée, donc le triangle n'est pas rectangle.`];

QH['py-hyp'] = `Où est l'angle droit ? L'hypoténuse est le seul côté qui ne le touche pas.`;
QH['py-carre'] = `Un carré, c'est le nombre multiplié par… quel nombre ?`;
QH['py-theo'] = `Trouve d'abord l'hypoténuse : c'est le côté sans la lettre de l'angle droit. Elle doit être seule d'un côté du signe =.`;
QH['py-calc-hyp'] = `Écris l'égalité, calcule les deux carrés, additionne. Est-ce fini à ce moment-là ?`;
QH['py-calc-cote'] = `Un côté de l'angle droit est plus court que l'hypoténuse. Quelle opération fait diminuer ?`;
QH['py-rect'] = `Calcule le carré du plus grand côté. Puis la somme des carrés des deux autres. Compare.`;

/* ---------- Méthodes ---------- */
const pyBase = RC.length;
RC.push(
{ title: `Calculer l'hypoténuse`, when: `Triangle rectangle. Je connais les deux côtés de l'angle droit. Je cherche le plus long côté.`,
  steps: [`<b>J'écris la phrase :</b> « Le triangle ABC est rectangle en A. D'après le théorème de Pythagore : »`, `<b>J'écris l'égalité</b> avec les lettres : ${sq('BC')} = ${sq('AB')} + ${sq('AC')}.`, `<b>Je remplace</b> par les nombres et j'<b>additionne</b> les carrés.`, `<b>Je prends la racine carrée</b>, et j'écris l'unité.`],
  fig: () => pyTri({ names: 'ABC', right: 'A', legs: [5, 12], hyp: true, len: { AB: '5 cm', AC: '12 cm', BC: '?' } }),
  ex: `ABC rectangle en A, AB = 5 cm, AC = 12 cm.<br>${sq('BC')} = ${sq('AB')} + ${sq('AC')}<br>${sq('BC')} = ${sq(5)} + ${sq(12)} = 25 + 144 = 169<br>BC = ${rac(169)} = <b>13 cm</b>`,
  trap: `S'arrêter à ${sq('BC')} = 169. Il reste la racine carrée.` },
{ title: `Calculer un côté de l'angle droit`, when: `Triangle rectangle. Je connais l'hypoténuse et un autre côté. Je cherche un des deux petits côtés.`,
  steps: [`<b>J'écris la même phrase et la même égalité</b> : hypoténuse seule à gauche. ${sq('BC')} = ${sq('AB')} + ${sq('AC')}.`, `<b>Je soustrais</b> : ${sq('AC')} = ${sq('BC')} − ${sq('AB')}.`, `<b>Je remplace</b> par les nombres et je calcule.`, `<b>Je prends la racine carrée</b>, et j'écris l'unité.`],
  fig: () => pyTri({ names: 'ABC', right: 'A', legs: [7, 24], hyp: true, o: 1, len: { AB: '7 cm', BC: '25 cm', AC: '?' } }),
  ex: `ABC rectangle en A, BC = 25 cm, AB = 7 cm.<br>${sq('BC')} = ${sq('AB')} + ${sq('AC')}<br>${sq('AC')} = ${sq('BC')} − ${sq('AB')} = ${sq(25)} − ${sq(7)} = 625 − 49 = 576<br>AC = ${rac(576)} = <b>24 cm</b>`,
  trap: `Additionner par habitude. Le résultat serait plus long que l'hypoténuse : impossible.` },
{ title: `Le triangle est-il rectangle ?`, when: `Je connais les trois côtés. On me demande si le triangle est rectangle, ou de le prouver.`,
  steps: [`<b>Je repère le plus grand côté</b> et je calcule son carré.`, `<b>Je calcule à part</b> la somme des carrés des deux autres côtés.`, `<b>Égal ?</b> « D'après la réciproque du théorème de Pythagore, le triangle est rectangle. » L'angle droit est en face du plus grand côté.`, `<b>Pas égal ?</b> « L'égalité de Pythagore n'est pas vérifiée, donc le triangle n'est pas rectangle. »`],
  ex: `Côtés : 20 cm, 21 cm et 29 cm.<br>${sq(29)} = 841<br>${sq(20)} + ${sq(21)} = 400 + 441 = 841<br>Égal : d'après la réciproque du théorème de Pythagore, <b>le triangle est rectangle</b>.`,
  trap: `Écrire l'égalité dès la première ligne. On ne sait pas encore si elle est vraie : on calcule les deux nombres séparément.` }
);
AIGUILLAGE.push(
    [`Un triangle rectangle, deux côtés de l'angle droit connus → on me demande le plus long côté`, pyBase],
    [`Un triangle rectangle, l'hypoténuse et un autre côté connus → on me demande un petit côté`, pyBase + 1],
    [`Une échelle, un câble, une rampe, la diagonale d'un rectangle → je cherche le triangle rectangle caché`, pyBase],
    [`Trois longueurs, et la question « est-il rectangle ? »`, pyBase + 2]
);
VERIFS.push(
    `Pythagore : l'<b>hypoténuse</b> est bien le plus long côté de mon triangle.`,
    `Pythagore : j'ai bien pris la <b>racine carrée</b> à la fin.`,
    `Pythagore : ma longueur a son <b>unité</b> (cm, m…).`
);

/* ---------- Exercices ---------- */
THEMES.PA = { nom: `Repérer l'hypoténuse, écrire l'égalité`, short: 'Hypoténuse', n: 'pythagore' };
THEMES.PB = { nom: `Carrés et racines carrées`, short: 'Carrés', n: 'pythagore' };
THEMES.PC = { nom: `Calculer l'hypoténuse`, short: 'Hypoténuse ?', n: 'pythagore' };
THEMES.PD = { nom: `Calculer un côté de l'angle droit`, short: 'Côté ?', n: 'pythagore' };
THEMES.PE = { nom: `Le triangle est-il rectangle ?`, short: 'Rectangle ?', n: 'pythagore' };

EX.push(
/* PA — repérer l'hypoténuse, écrire l'égalité */
{ id: 'PA1', t: 'PA', lvl: 1, type: 'qcm', q: `Quelle est l'hypoténuse du triangle ABC ?`, opts: [`[AB]`, `[AC]`, `[BC]`], a: 2,
  fig: () => pyTri({ names: 'ABC', right: 'A', legs: [3, 4], o: 1 }),
  hint: `Cherche le petit carré : c'est l'angle droit. L'hypoténuse est le côté en face, celui qui ne le touche pas.`,
  corr: [`L'angle droit est en A.`, `Le côté en face de A est [BC].`, `L'hypoténuse est <b>[BC]</b>.`] },
{ id: 'PA2', t: 'PA', lvl: 1, type: 'qcm', q: `Le triangle DEF est rectangle en E. Quelle est son hypoténuse ?`, opts: [`[DF]`, `[DE]`, `[EF]`], a: 0,
  hint: `Pas besoin de figure. Quelle lettre porte l'angle droit ? L'hypoténuse est le côté qui n'a pas cette lettre.`,
  corr: [`L'angle droit est en E.`, `Les côtés [DE] et [EF] touchent E : ce sont les côtés de l'angle droit.`, `L'hypoténuse est <b>[DF]</b>.`] },
{ id: 'PA3', t: 'PA', lvl: 1, type: 'qcm', q: `Quelle est l'hypoténuse du triangle MNP ?`, opts: [`[MN]`, `[NP]`, `[MP]`], a: 2,
  fig: () => pyTri({ names: 'MNP', right: 'N', legs: [3, 4], o: 4 }),
  hint: `Ne te fie pas à la position sur le dessin. Où est le petit carré ? Regarde le côté d'en face.`,
  corr: [`L'angle droit est en N, en haut.`, `Le côté en face de N est [MP], même s'il est « à plat ».`, `L'hypoténuse est <b>[MP]</b>.`] },
{ id: 'PA4', t: 'PA', lvl: 2, type: 'qcm', q: `Le triangle RST est rectangle en T. Quelle égalité donne le théorème de Pythagore ?`,
  opts: [`${sq('RS')} = ${sq('RT')} + ${sq('ST')}`, `${sq('RT')} = ${sq('RS')} + ${sq('ST')}`, `${sq('ST')} = ${sq('RS')} + ${sq('RT')}`, `RS = RT + ST`], a: 0,
  fig: () => pyTri({ names: 'RST', right: 'T', legs: [4, 3], o: 2 }),
  hint: `Trouve d'abord l'hypoténuse : le côté sans la lettre de l'angle droit. Elle est seule d'un côté du signe =. Et il y a des carrés partout.`,
  corr: [`L'angle droit est en T, donc l'hypoténuse est [RS].`, `Le carré de l'hypoténuse est égal à la somme des carrés des deux autres côtés.`, `<b>${sq('RS')} = ${sq('RT')} + ${sq('ST')}</b>`] },
{ id: 'PA5', t: 'PA', lvl: 2, type: 'multi', q: `Dans un triangle rectangle, l'hypoténuse… (coche tout ce qui est vrai)`,
  opts: [`est en face de l'angle droit`, `est le plus long côté`, `touche l'angle droit`, `est toujours dessinée en biais`], a: [0, 1],
  hint: `Relis la définition. Puis pense à un triangle que l'on fait tourner sur la feuille : qu'est-ce qui change, qu'est-ce qui ne change pas ?`,
  corr: [`L'hypoténuse est le côté <b>en face de l'angle droit</b>.`, `C'est toujours le <b>plus long</b> côté.`, `Elle ne touche pas l'angle droit : ce sont les deux autres côtés qui le forment.`, `Sa position sur le dessin dépend de la façon dont le triangle est tourné.`] },
{ id: 'PA6', t: 'PA', lvl: 2, type: 'order', q: `ABC est rectangle en A, AB = 5 cm et AC = 12 cm. Remets la rédaction dans l'ordre.`,
  items: [`Le triangle ABC est rectangle en A.`, `D'après le théorème de Pythagore :`, `${sq('BC')} = ${sq('AB')} + ${sq('AC')}`, `${sq('BC')} = ${sq(5)} + ${sq(12)} = 25 + 144 = 169`, `BC = ${rac(169)} = 13 cm`],
  fig: () => pyTri({ names: 'ABC', right: 'A', legs: [5, 12], len: { AB: '5 cm', AC: '12 cm', BC: '?' } }),
  hint: `On dit d'abord pourquoi on a le droit d'utiliser le théorème. Puis les lettres, puis les nombres, et la racine carrée en dernier.`,
  corr: [`D'abord la condition : le triangle est rectangle.`, `Puis le nom du théorème et l'égalité avec les lettres.`, `Ensuite les nombres, et la racine carrée à la fin : <b>BC = 13 cm</b>.`] },
{ id: 'PA7', t: 'PA', lvl: 2, type: 'qcm', q: `Une rampe de skatepark vue de côté. Quel côté du triangle est l'hypoténuse ?`, opts: [`La hauteur`, `La longueur au sol`, `La pente`], a: 2,
  fig: () => pyRampe({ v: 'hauteur', h: 'sol', d: 'pente' }),
  hint: `Entre quels côtés se trouve l'angle droit ? L'hypoténuse est le troisième.`,
  corr: [`La hauteur est verticale, le sol est horizontal : l'angle droit est entre les deux.`, `Le côté en face de l'angle droit est <b>la pente</b>.`] },
{ id: 'PA8', t: 'PA', lvl: 3, type: 'qcm', q: `Dans le triangle rectangle IJK, on a écrit : ${sq('IJ')} = ${sq('IK')} + ${sq('JK')}. En quel sommet est l'angle droit ?`, opts: [`En I`, `En J`, `En K`], a: 2, fixed: true,
  hint: `Dans l'égalité, quel côté est seul ? C'est l'hypoténuse. L'angle droit est en face : au sommet qui n'est pas dans son nom.`,
  corr: [`Le côté seul à gauche est [IJ] : c'est l'hypoténuse.`, `L'angle droit est en face de [IJ], au sommet qui n'est ni I ni J.`, `Le triangle est rectangle <b>en K</b>.`] },

/* PB — carrés et racines carrées */
{ id: 'PB1', t: 'PB', lvl: 1, type: 'num', q: `Calcule ${sq(9)}.`, a: 81, tol: 0,
  diag: ({ v }) => v === 18 ? `Tu as calculé 9 × 2. Le carré, c'est le nombre multiplié par lui-même.` : '',
  hint: `Le carré d'un nombre, c'est ce nombre multiplié par lui-même.`,
  corr: [`${sq(9)} = 9 × 9`, `${sq(9)} = <b>81</b>`] },
{ id: 'PB2', t: 'PB', lvl: 1, type: 'num', q: `Calcule ${rac(144)}, sans calculatrice.`, a: 12, tol: 0,
  diag: ({ v }) => v === 72 ? `Tu as divisé par 2. La racine carrée, c'est le nombre qui, multiplié par lui-même, donne 144.` : '',
  hint: `Quel nombre, multiplié par lui-même, donne 144 ? Pense au tableau des carrés.`,
  corr: [`Je cherche le nombre dont le carré est 144.`, `${sq(12)} = 12 × 12 = 144`, `${rac(144)} = <b>12</b>`] },
{ id: 'PB3', t: 'PB', lvl: 1, type: 'qcm', q: `Quel calcul donne ${sq(6)} ?`, opts: [`6 × 2`, `6 × 6`, `6 + 6`, `6 + 2`], a: 1,
  hint: `Le petit 2 ne veut pas dire « fois 2 ». Il dit combien de fois le nombre est écrit dans la multiplication.`,
  corr: [`${sq(6)} se lit « 6 au carré ».`, `${sq(6)} = <b>6 × 6</b> = 36`] },
{ id: 'PB4', t: 'PB', lvl: 2, type: 'num', q: `${sq('AB')} = 196 et AB est une longueur en cm. Combien mesure AB ?`, a: 14, tol: 0, unit: 'cm',
  diag: ({ v }) => v === 98 ? `Tu as divisé par 2. Pour passer de ${sq('AB')} à AB, on prend la racine carrée.` : '',
  hint: `Tu connais le carré de la longueur. Quelle touche fait le chemin inverse du carré ?`,
  corr: [`${sq('AB')} = 196`, `AB = ${rac(196)}`, `AB = <b>14 cm</b>, car ${sq(14)} = 196.`] },
{ id: 'PB5', t: 'PB', lvl: 2, type: 'num', q: `Calcule ${sq(8)} + ${sq(15)}.`, a: 289, tol: 0,
  diag: ({ v }) => v === 23 ? `Tu as ajouté 8 et 15. Calcule d'abord chaque carré.` : v === 46 ? `Tu as multiplié par 2. ${sq(8)} = 8 × 8.` : v === 529 ? `Tu as calculé ${sq(23)}. Les carrés se calculent d'abord, un par un.` : '',
  hint: `Calcule chaque carré d'abord, puis additionne. Ce n'est pas le carré de la somme.`,
  corr: [`${sq(8)} = 8 × 8 = 64`, `${sq(15)} = 15 × 15 = 225`, `${sq(8)} + ${sq(15)} = 64 + 225 = <b>289</b>`] },
{ id: 'PB6', t: 'PB', lvl: 2, type: 'num', q: `Avec la calculatrice : ${rac(74)}. Arrondis au dixième.`, a: 8.6, tol: 0.05,
  diag: ({ v }) => v === 37 ? `Tu as divisé par 2. Utilise la touche √.` : '',
  hint: `Touche √, tape 74, puis =. Pour arrondir au dixième, regarde le chiffre des centièmes.`,
  corr: [`La calculatrice affiche 8,602…`, `Le chiffre des centièmes est 0 : je garde 8,6.`, `${rac(74)} ≈ <b>8,6</b>`] },
{ id: 'PB7', t: 'PB', lvl: 2, type: 'qcm', q: `Sans calculatrice : ${rac(50)} est compris entre…`, opts: [`5 et 6`, `7 et 8`, `24 et 26`], a: 1, fixed: true,
  hint: `Dans le tableau des carrés, quels sont les deux carrés qui encadrent 50 ?`,
  corr: [`${sq(7)} = 49 et ${sq(8)} = 64.`, `50 est entre 49 et 64.`, `Donc ${rac(50)} est <b>entre 7 et 8</b>.`] },
{ id: 'PB8', t: 'PB', lvl: 3, type: 'num', q: `Calcule ${sq('1,5')}.`, a: 2.25, tol: 0.001,
  diag: ({ v }) => Math.abs(v - 3) < 0.001 ? `Tu as calculé 1,5 × 2. Le carré, c'est 1,5 × 1,5.` : '',
  hint: `Même règle avec un nombre à virgule : le nombre multiplié par lui-même. Tu peux poser 15 × 15 puis placer la virgule.`,
  corr: [`${sq('1,5')} = 1,5 × 1,5`, `15 × 15 = 225, et il y a deux chiffres après la virgule en tout.`, `${sq('1,5')} = <b>2,25</b>`] },

/* PC — calculer l'hypoténuse */
{ id: 'PC1', t: 'PC', lvl: 1, type: 'num', q: `ABC est rectangle en A. AB = 3 cm et AC = 4 cm. Calcule BC.`, a: 5, tol: 0.001, unit: 'cm',
  fig: () => pyTri({ names: 'ABC', right: 'A', legs: [3, 4], len: { AB: '3 cm', AC: '4 cm', BC: '?' } }), diag: pyDiagH(3, 4),
  hint: `Repère l'hypoténuse. Écris l'égalité de Pythagore avec les lettres avant de mettre les nombres.`,
  corr: pyRedH('ABC', 'A', 3, 4, 'cm') },
{ id: 'PC2', t: 'PC', lvl: 1, type: 'num', q: `DEF est rectangle en D. DE = 6 cm et DF = 8 cm. Calcule EF.`, a: 10, tol: 0.001, unit: 'cm',
  fig: () => pyTri({ names: 'DEF', right: 'D', legs: [6, 8], o: 1, len: { DE: '6 cm', DF: '8 cm', EF: '?' } }), diag: pyDiagH(6, 8),
  hint: `Tu cherches le plus grand côté ou un des deux petits ? Écris l'égalité d'abord.`,
  corr: pyRedH('DEF', 'D', 6, 8, 'cm') },
{ id: 'PC3', t: 'PC', lvl: 2, type: 'num', q: `Un câble est tendu entre le haut d'un poteau vertical de 8 m et le sol, à 15 m du pied du poteau. Quelle est la longueur du câble ?`, a: 17, tol: 0.001, unit: 'm',
  fig: () => pyMur({ kind: 'cable', v: '8 m', h: '15 m', d: '?' }), diag: pyDiagH(8, 15),
  hint: `Le poteau est vertical, le sol horizontal : où est l'angle droit ? Le câble est-il en face ?`,
  corr: pyRedMotsH(`Le poteau est vertical et le sol horizontal : le triangle est rectangle. Le câble est l'hypoténuse.`, 'câble', 'poteau', 'sol', 8, 15, 'm') },
{ id: 'PC4', t: 'PC', lvl: 2, type: 'num', q: `Sur la carte d'un jeu, le coffre est 12 cases plus à droite et 5 cases plus haut que le joueur. Quelle est la distance en ligne droite, en cases ?`, a: 13, tol: 0.001, unit: 'cases',
  fig: () => pyGrille({ dx: 12, dy: 5, a: 'J', b: 'C' }), diag: pyDiagH(12, 5),
  hint: `Le déplacement vers la droite et le déplacement vers le haut forment un angle droit. La ligne droite est le troisième côté : lequel ?`,
  corr: [`Les deux déplacements sont perpendiculaires : le triangle est rectangle. La ligne droite [JC] est l'hypoténuse.`, `D'après le théorème de Pythagore : ${sq('JC')} = ${sq(12)} + ${sq(5)}`, `${sq('JC')} = 144 + 25 = 169`, `JC = ${rac(169)} = <b>13 cases</b>`] },
{ id: 'PC5', t: 'PC', lvl: 2, type: 'num', q: `MNP est rectangle en N. MN = 1,5 cm et NP = 2 cm. Calcule MP.`, a: 2.5, tol: 0.001, unit: 'cm',
  fig: () => pyTri({ names: 'MNP', right: 'N', legs: [1.5, 2], o: 4, len: { MN: '1,5 cm', NP: '2 cm', MP: '?' } }), diag: pyDiagH(1.5, 2),
  hint: `Sur cette figure, l'hypoténuse est en bas. Écris l'égalité, puis calcule 1,5 × 1,5 avec soin.`,
  corr: pyRedH('MNP', 'N', 1.5, 2, 'cm') },
{ id: 'PC6', t: 'PC', lvl: 2, type: 'num', q: `Un écran rectangulaire mesure 80 cm de large et 60 cm de haut. Combien mesure sa diagonale ?`, a: 100, tol: 0.001, unit: 'cm',
  fig: () => pyRect({ w: '80 cm', h: '60 cm', d: '?', ratio: 80 / 60 }), diag: pyDiagH(80, 60),
  hint: `La diagonale coupe le rectangle en deux triangles rectangles. Dans l'un d'eux, quel rôle joue la diagonale ?`,
  corr: pyRedMotsH(`Dans un rectangle, les angles sont droits : la diagonale est l'hypoténuse d'un triangle rectangle.`, 'diagonale', 'largeur', 'hauteur', 80, 60, 'cm') },
{ id: 'PC7', t: 'PC', lvl: 3, type: 'num', q: `IJK est rectangle en K. KI = 3 cm et KJ = 5 cm. Calcule IJ. Arrondis au dixième.`, a: 5.8, tol: 0.05, unit: 'cm',
  fig: () => pyTri({ names: 'IJK', right: 'K', legs: [3, 5], o: 3, len: { IK: '3 cm', JK: '5 cm', IJ: '?' } }), diag: pyDiagH(3, 5),
  hint: `Même méthode. Ici le résultat ne tombe pas juste : utilise la touche √ puis regarde le chiffre des centièmes.`,
  corr: pyRedH('IJK', 'K', 3, 5, 'cm') },
{ id: 'PC8', t: 'PC', lvl: 3, type: 'num', q: `Un terrain de basket mesure 28 m sur 15 m. Une passe part d'un coin et arrive au coin opposé. Quelle distance parcourt le ballon ? Arrondis au dixième.`, a: 31.8, tol: 0.05, unit: 'm',
  fig: () => pyRect({ w: '28 m', h: '15 m', d: '?', ratio: 28 / 15 }), diag: pyDiagH(28, 15),
  hint: `Le terrain est un rectangle. La passe suit sa diagonale. Quel triangle rectangle vois-tu, et quel côté cherches-tu ?`,
  corr: pyRedMotsH(`Le terrain est un rectangle : la diagonale est l'hypoténuse d'un triangle rectangle.`, 'diagonale', 'longueur', 'largeur', 28, 15, 'm') },

/* PD — calculer un côté de l'angle droit */
{ id: 'PD1', t: 'PD', lvl: 1, type: 'num', q: `ABC est rectangle en A. BC = 10 cm et AB = 6 cm. Calcule AC.`, a: 8, tol: 0.001, unit: 'cm',
  fig: () => pyTri({ names: 'ABC', right: 'A', legs: [6, 8], hyp: true, len: { BC: '10 cm', AB: '6 cm', AC: '?' } }), diag: pyDiagC(10, 6),
  hint: `L'hypoténuse est déjà connue. Tu cherches donc un des deux petits côtés : que fais-tu avec les carrés ?`,
  corr: pyRedC('ABC', 'A', 'B', 10, 6, 'cm') },
{ id: 'PD2', t: 'PD', lvl: 1, type: 'num', q: `EFG est rectangle en F. EG = 13 cm et FG = 12 cm. Calcule EF.`, a: 5, tol: 0.001, unit: 'cm',
  fig: () => pyTri({ names: 'EFG', right: 'F', legs: [5, 12], o: 1, len: { EG: '13 cm', FG: '12 cm', EF: '?' } }), diag: pyDiagC(13, 12),
  hint: `Repère l'hypoténuse : le côté sans la lettre F. Est-ce le côté que tu cherches ?`,
  corr: pyRedC('EFG', 'F', 'G', 13, 12, 'cm') },
{ id: 'PD3', t: 'PD', lvl: 1, type: 'qcm', q: `UVW est rectangle en U. On connaît VW et UV. Quelle égalité permet de calculer UW ?`,
  opts: [`${sq('UW')} = ${sq('VW')} − ${sq('UV')}`, `${sq('UW')} = ${sq('VW')} + ${sq('UV')}`, `UW = VW − UV`], a: 0,
  fig: () => pyTri({ names: 'UVW', right: 'U', legs: [3, 4], o: 2, hyp: true, len: { UW: '?' } }),
  hint: `Quel côté est l'hypoténuse ? Tu cherches le plus grand côté ou un des deux petits ?`,
  corr: [`L'angle droit est en U : l'hypoténuse est [VW].`, `${sq('VW')} = ${sq('UV')} + ${sq('UW')}`, `[UW] est un côté de l'angle droit, donc on soustrait : <b>${sq('UW')} = ${sq('VW')} − ${sq('UV')}</b>`] },
{ id: 'PD4', t: 'PD', lvl: 2, type: 'num', q: `Une échelle de 2,5 m est appuyée contre un mur vertical. Son pied est à 1,5 m du mur. À quelle hauteur touche-t-elle le mur ?`, a: 2, tol: 0.001, unit: 'm',
  fig: () => pyMur({ kind: 'echelle', v: '?', h: '1,5 m', d: '2,5 m' }), diag: pyDiagC(2.5, 1.5),
  hint: `Le mur et le sol forment l'angle droit. L'échelle est donc quel côté ? Et la hauteur ?`,
  corr: pyRedMotsC(`Le mur est vertical et le sol horizontal : le triangle est rectangle. L'échelle est l'hypoténuse.`, 'échelle', 'sol', 'hauteur', 2.5, 1.5, 'm') },
{ id: 'PD5', t: 'PD', lvl: 2, type: 'num', q: `Une rampe de trottinette a une pente de 2,9 m. Elle occupe 2,1 m au sol. Quelle est sa hauteur ?`, a: 2, tol: 0.001, unit: 'm',
  fig: () => pyRampe({ v: '?', h: '2,1 m', d: '2,9 m' }), diag: pyDiagC(2.9, 2.1),
  hint: `La pente est en face de l'angle droit. La hauteur est-elle le plus grand côté ou un des deux petits ?`,
  corr: pyRedMotsC(`La hauteur est verticale et le sol horizontal : le triangle est rectangle. La pente est l'hypoténuse.`, 'pente', 'sol', 'hauteur', 2.9, 2.1, 'm') },
{ id: 'PD6', t: 'PD', lvl: 2, type: 'num', q: `ABCD est un rectangle. Sa diagonale [AC] mesure 20 cm et AB = 16 cm. Calcule BC.`, a: 12, tol: 0.001, unit: 'cm',
  fig: () => pyRect({ names: 'ABCD', w: '16 cm', h: '?', d: '20 cm', ratio: 16 / 12 }), diag: pyDiagC(20, 16),
  hint: `Regarde le triangle ABC. Où est son angle droit ? La diagonale est donc quel côté ?`,
  corr: pyRedC('ABC', 'B', 'A', 20, 16, 'cm').map((l, i) => i === 0 ? `ABCD est un rectangle, donc le triangle ABC est rectangle en B.` : l) },
{ id: 'PD7', t: 'PD', lvl: 2, type: 'order', q: `RST est rectangle en R, ST = 26 cm et RS = 10 cm. Remets dans l'ordre la rédaction du calcul de RT.`,
  items: [`Le triangle RST est rectangle en R.`, `D'après le théorème de Pythagore : ${sq('ST')} = ${sq('RS')} + ${sq('RT')}`, `${sq('RT')} = ${sq('ST')} − ${sq('RS')}`, `${sq('RT')} = ${sq(26)} − ${sq(10)} = 676 − 100 = 576`, `RT = ${rac(576)} = 24 cm`],
  fig: () => pyTri({ names: 'RST', right: 'R', legs: [10, 24], o: 5, len: { ST: '26 cm', RS: '10 cm', RT: '?' } }),
  hint: `L'égalité de Pythagore s'écrit toujours avec l'hypoténuse seule. Ensuite seulement on isole le côté cherché.`,
  corr: [`D'abord la condition et l'égalité, avec l'hypoténuse [ST] seule à gauche.`, `Puis on isole ${sq('RT')} : on soustrait.`, `Enfin les nombres et la racine carrée : <b>RT = 24 cm</b>.`] },
{ id: 'PD8', t: 'PD', lvl: 3, type: 'num', q: `LMN est rectangle en L. MN = 9 cm et LM = 5 cm. Calcule LN. Arrondis au dixième.`, a: 7.5, tol: 0.05, unit: 'cm',
  fig: () => pyTri({ names: 'LMN', right: 'L', legs: [5, 7.5], o: 2, len: { MN: '9 cm', LM: '5 cm', LN: '?' } }), diag: pyDiagC(9, 5),
  hint: `Quel côté est l'hypoténuse ? Écris l'égalité, isole le côté cherché, puis utilise la touche √.`,
  corr: pyRedC('LMN', 'L', 'M', 9, 5, 'cm') },

/* PE — le triangle est-il rectangle ? */
{ id: 'PE1', t: 'PE', lvl: 1, type: 'qcm', q: `Pour savoir si un triangle de côtés 5 cm, 12 cm et 13 cm est rectangle, quel carré calcule-t-on à part ?`, opts: [`${sq(5)}`, `${sq(12)}`, `${sq(13)}`], a: 2, fixed: true,
  hint: `Si le triangle est rectangle, un des côtés est l'hypoténuse. Lequel peut jouer ce rôle ?`,
  corr: [`L'hypoténuse est toujours le plus long côté.`, `On calcule donc à part le carré du plus grand côté : <b>${sq(13)}</b>.`, `On le compare ensuite à ${sq(5)} + ${sq(12)}.`] },
{ id: 'PE2', t: 'PE', lvl: 1, type: 'qcm', q: `Un triangle a pour côtés 12 cm, 16 cm et 20 cm. Est-il rectangle ?`, opts: [`Oui`, `Non`], a: 0, fixed: true,
  fig: () => pyTri({ names: 'ABC', right: 'A', legs: [12, 16], mark: false, o: 2, len: { AB: '12 cm', AC: '16 cm', BC: '20 cm' } }),
  hint: `Calcule le carré du plus grand côté. Puis, à part, la somme des carrés des deux autres. Compare.`,
  corr: [`Le plus grand côté mesure 20 cm : ${sq(20)} = 400`, `${sq(12)} + ${sq(16)} = 144 + 256 = 400`, `L'égalité de Pythagore est vérifiée.`, `D'après la réciproque du théorème de Pythagore, <b>le triangle est rectangle</b>.`] },
{ id: 'PE3', t: 'PE', lvl: 1, type: 'qcm', q: `Un triangle a pour côtés 4 cm, 5 cm et 6 cm. Est-il rectangle ?`, opts: [`Oui`, `Non`], a: 1, fixed: true,
  hint: `Calcule le carré du plus grand côté. Puis, à part, la somme des carrés des deux autres. Compare.`,
  corr: [`Le plus grand côté mesure 6 cm : ${sq(6)} = 36`, `${sq(4)} + ${sq(5)} = 16 + 25 = 41`, `36 ≠ 41 : l'égalité de Pythagore n'est pas vérifiée.`, `Donc <b>le triangle n'est pas rectangle</b>.`] },
{ id: 'PE4', t: 'PE', lvl: 2, type: 'qcm', q: `ABC : AB = 10 cm, AC = 24 cm et BC = 26 cm. On a calculé ${sq('BC')} = 676 et ${sq('AB')} + ${sq('AC')} = 676. Que peut-on conclure ?`,
  opts: [`ABC est rectangle en A`, `ABC est rectangle en B`, `ABC est rectangle en C`, `ABC n'est pas rectangle`], a: 0, fixed: true,
  hint: `Les deux nombres sont-ils égaux ? Si oui, l'angle droit est en face du plus grand côté.`,
  corr: [`${sq('BC')} = ${sq('AB')} + ${sq('AC')} : l'égalité de Pythagore est vérifiée.`, `D'après la réciproque du théorème de Pythagore, le triangle est rectangle.`, `L'hypoténuse est [BC], donc l'angle droit est en face : <b>ABC est rectangle en A</b>.`] },
{ id: 'PE5', t: 'PE', lvl: 2, type: 'qcm', q: `Un triangle a pour côtés 6 cm, 9 cm et 11 cm. Quelle est la bonne conclusion ?`,
  opts: [`Il est rectangle, car ${sq(11)} = ${sq(6)} + ${sq(9)}`, `Il n'est pas rectangle, car ${sq(11)} ≠ ${sq(6)} + ${sq(9)}`, `Il n'est pas rectangle, car 6 + 9 ≠ 11`], a: 1,
  hint: `Compare des carrés, pas des longueurs. Calcule ${sq(11)}, puis ${sq(6)} + ${sq(9)} à part.`,
  corr: [`Le plus grand côté mesure 11 cm : ${sq(11)} = 121`, `${sq(6)} + ${sq(9)} = 36 + 81 = 117`, `121 ≠ 117 : l'égalité de Pythagore n'est pas vérifiée.`, `Donc <b>le triangle n'est pas rectangle</b>.`] },
{ id: 'PE6', t: 'PE', lvl: 2, type: 'order', q: `ABC : AB = 8 cm, AC = 15 cm et BC = 17 cm. Remets dans l'ordre la rédaction qui prouve que ABC est rectangle.`,
  items: [`Le plus grand côté est [BC].`, `${sq('BC')} = ${sq(17)} = 289`, `${sq('AB')} + ${sq('AC')} = ${sq(8)} + ${sq(15)} = 64 + 225 = 289`, `${sq('BC')} = ${sq('AB')} + ${sq('AC')} : l'égalité de Pythagore est vérifiée.`, `D'après la réciproque du théorème de Pythagore, ABC est rectangle en A.`],
  fig: () => pyTri({ names: 'ABC', right: 'A', legs: [8, 15], mark: false, o: 3, len: { AB: '8 cm', AC: '15 cm', BC: '17 cm' } }),
  hint: `On ne peut conclure qu'à la fin. Avant, on calcule deux nombres séparément : lequel en premier ?`,
  corr: [`On repère le plus grand côté et on calcule son carré.`, `On calcule à part la somme des carrés des deux autres.`, `On constate l'égalité, puis on conclut avec la réciproque : <b>ABC est rectangle en A</b>.`] },
{ id: 'PE7', t: 'PE', lvl: 2, type: 'qcm', q: `Un triangle a pour côtés 2,4 cm, 3,2 cm et 4 cm. Est-il rectangle ?`, opts: [`Oui`, `Non`], a: 0, fixed: true,
  hint: `Même méthode avec des nombres à virgule. Le plus grand côté d'un côté, les deux autres de l'autre.`,
  corr: [`Le plus grand côté mesure 4 cm : ${sq(4)} = 16`, `${sq('2,4')} + ${sq('3,2')} = 5,76 + 10,24 = 16`, `L'égalité de Pythagore est vérifiée.`, `D'après la réciproque du théorème de Pythagore, <b>le triangle est rectangle</b>.`] },
{ id: 'PE8', t: 'PE', lvl: 3, type: 'qcm', q: `Pour tracer un terrain, on veut un coin bien droit. On mesure 3 m sur un bord, 4 m sur l'autre bord, et 5,1 m entre les deux marques. Le coin est-il un angle droit ?`, opts: [`Oui`, `Non`], a: 1, fixed: true,
  hint: `Les trois mesures forment un triangle. Compare le carré de la plus grande et la somme des carrés des deux autres. Sois précis.`,
  corr: [`La plus grande longueur est 5,1 m : ${sq('5,1')} = 26,01`, `${sq(3)} + ${sq(4)} = 9 + 16 = 25`, `26,01 ≠ 25 : l'égalité de Pythagore n'est pas vérifiée.`, `Donc le triangle n'est pas rectangle : <b>le coin n'est pas un angle droit</b>.`] }
);

BLANC.push('PA4', 'PB4', 'PC3', 'PD4', 'PE5');

/* ---------- Cartes mémoire ---------- */
FL.push(
[`L'hypoténuse, c'est quoi ?`, `Le côté <b>en face de l'angle droit</b>. C'est le plus long côté du triangle rectangle.`],
[`ABC est rectangle en A. L'égalité de Pythagore ?`, `<b>${sq('BC')} = ${sq('AB')} + ${sq('AC')}</b><br>L'hypoténuse est seule d'un côté.`],
[`${sq(5)} = ?`, `5 × 5 = <b>25</b>. Pas 5 × 2.`],
[`${rac(81)} = ?`, `<b>9</b>, car ${sq(9)} = 81.`],
[`Je cherche l'hypoténuse. J'additionne ou je soustrais ?`, `J'<b>additionne</b> les carrés des deux autres côtés. Puis racine carrée.`],
[`Je cherche un côté de l'angle droit. J'additionne ou je soustrais ?`, `Je <b>soustrais</b> : carré de l'hypoténuse moins carré du côté connu. Puis racine carrée.`],
[`Quelle est la dernière étape du calcul d'une longueur ?`, `La <b>racine carrée</b>, puis l'unité.`],
[`Trois longueurs. Comment savoir si le triangle est rectangle ?`, `Je compare le carré du <b>plus grand</b> côté et la somme des carrés des deux autres. Égal : rectangle (réciproque). Pas égal : pas rectangle.`]
);

/* ---------- Fiche récap ---------- */
FICHE.push(
[`Pythagore : le vocabulaire`, `<b>Triangle rectangle</b> : un angle droit.<br><b>Hypoténuse</b> : le côté en face de l'angle droit, le plus long.<br><b>Côtés de l'angle droit</b> : les deux autres.<br>${sq(5)} = 5 × 5 = 25 &nbsp;·&nbsp; ${rac(25)} = 5`],
[`Pythagore : l'égalité et les deux calculs`, `ABC rectangle en A : <b>${sq('BC')} = ${sq('AB')} + ${sq('AC')}</b><br><b>Hypoténuse :</b> j'additionne les carrés, puis racine carrée.<br><b>Côté de l'angle droit :</b> je soustrais, ${sq('AC')} = ${sq('BC')} − ${sq('AB')}, puis racine carrée.<br><b>Rectangle ou non ?</b> Je compare le carré du plus grand côté et la somme des carrés des deux autres.`],
[`Pythagore : la rédaction à recopier`, `<div class="py-redac">Le triangle ABC est rectangle en A.<br>D'après le théorème de Pythagore :<br>${sq('BC')} = ${sq('AB')} + ${sq('AC')}<br>${sq('BC')} = … + … = …<br>BC = ${rac('…')} = … cm</div>`]
);

/* ---------- Séries sans fin ---------- */
const PY_TRIPLETS = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [7, 24, 25], [9, 12, 15], [20, 21, 29], [9, 40, 41], [12, 16, 20]];
const PY_NAMES = ['ABC', 'DEF', 'EFG', 'IJK', 'KLM', 'LMN', 'MNP', 'RST', 'UVW', 'XYZ'];
DRILLS.push({ k: 'pythagore', n: 'pythagore', title: 'Séries sans fin', d: 'Une longueur à calculer, autant de fois que tu veux',
  intro: `<p>Un triangle rectangle, deux longueurs connues. <b>Repère l'hypoténuse</b>, écris l'égalité sur ta feuille, puis calcule.</p>`,
  gen: rnd => {
    const tr = rPick(rnd, PY_TRIPLETS);
    let k = rPick(rnd, [1, 1, 1, 2, 3, 0.1]);
    if (k > 1 && tr[2] * k > 90) k = 1;
    const m = v => k === 0.1 ? v / 10 : v * k;
    const swap = rnd() < 0.5;
    const a = m(swap ? tr[1] : tr[0]), b = m(swap ? tr[0] : tr[1]), c = m(tr[2]);
    const T = rPick(rnd, PY_NAMES), R = rPick(rnd, T.split(''));
    const [P, Q] = T.split('').filter(x => x !== R);
    const u = k === 0.1 ? 'm' : rPick(rnd, ['cm', 'cm', 'm', 'mm']);
    const o = rInt(rnd, 0, 5), kind = rnd() < 0.5 ? 'hyp' : 'cote';
    const h = pySeg(T, P, Q), c1 = pySeg(T, R, P), c2 = pySeg(T, R, Q);
    const L = x => `${nb(x)} ${u}`;
    if (kind === 'hyp') return {
        t: 'PC', lvl: 2, type: 'num', meta: { kind, given: [a, b] },
        q: `${T} est rectangle en ${R}. ${c1} = ${L(a)} et ${c2} = ${L(b)}. Calcule ${h}.`,
        fig: () => pyTri({ names: T, right: R, legs: [a, b], o, len: { [c1]: L(a), [c2]: L(b), [h]: '?' } }),
        a: c, tol: 0.001, unit: u, diag: pyDiagH(a, b),
        hint: `Repère l'angle droit, puis le côté en face. Le côté cherché est-il le plus grand ? Écris l'égalité avant de calculer.`,
        corr: pyRedH(T, R, a, b, u)
    };
    return {
        t: 'PD', lvl: 2, type: 'num', meta: { kind, given: [c, a] },
        q: `${T} est rectangle en ${R}. ${h} = ${L(c)} et ${c1} = ${L(a)}. Calcule ${c2}.`,
        fig: () => pyTri({ names: T, right: R, legs: [a, b], o, len: { [h]: L(c), [c1]: L(a), [c2]: '?' } }),
        a: b, tol: 0.001, unit: u, diag: pyDiagC(c, a),
        hint: `Quel côté est l'hypoténuse ? Tu cherches le plus grand côté ou un des deux petits ? Écris l'égalité avant de calculer.`,
        corr: pyRedC(T, R, P, c, a, u)
    };
  }
});
