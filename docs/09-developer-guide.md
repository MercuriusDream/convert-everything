# 09. Developer Guide

## Purpose

This guide helps contributors build, extend, and maintain the Vite + React local-first converter app with consistent quality. It focuses on practical implementation rules, architecture decisions, and workflows that keep conversion logic fast, safe, and understandable.

## Stack and Core Concepts

- Frontend framework: React.
- Build tool: Vite.
- Language: JavaScript or TypeScript depending on project setup.
- Conversion runtime: Web Workers and optionally WebAssembly-based engines.
- Product model: local-first conversion in the browser.

Local-first means user file data should stay in-device by default. This assumption shapes architecture, logging, and feature design.

## Local Development Setup

### Prerequisites

| Tool | Recommended version |
|---|---|
| Node.js | Active LTS |
| Bun | Latest stable |
| Modern browser | Latest stable Chrome/Firefox/Safari |

### Bootstrap

1. Install dependencies with `bun install`.
2. Start development server with `bun run dev`.
3. Open local URL from Vite output.
4. Validate basic conversion flow manually before making deep changes.

### Build and Preview

- Build production assets with `bun run build`.
- Preview production output with `bun run preview`.

Use preview for behavior checks related to bundling, lazy chunks, and CSP-sensitive assets.

## Project Structure (Reference)

| Path | Purpose |
|---|---|
| `src/components` | Reusable UI components |
| `src/features` | Feature-level modules (upload, conversion, history) |
| `src/workers` | Worker scripts and conversion execution logic |
| `src/lib` | Shared utilities, format helpers, validators |
| `public` | Static assets copied as-is |
| `docs` | Product, operations, and governance documentation |

If actual folder names differ, keep equivalent separation of concerns.

## Architecture Guidelines

## 1. Keep Conversion Off the Main Thread

- All expensive parsing and encoding should run in workers.
- UI should dispatch commands and render progress state.
- Worker protocol must be explicit and versionable.

Suggested message schema categories:

- `convert:start`
- `convert:progress`
- `convert:done`
- `convert:error`
- `convert:cancel`

Avoid ad hoc message payloads. Use typed contracts where possible.

## 2. Preserve Local-First Guarantees

- Do not add hidden uploads.
- Any network operation must be documented and user-justified.
- Keep telemetry optional and privacy-safe.
- Never log raw file content.

## 3. Design for Cancel and Retry

Conversion workflows must support:

- User-initiated cancellation.
- Clear cleanup of temporary buffers.
- Reliable retry from a clean state.

A conversion that cannot be cancelled is a UX and reliability risk.

## 4. Keep State Predictable

- Separate ephemeral job state from persistent user preferences.
- Avoid global mutable singletons for conversion pipeline internals.
- Use derived selectors/computations rather than duplicating derived state.

## Adding a New Converter

Use this implementation sequence for consistency.

1. Define input/output format capabilities and limits.
2. Add parser/encoder wrapper in conversion layer.
3. Integrate converter execution in worker command handler.
4. Add UI controls for format-specific options.
5. Add validation and user-facing error mapping.
6. Update docs: supported formats, limits, caveats.

### Converter Quality Checklist

- [ ] Size limits are explicit.
- [ ] Unsupported content is rejected with clear reason.
- [ ] Progress can be surfaced or documented as unavailable.
- [ ] Output is validated before download exposure.
- [ ] Cancellation path does not leak memory.

## Error Handling Standards

Error messages should be structured and actionable.

| Error code | User message style | Developer note |
|---|---|---|
| `unsupported_format` | “This file format is not supported yet.” | Include accepted formats |
| `file_too_large` | “This file is larger than the current limit.” | Include current limit and docs link |
| `conversion_failed` | “Conversion failed. Please retry.” | Attach non-sensitive diagnostics |
| `worker_unavailable` | “Processing is temporarily unavailable in this browser.” | Offer browser guidance |

Never expose raw stack traces in normal UI.

## UI and Accessibility Rules

- Label file inputs and action buttons clearly.
- Keep keyboard navigation complete for conversion flow.
- Announce progress and completion in accessible way.
- Maintain readable contrast and predictable focus order.

Performance and accessibility are both release requirements.

## Dependency Hygiene

- Prefer stable, maintained libraries for format conversion.
- Minimize heavy transitive dependencies.
- Review licenses for compatibility.
- Track high-risk packages in a maintainers list.

For security-sensitive parser libraries, document why each dependency is trusted.

## Documentation Responsibilities

Every functional change should include doc updates when relevant:

- New format support or changed limits.
- New network behavior.
- Changed privacy implications.
- Operational behavior changes.

Treat docs as part of the feature, not an afterthought.

## AGPLv3 Expectations for Contributors

This project follows AGPLv3-oriented practices. Contributor responsibilities include:

- Keep source changes publishable and buildable.
- Avoid introducing opaque proprietary-only runtime dependencies without clear policy decision.
- Ensure user-facing network deployments can satisfy corresponding source requirements.
- Preserve copyright notices and license headers where required.

When unsure, raise licensing implications during PR review early.

## Pull Request Workflow

1. Create focused branch for one logical change.
2. Keep commits understandable and scoped.
3. Include rationale in PR description.
4. Note privacy, security, and ops impact explicitly.
5. Request review from relevant maintainers.
6. Resolve feedback with clear follow-up commits.

### PR Template Expectations

- Summary of behavior change.
- User impact.
- Risk level.
- Rollback plan.
- Documentation updates.
- AGPLv3/network source-availability impact (if any).

## Code Review Guidance

Reviewers should prioritize:

- Correctness of conversion behavior.
- Security and privacy impact of new paths.
- Performance regressions in main thread.
- Reliability under cancellation and malformed inputs.
- Clarity and maintainability of worker contracts.

Style issues are secondary to safety and correctness.

## Troubleshooting Quick Reference

| Symptom | Likely cause | First action |
|---|---|---|
| UI freezes during conversion | Work running on main thread | Move heavy logic to worker |
| Conversion fails on large files | Memory pressure or size limit | Check limits and chunking strategy |
| Output download corrupted | Incorrect encoding or incomplete buffer flush | Validate output assembly path |
| Inconsistent behavior across browsers | API compatibility gap | Add browser-specific guard/fallback |

## Development Checklists

### Feature Checklist

- [ ] Local-first assumption preserved.
- [ ] Worker protocol updated and documented.
- [ ] Error states mapped to clear user messages.
- [ ] Accessibility impact reviewed.
- [ ] Docs updated in `docs/`.

### Pre-Merge Checklist

- [ ] Reviewer comments addressed.
- [ ] Risk and rollback notes added.
- [ ] Privacy/security impact explicitly stated.
- [ ] AGPLv3 implications reviewed for network-facing behavior.

## Long-Term Maintenance Practices

- Periodically revisit conversion limits based on real-world usage.
- Remove legacy format adapters that are unsafe or unused.
- Keep worker interfaces stable; version when breaking.
- Record significant architecture decisions in ADR-style notes.

A high-quality converter app depends on disciplined engineering more than raw feature count. Favor robustness, transparency, and user trust in every change.
