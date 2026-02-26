# 10. Governance and Contributing

## Purpose

This document explains how decisions are made, how contributions are reviewed, and how maintainers keep the Vite + React local-first converter app healthy over time. Good governance is not bureaucracy for its own sake. It is the minimum structure needed to protect users, sustain contributors, and preserve technical quality.

## Governance Goals

- Keep the project aligned with its local-first privacy promise.
- Make decision paths clear and auditable.
- Provide fair, fast contribution flow for external and internal contributors.
- Ensure legal and operational duties, including AGPLv3 obligations, are consistently met.

## Project Roles

| Role | Responsibilities | Decision scope |
|---|---|---|
| Maintainer | Merge/reject PRs, release approvals, incident decisions | Final call on technical roadmap |
| Reviewer | Technical review and risk identification | Approve within owned area |
| Contributor | Propose and implement changes | No unilateral release authority |
| Security champion | Security triage, policy updates, disclosure coordination | Security block/allow recommendations |
| Operations owner | Deployment config, rollback safety, incident operations | Production rollout readiness |

One person may hold multiple roles in small teams, but responsibilities must still be explicit.

## Decision Framework

Use this default model:

1. Proposal in issue or PR with context and alternatives.
2. Review period for maintainers and domain owners.
3. Decision with rationale recorded in thread.
4. Follow-up documentation updates.

### Decision Categories

| Category | Example | Approval requirement |
|---|---|---|
| Routine | UI text change, minor refactor | One maintainer |
| Significant | New converter format, major dependency | Two reviewers including domain owner |
| High-risk | Security model change, telemetry expansion | Maintainer + security champion + ops owner |
| Policy/legal | License interpretation, source-offer mechanism | Maintainers and legal-informed policy owner |

## Contribution Principles

- Small, focused pull requests merge faster and safer.
- Every behavior change should include rationale.
- Local-first privacy posture is a non-negotiable baseline unless governance explicitly approves a deviation.
- Security and reliability concerns override schedule pressure.

## Required Contribution Workflow

1. Open or reference an issue describing the problem and expected outcome.
2. Create a focused branch.
3. Implement change with clear commit history.
4. Update documentation alongside code changes.
5. Submit PR with risk, rollback, and user impact notes.
6. Address review comments and finalize approval.

### Pull Request Required Sections

- Problem statement.
- Summary of approach.
- User-facing behavior changes.
- Security/privacy implications.
- Performance/reliability implications.
- Operations/deployment implications.
- AGPLv3/source-availability implications when network behavior is affected.

## Review Standards

Reviewers should prioritize defect prevention over stylistic preference.

### Primary Review Questions

- Is behavior correct for normal and malformed input?
- Does this preserve local-first expectations?
- Does this add risk in worker messaging, parsing, or browser APIs?
- Are failure states understandable and recoverable?
- Is rollout risk manageable and documented?

### Secondary Review Questions

- Is code readable and maintainable?
- Is naming consistent?
- Are docs updated?

## Security and Privacy Governance Hooks

Any PR that changes file handling, telemetry, worker execution, or external requests must include a dedicated security/privacy section in the PR description.

Minimum checks:

- [ ] No unintended new upload path.
- [ ] No logging of raw user file content.
- [ ] Input size and type limits remain explicit.
- [ ] Error handling remains privacy-safe.

Escalate to security champion when uncertain.

## AGPLv3 Governance Policy

This project follows AGPLv3-oriented distribution expectations. Governance implications:

- Contributors must not introduce changes that make network-deployed versions impossible to provide with corresponding source.
- Release decisions must include source availability readiness.
- If a hosting integration materially affects user-facing behavior, related source and build instructions should remain accessible under project policy.

Governance gate for release:

- [ ] Deployed version maps to identifiable source revision.
- [ ] Source-offer path is current and discoverable.
- [ ] License notices are intact.

## Documentation Governance

Documentation is a first-class artifact. Changes should be reviewed like code when they affect policy, user promises, or operational procedures.

Required update triggers:

- Security/privacy behavior changes.
- Supported format list changes.
- Deployment workflow changes.
- Release policy changes.

## Conflict Resolution

When disagreement occurs:

1. Re-state problem and constraints in writing.
2. Compare alternatives with risk/benefit framing.
3. Prefer reversible decisions where uncertainty is high.
4. Maintainer decides if consensus is not reached in review window.
5. Record final rationale for future reference.

Keep discussion technical and respectful.

## Release Governance

No release should proceed without explicit acknowledgement from relevant owners.

| Gate | Owner | Required outcome |
|---|---|---|
| Code readiness | Maintainer | Critical blockers resolved |
| Security/privacy | Security champion | No unresolved high-risk findings |
| Operations | Ops owner | Rollout and rollback readiness confirmed |
| Documentation | Release manager or maintainer | Notes and policy docs updated |

## Issue Triage and Prioritization

Use labels and response expectations:

| Priority | Description | Response target |
|---|---|---|
| Critical | Security or severe conversion breakage | Same day |
| High | Major user-facing reliability issue | 1-2 business days |
| Medium | Important but non-blocking defects | Weekly triage |
| Low | Nice-to-have improvements | Backlog grooming |

Public issue hygiene matters. Close stale issues with rationale, not silence.

## Onboarding for New Contributors

New contributors should complete:

- Read architecture docs and this governance file.
- Submit first PR in low-risk area.
- Pair with reviewer for first non-trivial feature.
- Demonstrate understanding of privacy and local-first constraints.

This short onboarding path reduces regressions and review friction.

## Maintainer Responsibilities

Maintainers are accountable for:

- Technical direction and release quality.
- Transparent decisions and respectful review culture.
- Timely handling of security disclosures.
- Ensuring AGPLv3 obligations are not ignored during fast releases.

Maintainers should avoid becoming single points of failure by sharing context and rotating release responsibilities.

## Governance Checklists

### Monthly Governance Health Checklist

- [ ] Open issues triaged and categorized.
- [ ] No stuck PRs without response.
- [ ] Security backlog reviewed.
- [ ] Release cadence sustainable.
- [ ] Contributor experience pain points documented.

### Quarterly Governance Review Checklist

- [ ] Decision framework still effective.
- [ ] Role assignments still accurate.
- [ ] AGPLv3/source-offer workflow still operational.
- [ ] Documentation coverage still aligned with product reality.

## Code of Conduct Alignment

Governance assumes professional collaboration standards:

- Focus on ideas and evidence, not individuals.
- Keep criticism specific and actionable.
- Escalate harassment or abuse immediately to maintainers.

A stable contributor community is a technical asset, not a social extra.

## Exit Criteria

Governance is healthy when:

- Contributors can predict how decisions are made.
- Reviews catch high-risk changes before release.
- Release gates are followed consistently.
- Security, privacy, and AGPLv3 obligations are handled as routine process, not last-minute firefighting.

