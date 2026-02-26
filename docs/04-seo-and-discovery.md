# SEO and Discovery

## 1. Scope of this document

This document describes current discovery-related implementation in this repository and provides a pragmatic roadmap for improving findability without claiming unimplemented behavior.

The app is currently a client-rendered React SPA. Discovery strategy must account for both technical SEO constraints and product-level information architecture.

## 2. Current implementation snapshot

### 2.1 HTML metadata in `index.html`

Implemented metadata includes:
- `title`: Convert Everything
- `meta description` with local-first/privacy message
- Open Graph tags (`og:title`, `og:description`, `og:type`, `og:site_name`)
- Twitter card metadata (`summary`, title, description)
- Theme color and mobile web app meta tags

Strength:
- Baseline social preview and snippet quality is present.

Limitation:
- Metadata is mostly global and not converter-specific.

### 2.2 URL state and deep linking

Implemented query contracts in `App.jsx`:
- `?from=<format>&to=<format>` for format graph mode.
- `?tool=<converterId>` for tool mode.

Strength:
- Users can share exact working context.

Limitation:
- These routes are stateful SPA links, not statically generated SEO landing pages with dedicated content.

### 2.3 Dynamic title behavior

`App.jsx` updates document title based on active converter.

Strength:
- Better UX and potentially improved share/tab clarity.

Limitation:
- Without pre-rendered content pages, crawler index depth for converter-level intent can remain limited.

### 2.4 PWA assets

Implemented files:
- `public/manifest.json`
- `public/sw.js`

Strength:
- Improves installability and return-user behavior.

Limitation:
- PWA implementation does not itself replace SEO requirements like crawlable, intent-focused content pages.

## 3. Discovery goals

For this product, discovery should target two paths:
- Search-driven discovery from converter-specific intent queries.
- Product-led discovery for users who already know the app and need fast re-entry.

These goals require different tactics.

## 4. Search intent model for converter products

Typical user intent clusters for this domain:
- "Convert X to Y"
- "Format/validate/inspect specific payload type"
- "Quick calculator for domain-specific operation"
- "Offline/local/private converter"

Current implementation supports intent fulfillment in-app, but discoverability content and structure can be stronger.

## 5. Current strengths

Existing strengths from this codebase:
- Broad converter surface likely useful for long-tail search intent.
- Clear value proposition in metadata (local, no tracking language).
- Shareable deep links and route state.
- Lightweight static-host-friendly architecture.

## 6. Current discovery gaps

Gaps observable in repo state:
- No dedicated `robots.txt` and `sitemap.xml` assets are currently present.
- No static converter landing pages with structured explanatory content.
- No schema.org structured data blocks in current HTML.
- No canonical URL policy documented for route parameter combinations.
- No formal content governance for converter descriptions and examples.

These are documentation and implementation opportunities, not current features.

## 7. Recommended discovery architecture (phased)

### Phase 1: Metadata hardening (low complexity)

Recommended additions:
- Add `robots.txt` and `sitemap.xml`.
- Define canonical URL policy for home, format-mode, and tool-mode states.
- Standardize title and description templates for converter mode.
- Add explicit social image strategy for richer link previews.

Expected impact:
- Better crawl hygiene and snippet consistency.

### Phase 2: Converter index content (medium complexity)

Recommended additions:
- Publish a converter index page that is content-oriented and crawlable.
- Include stable converter IDs, names, and short use-case descriptions.
- Link this index to implementation-backed docs.

Expected impact:
- Better coverage for long-tail converter intent queries.

### Phase 3: Intent-focused landing pages (higher complexity)

Recommended additions:
- Generate static pages for high-demand converter pairs or tools.
- Include concise examples, edge-case notes, and privacy posture.
- Link each page into sitemap and internal discovery architecture.

Expected impact:
- Stronger discoverability for specific problem-intent searches.

## 8. Content design standards for discovery

To avoid low-quality SEO content, follow these rules:
- Anchor each page to actual implemented converter behavior.
- Provide concrete input/output examples that match code behavior.
- Avoid generic filler copy that does not help task completion.
- Explicitly label limitations and unsupported cases.
- Keep language practical and conversion-task focused.

## 9. Internal discovery and conversion UX

SEO is one discovery channel. Internal discovery is equally important.

Current internal strengths:
- Converter categories for broad browsing.
- URL-deep-link support for direct sharing.
- History and favorites/recent behavior for repeated tasks.
- Keyboard and drag-based shortcuts for speed.

Recommended internal improvements:
- More explicit converter metadata in picker cards.
- Better grouping for overlapping utility converters.
- Converter-level quick examples displayed inline.

## 10. Information architecture recommendations

For docs and product pages:
- Maintain one stable source-of-truth catalog doc (`docs/03-converter-catalog.md`).
- Map product narrative to architecture and UX docs.
- Ensure README links are maintained as governance anchors.

For application navigation:
- Keep query route contracts stable.
- Avoid breaking deep links when renaming converters.
- Introduce redirect mapping if any converter IDs are ever changed.

## 11. Structured data opportunities

Not currently implemented, but high-value options include:
- `SoftwareApplication` schema for product-level metadata.
- `HowTo` schema for conversion workflows with explicit examples.
- `FAQPage` schema for common converter questions and edge cases.

These should only be added where content is genuinely user-helpful and implementation-backed.

## 12. International discovery considerations

No localization framework is currently documented in this repo. If international SEO becomes a priority:
- Define locale strategy before creating translated landing pages.
- Add `hreflang` only when localized content is complete and maintained.
- Keep converter IDs locale-agnostic and stable.

## 13. Performance and discovery alignment

Performance supports discovery indirectly via user retention and quality signals.

Current architectural choices supporting this:
- Vite build optimization.
- Manual chunking for heavy dependencies.
- Service worker caching strategy for static assets.

Potential improvements:
- Route-aware lazy loading for heavy converter modules.
- Additional performance budgets per converter category.
- Monitoring for first interaction time in tool mode.

## 14. Discovery measurement framework (proposed)

No analytics backend is implemented here, but the following metrics are useful when instrumentation is added with explicit user-consent design:
- Organic sessions by landing route pattern.
- Converter deep-link entry rate.
- Bounce rate for converter-intent pages.
- Repeat usage and return visit rate.
- PWA install and retention rate.

Treat this as forward-looking measurement guidance.

## 15. AGPL and discovery publishing posture

Discovery-focused publishing should preserve AGPLv3 transparency expectations:
- Keep source-access and licensing references visible.
- Ensure distributed hosted builds align with AGPL obligations.
- Keep user-visible feature claims synchronized with source availability.

## 16. Practical 90-day SEO/discovery execution plan

Suggested plan for maintainers:
1. Add crawl hygiene artifacts and canonical policy docs.
2. Build converter index content from source metadata.
3. Ship top-priority converter landing pages for high-intent use cases.
4. Introduce structured data for product and workflow pages.
5. Establish a docs/content review gate in release process.

Each step should be treated as planned work until implemented.

## 17. Summary

Current discovery foundations are present but baseline: global metadata, shareable URLs, and a broad converter implementation. The largest opportunity is building converter-intent content architecture that remains factual, useful, and tightly aligned with implemented behavior. Strong discovery for this product is less about keyword volume and more about high-quality, trust-preserving task documentation connected to real converter workflows.
