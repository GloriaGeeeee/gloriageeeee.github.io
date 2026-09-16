# Backlog

Things noticed along the way that we've deliberately deferred rather than
fixed in the moment. Not urgent, not forgotten.

- [x] **Nav has no way home.** Added the brand logo to the left of the
      navbar on all three pages, linking back to `index.html`.
- [x] **Rotating banner pattern is wrong.** The rotating banner below the
      hero (`index.html`, `.rotating-banner`) — the pattern it's cycling
      through isn't right. Needs a look with fresh eyes against the Figma
      reference.
- [x] **Drop the page-transition curtain for case studies.** Decided
      against it — the current red curtain wipe (`data-transition` /
      `.curtain` in `js/script.js`) on "View case study" links stays as is.
- [x] **Case study images aren't clickable.** Any image or video in a
      `.cs-figure` now opens full-size over a dimmed overlay, closing on the
      X, the backdrop, or Escape. Wired up by selector in `js/script.js`, so
      media added later is clickable with no extra markup — which also picks
      up the About page's digital art gallery.
- [x] **Mobile responsiveness needs a proper pass.** Done in practice: the
      homepage case-study folds, the About page, and all 4 case studies
      each got dedicated mobile fixes this session (layout, animation,
      spacing, type scale, icon sizing). No outstanding known issues.
- [x] **IB onboarding case study is still missing real metrics.** Filled in:
      96.10% approval-conversion lift and 2.4 days → 1 min activation, then
      the counter-result (a flat ~50 partners earning per month, 90-day
      referral rate 4.2% → 1.1%) under "The bottleneck moved". Still open:
      the homepage card's description was written to avoid leaning on a
      stat, and could now be sharpened with one.
- [ ] **Add an AI section to the homepage.** Both the homepage heading and
      the About page bio mention AI-driven/AI-assisted workflows in passing
      ("Now powered with AI design workflows!" in the Figma redesign at
      node 30:446), but nothing on the site expands on it. Worth a proper
      section — probably between "About me" and "Selected work" — rather
      than a single clause buried in the intro copy.
- [x] **Case studies dead-end at "Back to all work."** Every case study now
      ends with a "See other works" carousel (`.cs-related`) listing the
      other three — thumbnail, title, description, tags and a CTA each.
      Scrolls natively via CSS scroll-snap; the arrows hide themselves
      whenever all three cards already fit. Two follow-ons: the Affiliate
      card's thumbnail is still a "Mockups — TBD" placeholder until there's
      a shippable screenshot, and each thumb borrows its homepage fold's
      shape colour, so a fold recoloured later needs its `--thumb-bg`
      updated to match.
- [ ] **[Known issue, shipping anyway] Page-transition curtain flashes
      mid-transition, on both desktop and mobile.** Confirmed real via a
      frame-by-frame breakdown of a screen recording: the curtain
      (`.curtain` / `data-curtain`, `js/script.js` section 8) fully
      disappears for a handful of frames mid-cover, along with the entire
      page underneath it, before snapping back — not just a brief
      navigation gap. Two attempted fixes (`@view-transition` for
      cross-document navigation, then promoting the curtain to its own
      compositor layer via `will-change`/`backface-visibility`) were both
      reverted after real-device testing showed neither resolved it.
      Deliberately deferred to a post-launch fix rather than holding launch
      for it. Worth revisiting with fresh eyes — possibly the web-font swap
      (Geist/Inter finishing download mid-transition) forcing a full-page
      relayout is only part of the story.
- [ ] **Magnetic scroll effect for the homepage case-study section.** The
      case-study folds on `index.html` (`#work`) currently scroll like any
      other content. Explore a "magnetic" scroll-snap feel where each fold
      pulls into place as you scroll past it, rather than free scrolling.
