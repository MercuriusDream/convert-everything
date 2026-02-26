# 12. Changelog and Release Playbook

## Purpose

This document defines how to record changes and execute releases for the Vite + React local-first converter app. It combines changelog policy, versioning semantics, release gates, operational steps, and post-release follow-through. The objective is predictable delivery with transparent user communication.

## Changelog Policy

Use a human-readable changelog maintained in-repo. Every release should have a dedicated entry linked to a version tag.

### Required Change Sections

| Section | Include |
|---|---|
| Added | New features, new converter support |
| Changed | Behavioral updates, UX refinements, policy changes |
| Fixed | Bug fixes with user-visible impact |
| Security | Security hardening, vulnerability remediation |
| Deprecated | Features planned for removal |
| Removed | Features actually removed |

Each item should explain user impact, not just internal implementation detail.

### Changelog Entry Quality Rules

- Use plain language first; technical detail second.
- Include migration notes when behavior changes.
- Reference issue/PR identifiers for traceability.
- Mark privacy or security impact explicitly.
- Call out AGPLv3/source-availability implications for hosted behavior changes.

## Versioning Strategy

Use semantic versioning as a communication contract:

- MAJOR: breaking changes requiring user migration.
- MINOR: backward-compatible feature additions.
- PATCH: backward-compatible bug fixes and low-risk updates.

### Versioning Decision Table

| Change type | Version bump |
|---|---|
| Remove or break converter options | Major |
| Add new converter format support | Minor |
| Improve performance without API change | Patch or Minor depending impact |
| Fix conversion correctness bug | Patch |
| Change telemetry defaults or privacy behavior | Minor or Major based compatibility/policy |

## Release Cadence Model

A practical cadence for this project:

- Patch releases: as needed for bug and security fixes.
- Minor releases: every 2-6 weeks depending feature flow.
- Major releases: only when migration value is clear and documented.

Avoid bundling too many unrelated high-risk changes into one release.

## Branching and Tagging

Recommended model:

- `main` for integration-ready changes.
- Optional `release/x.y` branches for stabilization.
- Tags in format `vX.Y.Z`.

Tag requirements:

- Map to exact commit used for production build.
- Link to release notes and changelog section.
- Include build metadata in release artifact records.

## Release Roles

| Role | Responsibility |
|---|---|
| Release manager | Coordinates checklist and approvals |
| Maintainer | Technical signoff and merge control |
| Security reviewer | Reviews security-sensitive deltas |
| Ops owner | Deployment, rollback, monitoring readiness |
| Docs owner | Verifies release notes and policy docs |

In smaller teams, one person can hold multiple roles, but signoff points should still be explicit.

## Pre-Release Preparation

### Scope Freeze

- Freeze feature scope at release candidate cutoff.
- Only allow bug fixes, security fixes, and release-blocking docs updates.
- Record deferred items for next cycle.

### Risk Review

- Identify changes touching conversion core, workers, or privacy behavior.
- Classify each high-risk change with mitigation plan.
- Verify rollback method for each risk cluster.

### Documentation Review

- Update supported formats and known limitations.
- Ensure privacy/security docs reflect current behavior.
- Update FAQ entries for user-visible changes.

## Release Checklist

### Build and Artifact Checklist

- [ ] Dependency lockfile is committed and current.
- [ ] Build produced from tagged commit.
- [ ] Artifact checksums captured.
- [ ] Build metadata includes version and commit SHA.

### Quality and Risk Checklist

- [ ] No unresolved critical bugs in scoped release.
- [ ] Security-sensitive changes reviewed.
- [ ] Reliability risks documented with fallback plan.
- [ ] Performance regressions assessed for major flows.

### Documentation and Communication Checklist

- [ ] Changelog entry complete and user-focused.
- [ ] Release notes drafted with upgrade guidance.
- [ ] Known issues and workarounds documented.
- [ ] AGPLv3/source-offer updates prepared if needed.

### Deployment Readiness Checklist

