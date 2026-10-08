---
name: tenbeltz:brand-guidelines
description: Applies the TenBeltz editorial brand system to pages, banners, social assets and decks. Use for visual identity, typography and engineering-focused messaging.
license: MIT
---

# TenBeltz Brand Guidelines

Updated: 2026-10-08, following Aritz's request for a complete, sober and professional website redesign.

## Positioning

TenBeltz is an external AI engineering team for software companies and software consultancies. Communicate technical judgment through concrete projects, defined responsibilities, evaluation and delivery criteria.

## Visual direction

Use an editorial composition with a warm light background, charcoal text and a restrained aubergine accent. Build hierarchy with typography, spacing and fine rules.

- Paper: `#f7f6f2`.
- The home hero uses Aritz’s original abstract silk flower artwork: translucent ivory/mauve petals with aubergine folds, large on the right of desktop copy. The original single-mesh unfolding animation (3.8 seconds) and subtle breeze are restored at Aritz’s request; the articulated-petal reconstruction and mouse response are discarded. Keep “TenBeltz / Proyectos de IA que florecen” (EN: “TenBeltz / AI projects that bloom”). On mobile the original flower is a recognizable, softly blurred background emerging from the lower-right corner behind the copy, with no separate flower block or WebGL/GSAP download. Blur is 1px and opacity 36%, with a gradient mask to protect text. Use a static version for reduced motion and browsers without WebGL; pause animation offscreen. This requested flower supersedes the former blanket avoidance of decorative 3D for this hero only.
- Ink: `#252826`.
- Secondary text: `#676b65`.
- Rules: `#d9dcd4`.
- Accent: `#583346`.
- Secondary surface: `#eeeee7`.
- Primary typography: self-hosted IBM Plex Sans, mainly weights 400 and 500.
- Small corner radii; flat, solid buttons. Primary buttons retain white text in normal, hover and keyboard-focus states. Scope contact-link colour inheritance to inline contact details, never all contact-section anchors.
- Selected work uses one heading and a manual carousel: landscape image, client/relationship, title, short summary and case link. A single navigation row contains “Más proyectos” and previous/next controls with a counter. No thumbnails, extra introductions, system subsection or visible scrollbars. Native touch scrolling and keyboard navigation remain. Label illustrative images discreetly inside the image. No autoplay.
- The home follows proposal → client logos → selected work → service entry points → technical responsibility and method → contact. Define the audience in the hero. Use shared alignments and unnumbered headings; give secondary explanations less visual weight.
- Home service paths reuse the brandbook diagnosis, architecture and training accent icons (public/images/brand), copied unchanged from brand/dist/icons; decorative images have empty alt.
- Home services use three compact paths: define (diagnosis and foundations), build (MVP and production), and train. Keep all five service links. Use neutral surfaces and fine rules; the services detail page retains its two-column cards and native disclosures. Avoid nested boxes and excessive decoration.
- Present Aritz between services and contact, with a modest portrait and the four method steps integrated below. Aritz leads initial meetings, consulting and technical definition; development and integration are delegated to the team under his technical direction. Do not promise he personally implements everything. Keep the method steps in two columns on mobile. The full contact form is always open, including on the home, at Aritz's explicit request.
- Hide the visible “Clientes destacados” / “Featured clients” heading on desktop; retain the accessible region label and the mobile heading. Use official logos for Irontec, Qamarero, Biiak and Imagina, and the official SistemaPol logo with a TecniSoft caption. The slow horizontal loop fades at its edges and keeps moving on mouse hover and mobile touch. Each logo opens the official client landing in a new tab; duplicate links are excluded from keyboard navigation. Only visible keyboard focus on desktop stops the animation to make the links reachable. Aritz explicitly removed the visible pause button; reduced motion uses a static grid. Logos and Aritz's portrait reveal their original colours on hover. Preserve the co-founded-product attribution for Biiak in the case content.
- Brandbook graphics: reuse the original paper petal-contours PNG beside the team intro and the paper silk-wave PNG as a masked right-side backdrop to the home team/method section. Keep text readable, no motion; mobile team artwork sits below the copy. Copies in public/images/brand come unchanged from brand/dist/graphics.
- Dark sections are occasional, using charcoal and readable neutral text.
- Use authentic photography where available and explanatory diagrams. Generated project covers must be labelled illustrative; they are not client photographs or product screenshots. Label simplified diagrams as project flows.

The former dark operational direction with purple/cyan glows, atmospheric grids, glass panels and 3D scenes is superseded for the website. Avoid neon, decorative particles, scanning effects, gradient text and stacked interface badges.

## Writing

Use direct, calm language. Describe the context, technical contribution, deliverables and evidence. Prefer positive descriptions of the work over repeated slogans about demos or hours.

