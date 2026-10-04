# web-catalog — Build the Propuesta 4 catalog site

## Objective
Implement the approved Propuesta 4 design (visual fidelity, responsive, good web practices) as a static Next.js site, applying the closed project decisions from the root `CLAUDE.md` to content and behavior.

## Sources
- Design spec: `../docs/diseno-propuesta-4.md` (extracted from `Combinada.dc.html`; section 5 lists conflicts where project rules win).
- Data: `src/data/cables.ts`, `types.ts`, `company.ts`.
- Rules: root `CLAUDE.md` (brand CORPORACION J & F SAC, no prices, no PDF downloads, 3-question assistant, rollos/metros quantities, buy type in assistant step 1 and quote section only, WhatsApp 948 271 308 + bubble chooser).

## Scope
In: all sections of the design, quote flow with quantities, assistant (3 questions), detail pages, SEO basics.
Out: prices, PDF datasheets, backend, admin panel, real logo (placeholder until client delivers PNG/SVG), photos, "Nosotros" copy.
Open client decisions (use provisional markers): form destination email (corporacionj@ vs corporacionjfml@), RUC/address mismatch vs proforma, 13 vs 15 cables, social handle, logo, domain.

## Resolved mode
- TDD: off (no project/session configuration; no test runner installed). Functional checks per task: `npx tsc --noEmit`, `npm run lint`, `npm run build`.
- Delivery: one work-unit commit per task on `feat/web-catalog`. Forecast exceeds ~400 authored lines; PR slicing/chain strategy deferred until the client repo/remote exists (no PRs are created without it).
- Artifact language: code and identifiers in English; user-visible site copy in Spanish (existing project language).

## Tasks
- [x] T1 Foundation: fonts (Outfit, IBM Plex Mono), Tailwind tokens/globals from design, layout + metadata (lang es), shared UI primitives, placeholder logo. Route: delegated writer.
- [x] T2 Shell: util bar, sticky header, mobile menu, footer, floating WhatsApp bubble with 2-number chooser. Route: delegated writer.
- [ ] T3 Quote state: context + localStorage (id, quantity, unit, buyer type), quantity modal (rollos/metros rules), tray, WhatsApp message builder. Route: delegated writer.
- [ ] T4 Catalog: categories bento, search, category chips, product cards, technical sheet modal. Route: delegated writer.
- [ ] T5 Home top: hero, 3-question assistant, marquee, "Cómo funciona", advisory band. Route: delegated writer.
- [ ] T6 Quote section + comparison table + anatomy section + contact form behavior. Route: delegated writer.
- [ ] T7 Detail pages `/cables/[slug]`, SEO (metadata, sitemap, robots, OG), responsive/accessibility pass. Route: delegated writer.

## Acceptance
Matches the design values from the spec; responsive from 360 px; no "Corporación JML", no coeperperu, no prices, no PDF downloads; build exports static output.

## Progress log
- T1 done: commits 5933806 + f7c5f28 (fix). Checks: tsc, lint, build OK. Review: medium, 789 lines, granted; 1 critical (unlayered `a` color overrode button text) fixed via @layer base; approved and acknowledged. Advisory: rename custom `ping` keyframes to avoid Tailwind collision (do in T2 when the WhatsApp bubble uses it). Reviewed boundary: f7c5f28.
- T2 done (commit below): UtilBar, Header+mobile menu, Footer, WhatsApp bubble chooser, skip link; ping renamed ping-soft. Checks tsc/lint/build OK; not browser-tested.

## Next step
T3.
