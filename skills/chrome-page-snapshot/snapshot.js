// Paste this whole file as the `text` of mcp__claude-in-chrome__javascript_tool.
// Starts a background job (tool calls time out at 45s). Poll window.__snap.
// Result: window.__snap = { progress, error, html, meta }.
window.__snap = { progress: 'start', error: null, html: null, meta: null };
(async () => {
  const S = window.__snap;
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const abs = (v, base = location.href) => { try { return new URL(v, base).href; } catch { return v; } };
  const absCss = (css, base) => css.replace(/url\(\s*(['"]?)(?!data:|#)([^'")]*)\1\s*\)/gi, (m, q, u) => `url("${abs(u, base)}")`);

  // 1. scroll the page once so lazy images and sections render
  S.progress = 'scroll';
  for (let y = 0; y < document.body.scrollHeight; y += innerHeight * 0.8) { scrollTo(0, y); await wait(150); }
  scrollTo(0, 0); await wait(300);

  // 2. find tab groups: >=2 sibling tab-like buttons
  const tabSel = '[role="tab"], button[data-active], button[aria-selected], [role="tablist"] > button';
  const byParent = new Map();
  for (const b of document.querySelectorAll(tabSel)) {
    if (b.matches('a[href]:not([href^="#"])')) continue; // clicking would navigate away
    if (!byParent.has(b.parentElement)) byParent.set(b.parentElement, []);
    byParent.get(b.parentElement).push(b);
  }
  const groups = [...byParent.entries()].filter(([, bs]) => bs.length > 1);

  // panel region = the nearest ancestor's children that change when a tab is clicked
  const panelNodes = (list) => {
    let host = list;
    while (host.parentElement && host.parentElement !== document.body) {
      const p = host.parentElement;
      const others = [...p.children].filter(c => c !== host && !c.contains(list));
      if (others.length) return { host: p, nodes: () => [...p.children].filter(c => !c.contains(list)) };
      host = p;
    }
    return null;
  };

  const captured = [];
  const warnings = [];
  for (const [gi, [list, btns]] of groups.entries()) {
    const region = panelNodes(list);
    if (!region) { warnings.push(`group ${gi}: no panel region found`); continue; }
    const panels = [];
    for (const [bi, b] of btns.entries()) {
      S.progress = `tabs g${gi} t${bi}`;
      const before = region.nodes().map(n => n.outerHTML).join('');
      b.click();
      let html = before;
      for (let t = 0; t < 20 && bi > 0; t++) { await wait(150); html = region.nodes().map(n => n.outerHTML).join(''); if (html !== before) break; }
      await wait(400);
      region.nodes().forEach(n => n.querySelectorAll('img[loading="lazy"]').forEach(i => i.loading = 'eager'));
      panels.push(region.nodes().map(n => n.outerHTML));
    }
    btns[0].click(); await wait(400);
    const uniq = new Set(panels.map(p => p.join('')));
    if (uniq.size < panels.length) warnings.push(`group ${gi}: ${panels.length - uniq.size} duplicate panel(s) — tab hidden/throttled? re-run with tab visible`);
    if (uniq.size === 1) { warnings.push(`group ${gi}: panels never changed — skipped (not real tabs?)`); continue; }
    captured.push({ list, btns, region, panels });
  }

  // 3. mark live nodes so the clone can find them, then clone
  S.progress = 'clone';
  captured.forEach((g, gi) => {
    g.list.setAttribute('data-snap-group', gi);
    g.region.host.setAttribute('data-snap-host', gi);
  });
  const doc = document.documentElement.cloneNode(true);
  captured.forEach((g, gi) => {
    g.list.removeAttribute('data-snap-group');
    g.region.host.removeAttribute('data-snap-host');
    const list = doc.querySelector(`[data-snap-group="${gi}"]`);
    const host = doc.querySelector(`[data-snap-host="${gi}"]`);
    [...host.children].filter(c => !c.contains(list)).forEach(c => c.remove());
    g.panels.forEach((nodes, i) => {
      const tpl = document.createElement('template');
      tpl.innerHTML = nodes.join('');
      [...tpl.content.children].forEach(c => { c.setAttribute('data-snap-panel', i); if (i) c.hidden = true; });
      host.appendChild(tpl.content);
    });
    [...list.children].forEach((b, i) => {
      b.setAttribute('data-snap-tab', i);
      if (b.hasAttribute('data-active')) b.dataset.active = String(i === 0);
      if (b.hasAttribute('aria-selected')) b.setAttribute('aria-selected', String(i === 0));
    });
  });

  // 4. absolute URLs
  S.progress = 'urls';
  doc.querySelectorAll('[src],[href],[poster]').forEach(e => ['src', 'href', 'poster'].forEach(a => {
    const v = e.getAttribute(a);
    if (v && !/^(data:|#|mailto:|tel:|javascript:)/i.test(v)) e.setAttribute(a, abs(v));
  }));
  doc.querySelectorAll('[srcset]').forEach(e => e.setAttribute('srcset', e.getAttribute('srcset').split(',').map(p => {
    const [u, ...d] = p.trim().split(/\s+/); return [abs(u), ...d].join(' ');
  }).join(', ')));
  doc.querySelectorAll('[style]').forEach(e => e.setAttribute('style', absCss(e.getAttribute('style'), location.href)));
  doc.querySelectorAll('style').forEach(s => { s.textContent = absCss(s.textContent, location.href); });

  // 5. inline stylesheets
  const failedCss = [];
  let inlined = 0;
  for (const l of [...doc.querySelectorAll('link[rel~="stylesheet"]')]) {
    S.progress = `css ${inlined}`;
    try {
      const ctl = new AbortController(); setTimeout(() => ctl.abort(), 8000);
      const res = await fetch(l.href, { signal: ctl.signal, credentials: 'include' });
      if (!res.ok) throw new Error(res.status);
      const st = document.createElement('style');
      st.textContent = absCss(await res.text(), l.href);
      l.replaceWith(st); inlined++;
    } catch { failedCss.push(l.href); }
  }

  // 6. drop app JS (hydration would undo the static panels), add a tiny switcher
  S.progress = 'scripts';
  doc.querySelectorAll('script:not([type="application/ld+json"]), noscript, link[rel="modulepreload"], link[rel="preload"][as="script"]').forEach(s => s.remove());
  if (captured.length) {
    const sw = document.createElement('script');
    sw.textContent = `document.addEventListener('click',function(e){var b=e.target.closest('[data-snap-tab]');if(!b)return;var l=b.parentElement,h=l.closest('[data-snap-host]'),i=b.getAttribute('data-snap-tab');[].forEach.call(l.children,function(x){if(x.hasAttribute('data-active'))x.dataset.active=String(x===b);if(x.hasAttribute('aria-selected'))x.setAttribute('aria-selected',String(x===b))});[].forEach.call(h.children,function(p){if(p.hasAttribute('data-snap-panel'))p.hidden=p.getAttribute('data-snap-panel')!==i})});`;
    doc.querySelector('body').appendChild(sw);
  }

  S.html = '<!DOCTYPE html>\n' + doc.outerHTML;
  const imgs = [...new Set([...S.html.matchAll(/(?:src|srcset|href)="([^"]+)"|url\("([^"]+)"\)/g)]
    .flatMap(m => (m[1] || m[2]).split(',').map(s => s.trim().split(/\s+/)[0]))
    .filter(u => /^https?:/.test(u) && /\.(png|jpe?g|gif|webp|svg|avif|ico)(\?|$)/i.test(u)))];
  S.meta = {
    tabGroups: captured.map(g => ({ tabs: g.btns.map(b => b.textContent.trim().slice(0, 30)), panelImgs: g.panels.map(p => (p.join('').match(/[\w-]+\.(?:png|jpe?g|gif|webp|svg|avif)/gi) || []).filter((v, i, a) => a.indexOf(v) === i)) })),
    warnings, inlinedCss: inlined, failedCss, size: S.html.length,
    imageUrls: imgs,
  };
  S.progress = 'done';
})().catch(e => { window.__snap.error = String(e && e.stack || e); window.__snap.progress = 'error'; });
'started';
