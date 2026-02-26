# 07. Performance and Reliability

## Purpose

This document defines performance and reliability expectations for the Vite + React local-first converter app. Because conversion happens in the browser, user trust depends on responsive interaction, predictable completion times, and graceful behavior on constrained devices. Reliability here means more than uptime; it includes not freezing the tab, preserving user progress, and giving actionable failure states.

## Service Goals and User-Centered Targets

| Category | Target | Notes |
|---|---|---|
| Initial app load (cached assets, broadband) | < 1.5s to interactive | Measured on modern desktop browser |
| Initial app load (uncached, typical mobile) | < 4.0s to interactive | Includes JS parse and hydration |
| Time to first preview for small files | < 2.0s | Under nominal CPU conditions |
| Conversion completion for medium files | < 8.0s | Format-dependent, measured by profile suite |
| UI input responsiveness | < 100ms interaction delay | During conversion and idle states |
| Crash-free sessions | >= 99.5% | Based on opted-in telemetry samples |

Targets should be published as user-oriented promises and reviewed each release.

## Performance Architecture

The app’s performance model relies on four design choices:

1. Local-first processing in the browser to avoid upload latency.
2. Worker-based conversion to protect the main thread.
3. Lazy loading of heavy converters and optional formats.
4. Predictable state management to avoid unnecessary React re-renders.

### Main Thread Budget

Main thread responsibilities should remain limited to:

- UI rendering and event handling.
- Dispatching conversion jobs to workers.
- Progress reporting and cancellation controls.
- Lightweight preview rendering.

Any heavy parse, encode, decode, or compression operation belongs in workers.

### Code-Splitting Strategy

- Keep initial bundle focused on shell experience.
- Load converter modules on demand by chosen format.
- Prefer route-level and feature-level splits.
- Avoid importing large optional dependencies in shared entry points.

Track budget per chunk and enforce warnings when new chunk size exceeds threshold.

## Reliability Model

Reliability in a local-first app is about predictable behavior under unstable client conditions.

### Expected Failure Modes

- Low memory on mobile leading to worker termination.
- Corrupted input files causing parser exceptions.
- Browser API inconsistencies across engines.
- Long conversions prompting user navigation or tab suspension.
- Partial output creation when conversion is cancelled mid-run.

### Required Reliability Behaviors

- Fail fast with understandable error categories (`unsupported_format`, `file_too_large`, `conversion_failed`).
- Never block entire UI when a single conversion fails.
- Support explicit cancel and cleanup for in-flight jobs.
- Preserve user-selected options across recoverable failures.
- Provide deterministic retry path with minimal clicks.

## Performance Engineering Practices

## 1. Measurement Baseline

- Define canonical test dataset by file type and size tiers.
- Measure cold load, warm load, conversion time, memory peak, and output size.
- Track desktop and mobile profiles separately.
- Keep historical benchmark snapshots in repository docs.

## 2. Rendering Efficiency

- Use memoization only when profiling proves benefit.
- Avoid global state updates for per-job progress noise.
- Batch UI updates for high-frequency worker progress events.
- Virtualize long history lists when session state grows.

## 3. Worker Pipeline Optimization

- Reuse worker instances where safe to reduce startup cost.
- Use transferable objects for large binary data to avoid copies.
- Stream processing for large files when converter supports it.
- Abort conversion via `AbortController` or explicit worker command path.

## 4. Memory Management

- Revoke object URLs after download/preview completion.
- Avoid storing full binary payloads in React state.
- Clear temporary buffers after conversion or cancellation.
- Guard against duplicate retention of source and output in memory.

## 5. Network and Asset Delivery

Even local-first apps serve static assets and optional updates:

- Use immutable hashed asset filenames.
- Set long cache TTL for versioned assets.
- Use short cache TTL for manifest and HTML shell.
- Keep source maps protected or access-controlled when needed.

## Reliability Engineering Practices

## 1. Conversion Job Lifecycle

| Stage | Required behavior |
|---|---|
| Queued | UI shows pending status and cancel affordance |
| Running | Periodic progress updates with estimated remaining work if available |
| Completed | Output validated, download action enabled, temporary resources cleaned |
| Failed | Error category shown with remediation steps |
| Cancelled | Worker cleanup and consistent UI reset |

## 2. Idempotent UI Actions

- Multiple clicks on convert should not spawn duplicate jobs unless explicitly supported.
- Retry should create a new isolated job with cleared stale buffers.
- Download actions must not regenerate output unexpectedly.

## 3. Resilience Under Interruptions

- If tab visibility changes, keep progress state coherent.
- If worker crashes, detect and recreate worker with clear message.
- If storage quota is exceeded, fall back to memory-only mode and notify user.

## 4. Graceful Degradation

- If advanced converter unavailable, offer fallback format path.
- If WebAssembly unsupported, show clear limitation with browser guidance.
- If telemetry endpoint blocked, app behavior must remain unaffected.

## Observability and Diagnostics

Because this is local-first, observability must avoid privacy leakage.

Collect only minimal technical signals when opted in:

- Conversion duration bucket.
- File size bucket (not exact value if not needed).
- Error code category.
- Browser family and app version.
- Memory pressure indicators where supported.

Never collect raw file content or decoded text output.

### Reliability Dashboard Metrics

| Metric | Why it matters |
|---|---|
| Success rate by format | Detect format-specific regressions |
| P95 conversion time | Captures tail latency pain |
| Cancelled job rate | May indicate poor UX or long operations |
| Worker crash rate | Detects runtime instability |
| OOM-related failure proxy | Flags memory pressure on real devices |

## Operational SLO Review Loop

- Weekly: review regressions in success rate and P95 conversion time.
- Per release candidate: compare benchmark suite against previous stable.
- Monthly: refresh representative sample files and device matrix.
- Quarterly: reassess performance budgets for newly added converters.

## AGPLv3 Considerations for Reliability Tooling

If hosted instances add server-assisted reliability features (remote queue, cloud conversion fallback, telemetry ingestion), AGPLv3 obligations around corresponding source availability apply. Operational tooling that materially affects user-facing behavior should be tracked in repository documentation and made reproducible.

## Release Readiness Checklist

- [ ] Bundle size budget respected for app shell and converter chunks.
- [ ] No new main-thread long tasks above agreed threshold.
- [ ] Benchmark suite run on representative desktop and mobile targets.
- [ ] Error taxonomy unchanged or documented migration added.
- [ ] Worker crash recovery path manually validated.
- [ ] Cancellation path tested for all major converters.
- [ ] Privacy-safe telemetry checks confirmed.
- [ ] AGPLv3 source availability implications reviewed for new hosted components.

## Reliability Playbook for Incidents

When reliability degrades after a release:

1. Freeze non-essential feature merges.
2. Classify incident by scope (single format, browser-specific, global).
3. Roll out feature flag or temporary converter disablement if needed.
4. Publish user-visible status note with workaround.
5. Ship patch and monitor recovery metrics.
6. Record root cause and prevention actions in changelog.

## Long-Term Improvement Backlog

Recommended ongoing investment areas:

- Incremental conversion APIs for very large files.
- Progressive previews before full conversion completes.
- Device-adaptive conversion strategies by memory/CPU class.
- Better cancellation semantics for deeply nested parser pipelines.
- Deterministic reproducibility harness for cross-browser converter differences.

Reliability is product quality. For a converter app, users value predictable completion and privacy-preserving speed over feature count alone.

