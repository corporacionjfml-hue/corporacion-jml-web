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
- [x] T3 Quote state: context + localStorage (id, quantity, unit, buyer type), quantity modal (rollos/metros rules), tray, WhatsApp message builder. Route: delegated writer.
- [x] T4 Catalog: categories bento, search, category chips, product cards, technical sheet modal. Route: delegated writer.
- [x] T5 Home top: hero, 3-question assistant, marquee, "Cómo funciona", advisory band. Route: delegated writer.
- [x] T6 Quote section + comparison table + anatomy section + contact form behavior. Route: delegated writer.
- [ ] T7 Detail pages `/cables/[slug]`, SEO (metadata, sitemap, robots, OG), responsive/accessibility pass. Route: delegated writer.

## Acceptance
Matches the design values from the spec; responsive from 360 px; no "Corporación JML", no coeperperu, no prices, no PDF downloads; build exports static output.

## Progress log
- T1 done: commits 5933806 + f7c5f28 (fix). Checks: tsc, lint, build OK. Review: medium, 789 lines, granted; 1 critical (unlayered `a` color overrode button text) fixed via @layer base; approved and acknowledged. Advisory: rename custom `ping` keyframes to avoid Tailwind collision (do in T2 when the WhatsApp bubble uses it). Reviewed boundary: f7c5f28.
- T2 done (commit below): UtilBar, Header+mobile menu, Footer, WhatsApp bubble chooser, skip link; ping renamed ping-soft. Checks tsc/lint/build OK; not browser-tested.
- T3 done: src/lib/quote (pure rules/message/storage, script-verified), QuoteProvider, QuantityModal, QuoteTray, temporary dev buttons (remove in T4). Checks tsc/lint/build OK; not browser-tested. T2 under budget (374 lines), review accumulates with T3.
- Review T2+T3 (medium, 969 lines): granted, approved, acknowledged, boundary e5d90fb. Advisory follow-ups (not blocking, fix in T7 polish): disabled minus button loses focus in QuantityModal (focus trap/Escape break at minimum); cap max quantity and avoid exponent roundtrip on blur; storage-event sync across tabs; no committed tests for src/lib/quote (add if TDD gets enabled).
- T4 done: catalog (categories bento, search/filter, cards, sheet modal, useCableSheet hook), dev buttons removed. ~1190 lines. Checks tsc/lint/build OK; scripted headless-Chrome DOM checks passed (15 cards, search, empty state, sheet/quantity modals, Escape order). Not verified: scroll to #productos after tile click, focus restore, hover, 360px visual.
- Review T4 (medium, 1414 lines): granted, approved, acknowledged, boundary 6b7097d. Advisory follow-ups (T7 polish): guard empty variants in CableSheetModal (crash if a cable has no variants); dangling '#cotizar' link until T6 section exists; no committed tests for catalog search.
- T5 done: Hero + 3-question Assistant (pure logic in src/lib/assistant, script-verified 24 combos), Marquee, HowItWorks, AdvisoryBand; tags adjusted in cables.ts. Headless Chrome: wizard end-to-end OK, badge count OK. FOUND: horizontal overflow at 360px from T2 header (hamburger right=374). Trust row item 2 is provisional neutral text (no manufacturer names).
- 360px header overflow fixed (tighter mobile header/logo, badge overlaid <420px). Verified in real Chrome via a 375px iframe: no horizontal overflow at 360 with and without a 3-item quote badge. Desktop home top screenshot matches design. 320px not targeted (header still tight).
- Review T5 + header fix (medium, 849 lines): granted, approved, acknowledged, boundary 6d88bf7. Advisory follow-ups (T7 polish): assistant.ts handle empty candidate list defensively; Marquee duplicated-block class concatenation; assistant tests if TDD enabled.
- T6 done: QuoteSection (buyer type, editable lines, WhatsApp send), CallbackForm (configurable endpoint in company.ts form.*, WhatsApp fallback), ComparisonSection (15 rows), AnatomySection (NA2XY drawing). ~1060 lines. Bugs fixed: category colors were purged by Tailwind (@theme static), table sr-only spans caused 989px overflow at 360. Headless Chrome checks passed (see report); not verified: real POST, 360px visual of anatomy/table, #comparativa/#cotizar scroll offsets. Form endpoint pending client (Web3Forms/Formspree). Nosotros/Galería de obras (in proforma) not in design/plan: out of scope until user decides.
- Review T6 (medium, 1144 lines): granted, approved, acknowledged, boundary 8bc9cfe. Advisory follow-ups for T7: CallbackForm opens WhatsApp popup after an await (popup blockers on mobile Safari: open synchronously or use a link); stale waUrl after form reset; 'flexible' column derived by heuristic in comparison.ts (validate with client data); callback.ts untested.

## Next step
T7 (include all accumulated advisory follow-ups: QuantityModal focus on disabled minus + max quantity + exponent roundtrip; empty variants guard in CableSheetModal; assistant empty candidates; Marquee class concat; CallbackForm popup/waUrl).
