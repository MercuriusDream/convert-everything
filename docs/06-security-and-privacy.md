# 06. Security and Privacy

## Purpose

This document defines the security and privacy baseline for the local-first converter application built with Vite and React. The app is designed so users can transform files in their own browser session without default server-side file upload. That architectural choice reduces major classes of data exposure, but it does not remove risk. We still have to handle malicious inputs, dependency vulnerabilities, browser-side attacks, and operational mistakes.

The goals of this document are:

- Define realistic threats for a local-first converter.
- Set mandatory controls for code, build, and deployment.
- Establish privacy commitments that can be tested and audited.
- Provide implementation checklists that can be used in pull requests and releases.

## Security Principles

| Principle | Why it matters | Required practice |
|---|---|---|
| Local-first by default | Minimizes data transfer risk | Convert in-browser first; no hidden upload path |
| Least privilege | Limits blast radius of compromise | Run conversion logic in dedicated workers with narrow APIs |
| Safe defaults | Most users do not change settings | Telemetry off until consent, strict CSP, blocked inline scripts |
| Defense in depth | Any one control can fail | Combine input validation, runtime isolation, and dependency hygiene |
| Explicit trust boundaries | Prevents accidental overreach | Document browser, worker, optional backend, and third-party boundaries |
| Verifiable controls | Security claims must be testable | Keep checklists, logs, and release gates tied to concrete controls |

## Threat Model Summary

Primary assets:

- User files selected for conversion.
- Derived outputs (converted files, previews, metadata).
- User settings (format preferences, recent options, language).
- Operational artifacts (build outputs, source maps, telemetry events).

Primary attacker classes:

- Opportunistic web attacker attempting XSS or script injection.
- Malicious file provider supplying crafted files to trigger parser bugs.
- Supply-chain attacker via JavaScript package ecosystem compromise.
- Misconfigured operator exposing debug endpoints or verbose logs.

### Trust Boundaries

1. Browser UI boundary: React components, routing, and user interaction.
2. Worker boundary: conversion engines, WASM modules, heavy parsing.
3. Storage boundary: IndexedDB/localStorage/sessionStorage.
4. Network boundary: optional update checks, docs links, optional telemetry.
5. Build/deploy boundary: CI pipelines, CDN, hosting headers.

Any data moving across boundaries must have explicit validation and logging policy.

## Data Classification and Handling

| Data type | Examples | Default retention | Handling rule |
|---|---|---|---|
| Highly sensitive | Personal documents, invoices, IDs | Session only unless user saves output | Never transmitted by default; no content logging |
| Sensitive metadata | Filenames, MIME type, file size | Session only | Strip or hash before telemetry |
| Operational telemetry | Error type, browser version, app version | 30-90 days if enabled | Collect only after consent and with sampling |
| Public product info | App version, changelog entry | Indefinite | May be published publicly |

Mandatory rule: file content is never sent to external services unless a user explicitly triggers a feature that requires upload and the UI shows clear consent language.

## Application Security Controls

## 1. Input and File Handling

- Validate extension and MIME type, but never trust either alone.
- Parse file headers where feasible before full processing.
- Enforce maximum file size per converter type and fail fast with clear messages.
- Use streaming or chunked parsing for large files to avoid memory spikes.
- Normalize filenames before displaying in UI to prevent script-like rendering artifacts.
- Reject double-extension tricks when feature logic depends on extension.

## 2. Browser and Runtime Hardening

- Strict Content Security Policy:
  - `default-src 'self'`
  - `script-src 'self'`
  - `object-src 'none'`
  - `base-uri 'none'`
  - `frame-ancestors 'none'`
- Disallow inline scripts and unsafe eval unless a reviewed converter engine requires it.
- Use `X-Content-Type-Options: nosniff`.
- Use `Referrer-Policy: strict-origin-when-cross-origin`.
- Use `Permissions-Policy` to disable unnecessary APIs (camera, mic, geolocation).

## 3. Worker and WASM Isolation

