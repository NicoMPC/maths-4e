'use strict';
/* Suivi par le professeur. Rien n'est envoyé tant que le site n'a pas été ouvert une fois avec un lien
   personnel (…/?k=code). Le code reste dans ce navigateur ; ensuite, un court résumé de la progression
   (pourcentages, exercices à retravailler) part vers le tableau de suivi du professeur. Aucun nom n'est envoyé. */
(function () {
    const ENDPOINT = '';
    const CK = 'suivi-code';
    let code = null, timer = null, last = '';
    try {
        const p = new URLSearchParams(location.search).get('k');
        if (p && /^[a-z0-9]{6,16}$/.test(p)) { localStorage.setItem(CK, p); history.replaceState(null, '', location.pathname + location.hash); }
        code = localStorage.getItem(CK);
    } catch (e) { }
    function send(site, get) {
        let body;
        try { body = JSON.stringify(Object.assign({ k: code, site }, get())); } catch (e) { return; }
        if (body === last) return; last = body;
        try { fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', keepalive: true, headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body }).catch(() => { }); } catch (e) { }
    }
    let wait = null;
    const flush = () => { clearTimeout(timer); if (wait) { const w = wait; wait = null; send(w[0], w[1]); } };
    /* get : fonction qui renvoie le résumé au moment de l'envoi (les appels rapprochés sont regroupés) */
    window.Suivi = { push(site, get) { if (!code || !ENDPOINT) return; wait = [site, get]; clearTimeout(timer); timer = setTimeout(flush, 3000); } };
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });
})();