Maintain the distinction between client projects, technical collaborations and products Aritz co-founded. Do not imply that all experience belongs to TenBeltz client delivery. Explain English service names in the visitor's language.

## Evidence and confidentiality

- Irontec and Qamarero are publicly named client/collaboration references.
- Biiak is a co-founded product, not a third-party client claim.
- Aritz explicitly authorised the reference names Prados-Osuna Abogados, LexFirma, TecniSoft (SistemaPol), Imagina and Opus Dei on 2026-10-07. Opus Dei received the 30-hour training through Imagina; preserve that relationship. Other legal clients and case details remain anonymous unless separately authorised.
- Public copy must not include CRM, prospect, financial or personal case data.
- Use the local CVMaker master profile as a source for documented projects; commercial example lists are not proof of completed work.
- Explain metric scope, evaluation sample and the difference between top-1 and top-5. Do not combine results from distinct evaluations.
- AnonLM is explicitly excluded as a featured project in the source profile.

## Motion and access

Content should be visible without scroll reveals or hydration. Use modest hover/focus transitions and respect reduced motion. Navigation, forms and language switching must work on mobile and keyboard. The mobile header stays visible while scrolling (sticky, top:0). Mobile navigation uses a full-screen paper panel beneath the header, large ruled link rows, a highlighted contact CTA and full language name. Keep scroll position on close, contain keyboard focus, support Escape and hide the cookie notice only while open. Without JavaScript keep navigation available.

## Sources

- `brand/README.md`, `brand/BRANDBOOK.md` and `brand/source/identity.json`: brandbook and reusable resource kit (2026.10). New applications extend the website identity; Aritz approved the complete expanded kit on 2026-10-08. Office and print checks remain pending. Preserve the original symbol and flower. Regenerate logos, social assets, documents and presentations with `tools/brand-kit/build.py`; content is in `brand/source/*.json`. Do not manually change generated files without updating their generator/source. Editable corporate decks ES/EN and a ten-layout slide template are in `brand/dist/presentations/`; install bundled IBM Plex Sans fonts to edit. See `brand/SOURCES.md` for provenance and licenses.
- Expanded at Aritz's request after positive review of the original kit: 30-page manual, six-page fictional proposal, seven-page fictional evaluation report, twelve distinct corporate slide compositions per language, more vectors/icons and six AI-generated merchandise mockups. Example client/budget/metrics are illustrative, not evidence of real work. Preserve that label. Documents and slides share the reusable geometry in `tools/brand-kit/scenes.py`; the other expansion modules and mockup prompts/originals are included in the ZIP.

- `src/styles/global.css`: design tokens and responsive layout.
- `src/data/projects.ts`: shared ES/EN project descriptions.
- `src/templates/LandingPage.astro`: home composition.
- `src/templates/CasesPage.astro`: project evidence and JSON-LD.
- `docs/redesign-2026-10-07.md`: rationale, sources and verification.

## Team and portfolio update — 2026-10-08

- Home selected work: Konect, Qamarero phone reservations, document classification, Biiak. Four manually navigable slides with text-free conceptual scenes (phone call to analytical charts, telephone bot to reserved table, sorted documents, protected case file); generate SVGs with tools/project-covers/build.py. Label them as conceptual illustrations, without fictional product screenshots. Keep technical explanations in the case text, not inside the cover.
- Zetesis is an authorised reference with its official orange logo linking to https://zetesis.xyz/.
- Team CTA: “Conoce al equipo” / “Meet the team”. Team order: Aritz, Ángel Jiménez (AI & Full Stack Developer), Rubén García Hernando (senior software architect, Zetesis), Artem Pysmak (AI Engineer). Use authorised real portraits; describe contributions without employment-status claims or diminishing Ángel through attribution to Aritz.
- Aritz has his own /aritz and /en/aritz profile/CV with technical direction, original experience, education, teaching, recognition and print styling. Remove links to aritzjaber.com.
- Nine portfolio cases; remove the standalone local-RAG demonstrator. Biiak is a full child protection platform, not only a notes assistant. ENS Medium compliance is user-confirmed.
- Classification final evidence: lae-parser 6f16e34, geometric ensemble of a supervised head on154 similarities and logistic regression on1024d embeddings. Top-1 72.35%, Top-5 91.51%, macro F1 69.15% on1414 held-out documents; same-test CSLS baseline56.44%/83.66%. Monthly hundreds-of-thousands workload is user-confirmed context, not benchmark throughput. Cost and accuracy improvements over initial all-LLM solution are qualitative; do not invent a percentage cost reduction.
- Konect includes user-confirmed RETA local-AI adaptation with NVIDIA DGX Spark for500 daily calls; do not turn this workload into an unmeasured hardware benchmark.
