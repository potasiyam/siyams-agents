// Run after snapshot.js reports progress 'done'. Replace FILENAME first.
// Downloads window.__snap.html to the browser's download folder (~/Downloads).
(() => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([window.__snap.html], { type: 'text/html' }));
  a.download = 'FILENAME.html';
  document.body.appendChild(a); a.click(); a.remove();
  return 'clicked';
})();
