# Backlog

Things noticed along the way that we've deliberately deferred rather than
fixed in the moment. Not urgent, not forgotten.

- [x] **Nav has no way home.** Added the brand logo to the left of the
      navbar on all three pages, linking back to `index.html`.
- [x] **Rotating banner pattern is wrong.** The rotating banner below the
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
- [ ] **Polish the About timeline into a "fun folder" view.** The journey
      timeline (`about.html` `#journey`, `.about-tl` in `css/styles.css`)
      works but is a first pass: five bubbles on an axis that reveal an
      image on hover. Revisit the interaction — the idea is something more
      playful and folder-like to browse through. Two loose ends to pick up
      with it: the five hover images are still generated placeholders
      (`assets/about/tl-*.webp`), and the whole thing collapses to a plain
      horizontal scroll on mobile rather than having a designed small-screen
      treatment.
- [ ] **Mobile responsiveness needs a proper pass.** Individual pieces have
      been spot-checked at 375px as they were built, but the site hasn't had
      one holistic mobile review end to end — worth going through every page
      on an actual phone-sized viewport looking for anything that slipped
      through the per-feature checks.
- [ ] **IB onboarding case study is still missing real metrics.** The
      Outcome section (`case-pepperstone.html` `#outcome`) has three
      `.cs-metric` placeholders ("Metric one/two/three", value "—") instead
      of real numbers. The homepage card's description was written to avoid
      leaning on a stat for exactly this reason — fill these in and the
      description could likely be sharpened too.
- [ ] **Add an AI section to the homepage.** Both the homepage heading and
      the About page bio mention AI-driven/AI-assisted workflows in passing
      ("Now powered with AI design workflows!" in the Figma redesign at
      node 30:446), but nothing on the site expands on it. Worth a proper
      section — probably between "About me" and "Selected work" — rather
      than a single clause buried in the intro copy.
- [ ] **Case studies dead-end at "Back to all work."** Every case study
      (`case-*.html` `.cs-pagenav`) only offers one link back to the
      homepage — a reader who's just finished one case study has no way to
      jump straight into another without leaving the page and scrolling
      back down. Add a row of work cards (reusing the homepage's case-fold
      content, probably in a lighter/compact form) before the footer so
      readers can hop between case studies directly.
