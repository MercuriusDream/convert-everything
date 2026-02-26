# 08. Deployment and Operations

## Purpose

This document defines how to deploy and operate the Vite + React local-first converter app across environments. Even though conversion is browser-local, production quality still depends on repeatable builds, hardened static hosting, predictable rollout behavior, and clear incident procedures. The intent is to make deployment boring, auditable, and fast to recover.

## Operating Model Overview

The application is primarily a static frontend with optional supporting services such as telemetry ingestion, update manifest delivery, status page, and documentation hosting. The default architecture should assume no file-content backend processing. Any optional server-side feature must be treated as an extension and documented with privacy and AGPLv3 implications.

Core model:

- Build static assets with Vite.
- Publish immutable versioned bundles to CDN-backed hosting.
- Apply strict response headers at edge.
- Keep environment config explicit and minimal.
- Roll forward quickly, roll back safely.

## Environment Strategy

| Environment | Purpose | Data policy | Release source |
|---|---|---|---|
| `local` | Developer iteration | Local machine only | Any branch |
| `preview` | PR validation and review | Synthetic data only | Pull request commit |
| `staging` | Pre-release signoff | No real user telemetry unless approved | Release candidate tag |
| `production` | User-facing release | Privacy policy applies fully | Signed release tag |

Rules:

- Never test with sensitive real user files in shared environments.
- Keep staging close to production in headers, CDN settings, and feature flags.
- Preview environments may relax quotas but not core security controls.

## Build and Artifact Standards

### Required Build Inputs

- Locked dependency graph from `package-lock.json`.
- Node version pinned via tooling (`.nvmrc` or equivalent CI config).
- Environment variables declared in a versioned env schema document.

### Required Build Outputs

- Immutable hashed JS/CSS assets.
- Source map policy explicitly defined (public, private, or disabled).
- Build metadata file with commit SHA, build timestamp, app version.

### Build Integrity Practices

- Run clean install in CI for deterministic builds.
- Fail build on unresolved environment variables.
- Capture artifact checksums for release records.
- Retain at least one previous stable artifact set for rollback.

## Deployment Topologies

## Option A: Pure Static Hosting (Recommended Baseline)

- Host `dist/` on CDN-backed static platform.
- Configure edge headers for CSP, MIME sniffing, and framing protection.
- Serve HTML shell with short cache and hashed assets with long cache.

Best for: most local-first usage where conversion remains fully in-browser.

## Option B: Static App + Minimal API

- Static hosting for frontend.
- Lightweight API for telemetry or release metadata.
- Strict separation so API cannot receive file payloads unintentionally.

Best for: teams that need opt-in operational insights.

## Option C: Multi-region static + control plane

- Global static distribution.
- Centralized status/feature-flag control service.
- Strong change management for region-wide rollouts.

Best for: high-scale public distribution.

## Runtime Configuration Strategy

Runtime config should be explicit, typed, and minimal.

Recommended config keys:

| Key | Example | Notes |
|---|---|---|
| `APP_ENV` | `production` | Drives diagnostics verbosity |
| `APP_VERSION` | `1.8.0` | Surface in UI and telemetry |
| `ENABLE_TELEMETRY` | `false` | Default conservative value |
| `TELEMETRY_ENDPOINT` | `https://telemetry.example.com/v1` | Only if telemetry enabled |
| `DOCS_URL` | `https://docs.example.com` | External docs reference |
| `SOURCE_OFFER_URL` | `https://example.com/source` | Supports AGPLv3 obligations |

Never place secrets in Vite client-exposed env vars. If a value is required at build time and sensitive, redesign architecture.

## Security Headers and Edge Policy Baseline

