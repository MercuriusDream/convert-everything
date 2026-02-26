# Architecture

## 1. Architectural context

Convert Everything is a single-page React application built with Vite. The architecture intentionally keeps core conversion logic on the client side and composes functionality through two systems:
- A format graph engine in `src/formats.js`.
- A modular converter registry in `src/converters/`.

The design goal is to support many transformation patterns while preserving one cohesive runtime shell.

## 2. Technology stack

Runtime and build components in this repository:
- React 19 for UI and state-driven rendering.
- Vite 7 for development server, bundling, and optimized build output.
- Browser APIs for clipboard, file handling, local storage, and Web Crypto.
- `@ffmpeg/ffmpeg` and `@ffmpeg/util` for media conversion workflows.
- `pdf-lib` for PDF composition/manipulation workflows.
- `qrcode` for QR generation workflows.

Vite configuration details from `vite.config.js`:
- Manual chunk splitting for `pdf-lib` and `qrcode`.
- `optimizeDeps.exclude` for ffmpeg packages.
- Increased chunk warning threshold.

## 3. High-level component topology

Main app shell composition:
- `src/main.jsx` mounts `App` under `ToastProvider`.
- `src/App.jsx` orchestrates mode routing, URL sync, global keyboard behavior, and drag/paste routing.
- `src/components/ConvertPanel.jsx` executes conversion workflows and renders primary interaction surfaces.
- `src/components/ToolPicker.jsx` provides converter discovery and category filtering.
- `src/components/History.jsx` exposes local history recall.
- `src/components/KeyboardHelp.jsx` documents shortcut affordances.
- `src/components/ErrorBoundary.jsx` contains converter runtime failures at the panel level.

Supporting logic:
- `src/formats.js` defines format graph nodes and conversion edges/functions.
- `src/converters/index.js` combines category modules into one registry.
- `src/history.js` provides persisted local history operations.
- `src/hooks/useTheme.js` handles theme state and theme-color updates.

## 4. Execution modes

### 4.1 Format graph execution

Flow summary:
1. User selects `from` and `to` format IDs.
2. `ConvertPanel` resolves conversion function via `getConvertFn(from, to)`.
3. Conversion runs on input change (or line-by-line in batch mode).
4. Output is rendered in panel and a preview is persisted in history.

Characteristics:
- Strongly suited for text and structured data transforms.
- Deterministic state encoded in URL query (`from`, `to`).
- Works without file upload in core path.

### 4.2 Tool converter execution

Flow summary:
1. User selects converter card (`?tool=<id>` route state).
2. `ConvertPanel` evaluates converter capability flags.
3. Workflow adapts for text input, file input, media processing, or generator output.
4. Output is rendered as text or downloadable file/media result.

Characteristics:
- Handles complex workflows that do not fit simple format graph edges.
- Supports file drag/drop and converter-specific parameters.
- Includes progress state and status messaging for heavier tasks.

## 5. Converter contract model

Observed converter object behavior in this codebase includes fields/flags such as:
- `id`, `name`, `category`, `description`.
- `convert` for text input/output transformations.
- `fileConvert` for file-based operations.
- Capability flags such as `acceptsFile`, `multipleFiles`, `isGenerator`, `isMediaConverter`, `showsPreview`, `hasTextInput`.

This contract allows one panel component to render many converter experiences without custom page per converter.

## 6. URL and navigation architecture

Routing is query-param based rather than path-router based.

Implemented URL contracts in `App.jsx`:
- Format mode: `?from=<formatId>&to=<formatId>`.
- Tool mode: `?tool=<converterId>`.
- Backward-compatible hash parsing: `#tool/<converterId>`.

State synchronization behavior:
- URL updates through `history.pushState` and `history.replaceState`.
- Popstate listener restores converter/format state for browser navigation.
- Optional `input` URL parameter is parsed for reuse scenarios.

## 7. Local persistence and client state

Local state is intentionally browser-scoped.

Persisted domains include:
- Theme preference (`useTheme`).
- Conversion history (`src/history.js`, max-length bounded list).
- Tip/install prompt dismissals (`App.jsx`).
- Favorite pairs and recent selections (panel and picker flows).

Architectural implications:
- Zero dependency on remote state backends.
- Good offline continuity.
- No cross-device synchronization in current model.