- Keep conversion engines in Web Workers, not in UI thread.
- Use message schema validation for all worker messages.
- Enforce command allow-list (`convert`, `cancel`, `status`) instead of arbitrary operations.
- Version and checksum WASM assets in build pipeline.
- Disable dynamic worker code generation from user input.

## 4. Dependency and Supply-Chain Security

- Pin dependency ranges for critical parser/converter libraries.
- Run dependency audit in CI and require triage before release.
- Maintain a short list of approved converter libraries with security rationale.
- Prefer mature libraries with active maintenance and clear vulnerability policy.
- Avoid abandoned transitive dependencies where alternatives exist.

## 5. Error Handling and Logging

- Never log raw file content.
- Redact filenames unless user has opted into diagnostic mode.
- Store only structured error codes and coarse metadata.
- Remove stack traces from user-facing messages.
- Keep internal logs useful enough for incident response but privacy-safe by design.

## Privacy Commitments

The product privacy model must remain understandable to non-technical users:

- Local conversion is default behavior.
- User files stay on device unless user chooses otherwise.
- Telemetry is optional and off by default where legally required.
- Privacy notice must map directly to implemented behavior.

### User Rights and Operational Readiness

If any telemetry or account-linked features exist, operations must support:

- Access requests (what data is stored).
- Deletion requests (remove user-associated records).
- Correction requests where data is user editable.
- Export requests for user-submitted profile/config data.

Even in a local-first design, do not claim “zero data collection” if crash reporting or analytics can be enabled.

## AGPLv3 and Security Transparency

This project is AGPLv3-oriented. Security and compliance implications:

- If the app is modified and provided over a network, operators must offer corresponding source under AGPLv3 terms.
- Security-relevant patches must be included in published source availability workflows.
- Deployment overlays (headers, policies, telemetry toggles) should be documented in repo so users can reproduce secure builds.

Recommended practice: keep a `SECURITY.md` and a clear source-offer link in deployed environments where AGPL obligations are triggered.

## Secure Development Checklist

Use this checklist in every pull request touching conversion, worker messaging, storage, or network behavior.

- [ ] New file type handler has explicit size limits.
- [ ] Parser errors are handled without exposing sensitive payloads.
- [ ] Worker message schemas updated and validated.
- [ ] Any new network call is documented and user-visible where relevant.
- [ ] CSP impact reviewed for new scripts/assets.
- [ ] Dependency changes reviewed for maintainer trust and CVE status.
- [ ] Privacy notice updated if data handling changed.
- [ ] AGPLv3 source-availability impact reviewed for deployment changes.

## Security Incident Response (Local-First Context)

When a vulnerability is discovered:

1. Classify severity by exploitability, data impact, and user interaction needed.
2. Reproduce with minimal private data and sanitized samples.
3. Prepare mitigation and patch with regression notes.
4. Coordinate disclosure timeline and advisory language.
5. Release patched build and publish AGPL-compliant source updates.
6. Notify operators with clear upgrade urgency and workaround steps.

For browser-only vulnerabilities, include affected browsers/versions and mitigation status per engine.

## Operational Guardrails

- Treat configuration drift as a security risk (headers, CSP, cache control).
- Keep a known-good baseline for deployment headers.
- Use immutable hashed asset names to prevent stale vulnerable bundles.
- Document emergency flag strategy for disabling risky converters quickly.

## Minimum Ongoing Review Cadence

| Area | Cadence | Owner |
|---|---|---|
| Dependency vulnerability triage | Weekly | Maintainer on duty |
| CSP/header validation | Monthly | Operations owner |
| Privacy policy to implementation diff check | Quarterly | Product + maintainer |
| Threat model refresh | Quarterly or major feature change | Security champion |
| Incident response drill | Twice per year | Maintainers |

## Exit Criteria

Security and privacy are considered release-ready only when:

- Critical findings are resolved or explicitly waived with written rationale.
- Privacy claims match actual code paths.
- Deployment configuration passes documented hardening baseline.
- AGPLv3 source-availability obligations are operationally satisfied.