| Header | Baseline |
|---|---|
| `Content-Security-Policy` | `default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Disable unused browser capabilities |
| `Cross-Origin-Resource-Policy` | `same-origin` where feasible |

Keep header policy in version control and review changes as code.

## Release Flow

1. Create release branch or tag from tested mainline.
2. Build artifacts in CI with locked dependencies.
3. Deploy to staging and run manual smoke checklist.
4. Confirm privacy-impact changes against documentation.
5. Publish production deployment with progressive rollout where platform supports it.
6. Monitor metrics and error rates for a fixed stabilization window.
7. Publish release notes and AGPLv3 source offer update.

## Progressive Rollout Guidance

- Start with 5-10% traffic when possible.
- Watch error categories by browser family.
- Increase to 50% once critical signals are stable.
- Complete rollout only after conversion success rate remains within target.

For static platforms without traffic splitting, use controlled DNS/alias promotion with quick rollback plan.

## Operational Monitoring

Even local-first apps need operational visibility.

Monitor at minimum:

- Asset availability and cache hit ratio.
- Frontend load errors by version.
- Conversion failure category trends (opt-in telemetry).
- Browser/version crash signals.
- Deployment frequency and rollback frequency.

### Alerting Priorities

| Priority | Trigger | Response expectation |
|---|---|---|
| P1 | App shell unavailable globally | Immediate rollback or fix |
| P2 | Conversion failure spike in major format | Mitigate within same day |
| P3 | Minor regression in long-tail browser | Triage next business cycle |

## Incident Response Runbook

When production reliability or security degrades:

1. Assign incident lead and communication owner.
2. Freeze non-essential deploys.
3. Identify blast radius by version, browser, and geography.
4. Execute mitigation (feature flag, converter disable, rollback).
5. Post user-facing status update with workaround.
6. Validate recovery metrics and error trend normalization.
7. Publish post-incident summary with prevention actions.

Keep incident docs blameless and action-oriented.

## Backup and Retention

For static local-first frontend:

- Retain multiple recent production artifact sets.
- Retain deployment metadata (tag, SHA, timestamp, operator).
- Retain infrastructure config snapshots (headers, routing, redirects).

For optional telemetry backends:

- Define retention windows and deletion workflow.
- Enforce minimal collection and privacy-safe aggregation.
- Document data lifecycle and legal basis where applicable.

## AGPLv3 Operational Compliance

If the app is modified and provided to users over a network, AGPLv3 obligations apply. Operations must include:

- Visible source offer link in app footer/help or equivalent user-facing path.
- Corresponding source availability for deployed version, including build scripts and integration glue needed to run it.
- Version mapping between deployed artifact and source repository tag/commit.

Recommended release gate:

- [ ] Source offer link points to current deploy.
- [ ] Tag or commit for deployed version is public/available per policy.
- [ ] Any hosted extensions affecting behavior are documented.

## Operations Checklists

### Pre-Deploy Checklist

- [ ] CI build is green and artifact checksums recorded.
- [ ] Header policy diff reviewed.
- [ ] Privacy-impacting config reviewed.
- [ ] Rollback target identified.
- [ ] On-call aware of deployment window.

### Post-Deploy Checklist

- [ ] App load success rate stable.
- [ ] Conversion success rate within target range.
- [ ] No unexpected new error categories.
- [ ] Source offer and release notes published.
- [ ] Incident-free stabilization period completed.

## Capacity and Cost Considerations

For a local-first converter, most compute cost is shifted to client devices. Operational costs are mostly:

- CDN egress for static assets.
- Optional telemetry ingestion and storage.
- Build pipeline minutes and artifact retention.

Optimization priorities:

- Reduce bundle size to lower egress and user load time.
- Avoid unnecessary polling for status/update endpoints.
- Compress assets and leverage immutable caching.

## Change Management Expectations

All operationally meaningful changes should be tracked by pull request with clear labels:

- `ops-header-change`
- `ops-deploy-pipeline`
- `privacy-impact`
- `agpl-source-offer`

This improves auditability and keeps deployment behavior aligned with user expectations.

## Exit Criteria

Operations for this app are considered production-ready when:

- Deployments are repeatable and documented.
- Rollback is fast and tested in practice.
- Monitoring catches material regressions quickly.
- Security headers and privacy posture are consistently enforced.
- AGPLv3 source-availability commitments are operationalized.