## 8. Input ingestion and auto-routing

The shell supports several entry patterns:
- Manual text input in format mode.
- File drag/drop at page level to auto-select suitable converter.
- Clipboard image paste to route to image conversion flow.
- Explicit converter selection through ToolPicker.

File auto-routing logic in `App.jsx` maps common MIME/name patterns to converter IDs, such as PDF page count, SVG to PNG, image resize, video to audio, and audio to MP3.

## 9. Service worker and caching architecture

Service worker (`public/sw.js`) implements a mixed strategy:
- Precache for shell essentials (`/`, `index.html`, manifest, favicon).
- Cache cleanup on activation for stale cache versions.
- Cache-first for hashed static assets.
- Network-first for navigation requests.
- Specialized cache handling for Google Fonts requests.
- Same-origin guard and non-GET bypass.

This architecture favors freshness for HTML/navigation while preserving offline resilience for static assets.

## 10. Manifest and installability

Manifest (`public/manifest.json`) provides install metadata:
- App name and short name.
- Standalone display mode.
- Theme/background colors.
- Utility-oriented categories.
- Icon definition.

Service worker registration is performed on window load in `src/main.jsx`.

## 11. Error handling and resilience

Resilience mechanisms:
- Panel-level `ErrorBoundary` to recover from converter failures.
- Converter-level try/catch handling in conversion execution paths.
- Defensive no-op behavior when clipboard or optional APIs fail.
- Explicit processing status UI for long-running converter flows.

## 12. Accessibility and UX hooks in architecture

Architectural choices that support accessibility:
- Skip-link and main landmark in app shell.
- Keyboard shortcut system at shell and panel layers.
- ARIA labels and polite live region for conversion output.
- Keyboard-operable pseudo-button surfaces for drag/drop zones and history cards.

Detailed UX/a11y analysis lives in `docs/05-accessibility-and-ux.md`.

## 13. SEO/discovery architecture constraints

This is a client-rendered SPA architecture. Discovery strengths include descriptive metadata and shareable URLs, but there is no server-side rendered converter page system in the current repo.

Detailed discovery strategy and constraints are documented in `docs/04-seo-and-discovery.md`.

## 14. Security and privacy posture (architecture perspective)

Architecture-level posture in current implementation:
- Local processing for core conversion features.
- No required backend transport for normal conversion tasks.
- Browser trust boundary for file and clipboard workflows.

Important caveats:
- localStorage is convenience persistence, not secure secret storage.
- In-browser processing can still expose sensitive data to local device/session context.

## 15. Extensibility workflow for new converters

Recommended extension path based on existing architecture:
1. Add converter entry in the relevant module under `src/converters/`.
2. Follow converter contract conventions used by existing entries.
3. Ensure category mapping aligns with `src/converters/index.js` categories.
4. Validate behavior in both light and dark themes.
5. Ensure tool mode UX remains keyboard-operable where interactive.
6. Update converter catalog documentation.

For new format graph edges:
1. Add format definitions in `src/formats.js` if needed.
2. Add conversion function entries consistent with existing graph logic.
3. Verify fallback/empty/error behavior in panel state.

## 16. Architectural risks and guardrails

### Risk: central panel complexity

`ConvertPanel.jsx` is feature-rich and carries significant interaction logic.

Guardrails:
- Keep converter contracts simple and explicit.
- Extract reusable utilities when adding new converter patterns.
- Protect stable user interactions (copy, clear, swap, history, keyboard).

### Risk: large module growth

Some converter modules are very large, which increases maintenance burden.

Guardrails:
- Split modules by domain when growth continues.
- Introduce lint or script checks for converter metadata quality.
- Keep docs synchronized with converter additions.

### Risk: inconsistent error contracts

Different converters may return errors in inconsistent phrasing.

Guardrails:
- Standardize converter output contract for errors and guidance.
- Add contributor checklist entries for input validation messages.

## 17. Summary

The current architecture is a pragmatic client-side system optimized for breadth, privacy, and workflow speed. It balances a graph-style conversion model with module-driven specialized tools, all inside one React shell with URL-based state and PWA support. The strongest next architectural improvements are consistency automation, maintainability decomposition for large converter modules, and stronger discovery-oriented structure around the converter catalog.
