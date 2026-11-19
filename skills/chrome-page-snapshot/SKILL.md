---
name: chrome-page-snapshot
description: Save a rendered page and its tab panels to a static HTML file.
---

# Chrome Page Snapshot

Use a browser session the user has authorized to capture the page. Keep the tab visible. Inspect the tab controls first and confirm they only switch panels. Run the bundled snapshot.js in the page and poll window.__snap.progress until done or error. Review window.__snap.meta.warnings and failedCss. Retry duplicate panels after placing the page in the foreground.

Choose a free download name, substitute it for FILENAME in download.js, and run that script in the same tab. Open the downloaded HTML and check the tab panels. External fonts, images, or styles may still require the original site. Report those dependencies when the user needs an offline copy.

For an offline copy of same-origin images, run bundle-images.js in the capture tab with the chosen filename. In a fresh output directory run `node unbundle.mjs page.html page.images.json` with the bundled helper and both downloaded files. Open page.local.html and verify the images with networking disabled. Report any skipped or cross-origin assets.
