# Backlog

Things noticed along the way that we've deliberately deferred rather than
fixed in the moment. Not urgent, not forgotten.

- [ ] **Nav has no way home.** The top nav (homepage and case study pages)
      has no logo/wordmark linking back to `index.html` — only "About me",
      "Work", "Blog". Add a clickable logo on the left of the navbar.
- [ ] **Rotating banner pattern is wrong.** The rotating banner below the
      hero (`index.html`, `.rotating-banner`) — the pattern it's cycling
      through isn't right. Needs a look with fresh eyes against the Figma
      reference.
- [ ] **Drop the page-transition curtain for case studies.** Clicking
      "View case study" from the homepage currently triggers the red
      curtain wipe (`data-transition` / `.curtain` in `js/script.js`)
      before navigating. Decide whether case study links should skip it
      for a more instant feel.
- [ ] **Case study images aren't clickable.** Images in `case-*.html`
      (`.cs-figure img`) are static — add a lightbox/full-size view so
      readers can inspect research artefacts and screenshots up close.
