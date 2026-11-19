// Only for images behind a login (Okta etc.) that Node cannot fetch.
// Run in a tab on the SAME origin as the images (cookies apply). Replace FILENAME first.
// Fetches every snapshot image URL on this origin with the browser session, keeps only real
// image/* responses, and downloads one JSON bundle: { url: { mime, b64 } }.
(async () => {
  const urls = (window.__snap?.meta?.imageUrls || []).filter(u => new URL(u).origin === location.origin);
  const out = {}, report = [];
  await Promise.all(urls.map(async u => {
    const r = await fetch(u, { credentials: 'include' });
    const ct = (r.headers.get('content-type') || '').split(';')[0];
    const buf = new Uint8Array(await r.arrayBuffer());
    if (!r.ok || !ct.startsWith('image/')) return report.push(`SKIP ${r.status} ${ct} ${u}`);
    let s = '';
    for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode(...buf.subarray(i, i + 0x8000));
    out[u] = { mime: ct, b64: btoa(s) };
  }));
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(out)], { type: 'application/json' }));
  a.download = 'FILENAME.images.json';
  document.body.appendChild(a); a.click(); a.remove();
  return { asked: urls.length, bundled: Object.keys(out).length, skipped: report };
})();
