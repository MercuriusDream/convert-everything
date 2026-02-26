# 11. FAQ

## Product and Local-First Model

### 1. What does “local-first converter” mean?
It means file conversion happens in your browser by default. The app is designed so your source files do not need to be uploaded to a remote server for normal use.

### 2. Are my files sent to the cloud automatically?
No, not in the default local-first flow. If a feature requires network activity, it should be explicit in the UI and documented.

### 3. Why use Vite + React for this app?
Vite gives fast local development and efficient production bundles. React provides predictable UI composition for complex conversion workflows.

### 4. Does local-first guarantee zero risk?
No. It reduces a major class of data exposure risk, but malicious files, browser vulnerabilities, and dependency issues still need controls.

### 5. Can I use the app offline?
Usually yes after assets are loaded, depending on caching strategy and whether optional online features are enabled.

### 6. Why does conversion sometimes feel slower on mobile?
Mobile devices have lower CPU and memory budgets. Large files and heavy formats can increase processing time or fail due to memory limits.

### 7. Why keep conversion in Web Workers?
Workers keep heavy processing off the main thread, so the UI remains responsive during conversion.

### 8. Does the app support every file format?
No converter supports every format safely. The app should document supported formats and known limitations clearly.

### 9. Why are there file size limits?
Size limits protect reliability, memory usage, and user experience, especially on constrained devices.

### 10. Can I batch convert many files at once?
It depends on implementation settings and device capacity. Batch behavior should include queueing, cancellation, and clear progress state.

## Privacy and Data Handling

### 11. What data is stored locally?
Usually user preferences, recent settings, and temporary conversion state. Sensitive source content should remain in memory unless user explicitly saves output.

### 12. Do you collect analytics?
Only if telemetry is implemented and enabled according to policy. Privacy-safe telemetry should avoid raw file content.

### 13. What telemetry is acceptable in a local-first app?
High-level metrics like conversion duration buckets, error categories, and app version. Not raw source file contents.

### 14. Is filename collection allowed?
Only if necessary and privacy-reviewed. Prefer hashing or coarse metadata when possible.

### 15. Can users opt out of telemetry?
Yes, telemetry should be optional where policy or law requires consent and opt-out controls.

### 16. What about crash reporting?
Crash reporting can be useful, but it must be privacy-safe and clearly disclosed.

### 17. How long is telemetry retained?
Retention should be explicitly documented, commonly short windows such as 30-90 days for operational metrics.

### 18. Are converted outputs retained by the app?
By default, outputs should remain local to the user session unless the user downloads or stores them intentionally.

### 19. Is personal data ever required to use the app?
A local-first converter generally should not require personal account data for core conversion flows.

### 20. How do privacy claims stay trustworthy?
Claims must match code behavior, docs, and deployment config. Privacy language should be validated during release.

## Security and Trust

### 21. What are the biggest security risks?
Malformed file parsing, dependency supply-chain compromise, XSS/injection, and deployment misconfiguration.

### 22. How is XSS risk reduced?
Use strict CSP, avoid unsafe inline scripts, sanitize UI rendering paths, and keep dependencies current.

### 23. Why does MIME type checking alone not work?
MIME can be wrong or spoofed. Robust handling combines extension checks, header inspection, and parser safeguards.

### 24. Are WebAssembly modules safe by default?
No runtime is risk-free. WASM assets still require provenance checks, integrity controls, and cautious update policies.

### 25. How should errors be shown?
Use user-readable error categories without exposing raw stack traces or sensitive internal details.

### 26. What happens if a worker crashes?
The UI should detect it, report a meaningful message, and allow retry with fresh worker state.

### 27. How often should dependencies be reviewed?
At least weekly triage for vulnerabilities and before every release for critical packages.

### 28. What is a secure default for telemetry?
Off by default unless there is explicit consent and clear policy justification.

### 29. Should source maps be public?
It depends on operational policy. If exposed, evaluate security tradeoffs; if private, ensure debugging workflow remains practical.

### 30. Why document security checks in PR templates?
Because reliable security depends on repeatable process, not only individual expertise.

## Performance and Reliability

### 31. What does good performance mean for this app?
Fast load, responsive UI during conversion, predictable completion times, and graceful failures on low-end devices.

### 32. Why is bundle size important if conversion is local?
Large bundles hurt startup time and mobile usability. Local-first still depends on efficient asset delivery.

### 33. Why are conversions sometimes inconsistent across browsers?
Different browser engines implement APIs and memory behavior differently. Compatibility guards and fallbacks are necessary.