- [ ] Rollout strategy selected (staged or full).
- [ ] Rollback target identified.
- [ ] On-call/incident contact assigned.
- [ ] Monitoring dashboards reviewed pre-launch.

## Deployment Execution Runbook

1. Create and verify release tag.
2. Trigger CI release pipeline from tag.
3. Validate artifact integrity and metadata.
4. Deploy to staging or pre-prod gate.
5. Run smoke checks for load, conversion, and download paths.
6. Promote to production according to rollout strategy.
7. Monitor key signals during stabilization window.
8. Confirm release status and publish announcement.

## Stabilization Window Guidance

Monitor for a fixed period after release (for example 1-24 hours depending risk).

Track:

- App load success and boot errors.
- Conversion success rate by format.
- Conversion latency tail metrics.
- Browser/version-specific failure spikes.
- Support tickets and incident reports.

If severe issues appear, execute rollback quickly instead of waiting for full diagnosis.

## Rollback Playbook

Rollback is a first-class capability, not a failure.

### Rollback Triggers

- Significant conversion correctness regressions.
- Security vulnerability introduced in release.
- Major app-shell outage.
- Unacceptable crash/error spike.

### Rollback Steps

1. Declare rollback decision and responsible owner.
2. Re-point deployment to last known stable artifact.
3. Confirm recovery metrics trend toward baseline.
4. Post incident note and user communication.
5. Open follow-up issue for root cause and preventive action.

## Hotfix Workflow

Use hotfixes for urgent patch-level remediation.

- Branch from latest production tag.
- Keep diff minimal and targeted.
- Run focused review with maintainer + relevant owner.
- Release as next patch version.
- Back-merge hotfix into mainline to prevent divergence.

## AGPLv3 Release Compliance Steps

For network-provided deployments of modified versions, include:

- Source offer update tied to deployed version.
- Corresponding source availability for the running build and relevant integration logic under project policy.
- Clear mapping from deployed artifact to source revision.

Recommended release gate:

- [ ] `SOURCE_OFFER_URL` points to current version.
- [ ] Tag/revision is discoverable from release notes.
- [ ] License notices remain present in artifacts and repo.

## Release Notes Template

Use this template for consistency:

```md
## vX.Y.Z - YYYY-MM-DD

### Highlights
- ...

### Added
- ...

### Changed
- ...

### Fixed
- ...

### Security
- ...

### Upgrade Notes
- ...

### Known Issues
- ...

### AGPLv3 Source Availability
- Source: ...
```

## Changelog Entry Example (Short)

```md
## [1.9.2] - 2026-02-20

### Fixed
- Improved worker recovery when conversion is cancelled under memory pressure.

### Security
- Hardened CSP by removing legacy `unsafe-inline` fallback.

### Changed
- Updated progress state transitions for clearer retry behavior.
```

## Deprecation and Removal Policy

Deprecation should be announced before removal unless security urgency requires immediate action.

Policy:

- Mark deprecated behavior in changelog and docs.
- Provide migration guidance.
- Remove in next major release unless emergency conditions apply.

## Post-Release Retrospective

For significant releases, run a short retrospective covering:

- What went well in release execution.
- What slowed delivery or increased risk.
- Which checklist items were missing or unclear.
- Which automation could reduce manual error next cycle.

Capture improvements directly in this playbook to keep it living.

## Anti-Patterns to Avoid

- Releasing from untagged or untraceable commits.
- Skipping changelog details for “small” behavior changes.
- Ignoring AGPLv3/source-offer updates during hosted rollouts.
- Delaying rollback due to sunk-cost bias.
- Mixing major refactors and urgent hotfixes in one release.

## Exit Criteria

A release process is healthy when:

- Users can understand what changed and why.
- Teams can map deployed behavior to source quickly.
- Rollbacks are fast and practiced.
- Changelog entries are consistent and useful.
- AGPLv3 obligations are addressed as standard release work, not afterthought.

