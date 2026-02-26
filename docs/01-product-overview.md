# Product Overview

## 1. Product definition

Convert Everything is a local-first conversion workspace that unifies many day-to-day developer and knowledge-work transformations in one browser application. It combines broad text/data/unit conversion with file-based tasks such as image operations, media conversion flows, QR and PDF utilities, and many specialized utility calculators.

The core value is not one single converter. The value is the reduction of context switching across converter tools and websites while preserving user privacy by running conversion logic client-side.

## 2. Product goals

Primary goals visible in the current codebase:
- Provide a single, consistent UI for diverse conversion jobs.
- Support both quick ad hoc conversion and repeated production-like usage.
- Keep conversion operations in-browser where technically feasible.
- Offer keyboard and drag-and-drop ergonomics for speed.
- Preserve user state locally for continuity across sessions.

Secondary goals implied by implementation choices:
- Offer installable PWA behavior for desktop-like usage.
- Make conversion context shareable via URL parameters.
- Support a broad converter catalog while keeping interaction patterns familiar.

## 3. Problem statement

Users regularly perform transformation tasks across several categories:
- Text encoding and decoding.
- Structured data transformations.
- Numeric and scientific unit conversion.
- Media and document manipulation.
- Developer utility calculations and formatting helpers.

Traditional workflow problems:
- Tool fragmentation across many websites.
- Inconsistent UIs and differing input conventions.
- Privacy concerns when sending payloads to unknown servers.
- Repeated setup friction for simple transformations.

Convert Everything addresses these by consolidating operations under one interaction system and local execution model.

## 4. Who this product serves

Primary user profiles:
- Developers who constantly switch between encodings, structured formats, and utility calculations.
- QA and support teams who inspect payloads, logs, and file formats.
- Technical writers and data-oriented operations users handling JSON/CSV/markdown transformations.
- Designers and frontend engineers handling colors, image manipulations, and quick asset prep.

Secondary profiles:
- Students and power users who need unit conversion and utility calculators in one place.
- Privacy-sensitive users who prefer local browser processing.

## 5. Product surface and interaction model

The product has two core operating modes.

### 5.1 Format graph mode

Format graph mode is driven by `from` and `to` selectors using the conversion graph in `src/formats.js`. This mode is optimized for direct text/data transformations and supports route-style state (`?from=...&to=...`).

Observed strengths:
- Fast repeated conversion between known format pairs.
- History integration with one-click reuse.
- Batch mode capability for line-by-line transformations.
- Clear two-pane mental model (input and output).

### 5.2 Tool mode

Tool mode is driven by selected converter cards from the combined registry in `src/converters/index.js`. This mode supports converter-specific workflows such as file input, generated outputs, previews, or parametric utilities (`?tool=...`).

Observed strengths:
- Flexible converter contracts for text, file, and media tasks.
- Support for multiple categories and specialized workflows.
- Progressive behavior for heavy processing (for example media operations).

## 6. Current capability boundaries

This documentation set intentionally distinguishes implemented behavior from non-implemented assumptions.

What is implemented:
- Browser-based conversion logic.
- Local state persistence for selected UX features.
- Service worker and manifest for installability/offline-friendly behavior.
- Extensive converter catalog spanning broad domains.

What is not currently implemented in this repository:
- Hosted backend APIs for conversion.
- User accounts, organization workspaces, or cloud history sync.
- Server-side analytics pipelines.
- Billing/subscription infrastructure.

These boundaries are important for factual documentation and roadmap prioritization.

## 7. Privacy and trust model

The current product posture is local-first and privacy-forward:
- Conversion operations are executed in client context.
- User history and preference features persist in localStorage.
- No backend exchange is required for core converter functionality.

Risk tradeoffs to communicate clearly:
- Browser storage is device-local and not a secure vault.
- User-generated inputs can still include sensitive data, so users should follow local device security hygiene.
- Some browser APIs (clipboard, drag-and-drop, file handling) require thoughtful UX and permission boundaries.

## 8. UX strategy and productivity posture

The implementation reflects a productivity-first strategy:
- Keyboard shortcut overlays and command-like interactions.
- Drag-and-drop ingestion for file-based conversion routes.
- Fast route switching between broad converter categories.
- Reuse mechanisms (history and favorites) for high-frequency jobs.

This aligns well with a SaaS-quality workflow mindset even when running as a static local web app.

## 9. Product quality principles

For this repository, product quality should be judged on these dimensions:
- Accuracy of conversion results.
- Clarity of converter input requirements and error output.
- Responsiveness for both small and large payloads.
- Stability under repeated switching between converters.
- Accessibility of interactive controls and outputs.
- Consistent behavior across desktop and mobile contexts.

## 10. Scope strategy: breadth with predictable behavior

This product intentionally chooses breadth. Breadth alone can harm quality unless behavior is standardized. The current architecture supports broad scope by using consistent converter object contracts and shared container components.

Recommended scope discipline:
- Add converters only when input/output contracts are explicit.
- Prefer composable simple converters over opaque monolithic behavior.
- Preserve naming consistency across format IDs and converter IDs.
- Ensure each new converter has predictable empty/error/loading behavior.

## 11. Positioning for SaaS-grade documentation

Even without backend features, this repository can maintain SaaS-grade documentation quality by:
- Publishing explicit behavior contracts.
- Separating current implementation from planned enhancements.
- Maintaining strong discoverability docs for converter inventory.
- Tracking accessibility and UX debt as first-class product quality work.

This documentation set is designed to support that standard.

## 12. Operational product metrics (proposed, not currently instrumented)

The current codebase does not expose an analytics backend, but the following metrics are useful if instrumentation is later added with user consent:
- Conversion success rate by converter.
- Median time-to-result by converter category.
- Input validation failure rate by converter.
- Repeat usage rate for history/favorites workflows.
- PWA installation acceptance rate.
- Shortcut adoption rate.

Because these are not implemented analytics in this repo, treat this section as future measurement guidance.

## 13. Product risks and mitigations

### Risk: converter sprawl

As converter count increases, consistency can decline.

Mitigation:
- Enforce converter contract conventions.
- Maintain catalog documentation with ownership and behavior notes.
- Add contributor guidelines for naming and UX quality.

### Risk: unclear discovery paths

A broad toolset can overwhelm first-time users.

Mitigation:
- Improve category semantics and onboarding cues.
- Provide docs-oriented entry points by user intent.
- Keep search and filtering fast and forgiving.

### Risk: accessibility drift

Rapid feature additions can erode keyboard and screen-reader quality.

Mitigation:
- Keep accessibility acceptance criteria in converter PRs.
- Track a11y issues as product blockers, not cleanup work.

### Risk: trust erosion from unclear claims

If docs promise unimplemented behavior, user trust drops quickly.

Mitigation:
- Label planned work explicitly.
- Anchor claims to implementation evidence.
- Keep README and docs synchronized with release changes.

## 14. Product non-goals at this stage

Clear non-goals help preserve execution focus:
- Building a general-purpose cloud ETL platform.
- Replacing fully specialized desktop media suites.
- Implementing account-driven multi-tenant collaboration.
- Supporting every legacy or proprietary format from day one.

## 15. Summary

Convert Everything is a broad, local-first conversion workspace with strong implementation foundations for a high-quality utility SaaS experience. Its strengths are breadth, speed, privacy posture, and practical UX patterns. Its main strategic challenge is maintaining consistency and discoverability as the catalog expands. This doc set formalizes that direction and keeps product communication factual and maintainable.