### 34. Can users cancel conversions?
They should be able to. Cancellation is a core reliability feature, not a nice-to-have.

### 35. Why measure P95 conversion time?
Tail latency reflects real user pain better than average values.

### 36. What is graceful degradation here?
If a feature is unavailable, the app should provide fallback behavior or a clear limitation message instead of crashing.

### 37. Why track failure categories instead of only total failures?
Category-level tracking accelerates root-cause analysis and remediation.

### 38. What should happen after a failed conversion?
The app should preserve user context, provide remediation guidance, and allow quick retry.

### 39. Is perfect reliability possible?
No, but disciplined architecture and release gates can make failures rare and recoverable.

### 40. Why maintain benchmark datasets?
Consistent datasets prevent accidental performance regressions from hiding behind variable test inputs.

## Deployment and Operations

### 41. Is this app backend-free?
Core conversion can be backend-free. Optional services may still exist for docs, telemetry, or status pages.

### 42. What is the safest deployment baseline?
Static hosting with strict security headers, immutable asset caching, and minimal runtime config.

### 43. How should releases be rolled out?
Use staged rollout where possible, monitor early, and keep rollback artifacts ready.

### 44. What should trigger rollback?
Severe load failures, conversion failure spikes, or confirmed security regressions.

### 45. Why keep header policy in version control?
So security posture changes are reviewable and auditable like code changes.

### 46. Do local-first apps still need incident response?
Yes. Operational incidents can still affect availability, trust, and user safety.

### 47. How much monitoring is enough?
Enough to detect material regressions quickly without collecting unnecessary personal data.

### 48. What operational metrics matter most?
Availability of app shell, conversion success rate, error category trends, and crash indicators.

### 49. Why keep deployment metadata?
To map a running version to a source commit and accelerate rollback and debugging.

### 50. Are preview environments optional?
They are not strictly required, but they significantly reduce production risk.

## Governance, Contribution, and Licensing

### 51. How do I start contributing?
Read the docs, pick a scoped issue, submit a focused PR, and include risk/privacy notes.

### 52. Why require documentation updates in feature PRs?
Because docs are part of product behavior and team memory, especially for security and operations.

### 53. What if I disagree with a maintainer decision?
Use the documented decision process, present alternatives with evidence, and escalate respectfully if needed.

### 54. Why is AGPLv3 mentioned so often?
Because network deployment of modified versions can trigger source-availability obligations that must be operationally handled.

### 55. What does AGPLv3 “corresponding source” imply for operators?
Operators should be prepared to provide the source for the deployed version, including relevant build and integration logic under project policy.

### 56. Does AGPLv3 block commercial use?
The license does not automatically block commercial use, but it imposes distribution and source-availability obligations that must be understood.

### 57. Should contributors worry about license compatibility?
Yes. New dependencies and integrations should be reviewed for license compatibility and policy fit.

### 58. Who approves high-risk changes?
Typically maintainers plus relevant domain owners such as security and operations roles.

### 59. Why require rollback notes in PRs?
Because safe delivery includes a clear path to recover when assumptions fail.

### 60. What is the best way to keep quality high over time?
Enforce small PRs, explicit review standards, disciplined release gates, and continuous documentation upkeep.

## Practical Usage Questions

### 61. Why did my conversion output look different than expected?
Formats may have lossy transformations or feature mismatch. Check converter-specific caveats and settings.

### 62. Can I trust conversion for regulated documents?
Use caution. Validate outputs against your domain requirements and maintain human review when stakes are high.

### 63. What should I do if a file consistently fails?
Check supported format/version, reduce size if possible, and report a sanitized reproducible case.

### 64. Why does retry sometimes work?
Transient browser resource pressure or temporary worker state issues can be resolved by fresh execution.

### 65. Should I keep multiple tabs open for heavy conversions?
It depends on device memory. Multiple heavy jobs can increase failure rates on constrained systems.

### 66. Can I automate conversion in scripts?
If automation endpoints are added, they should follow the same local-first and privacy guarantees with clear documentation.

### 67. Is output quality always deterministic?
Not always across browsers and versions; deterministic behavior should be tested and documented per format.

### 68. How can teams evaluate update risk?
Review changelog impact sections, test representative files, and stage rollout before broad release.

### 69. What should enterprises ask before adoption?
Ask about privacy defaults, telemetry controls, incident process, AGPLv3 compliance workflow, and long-term maintenance policy.

### 70. Where should unresolved questions go?
Open a documented issue with context, expected behavior, and reproducible details.

