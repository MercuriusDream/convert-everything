<p align="center">
  <img width="1500" height="500" alt="CONVERT_EVERYTHING" src="https://github.com/user-attachments/assets/9da9ee87-3c34-4b2d-98f7-dc188f9a5bf0" />
</p>

<p align="center">
  <a href="https://github.com/MercuriusDream/convert-everything/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-AGPL--3.0-blue" alt="License" /></a>
  <a href="https://github.com/MercuriusDream/convert-everything/actions"><img src="https://img.shields.io/github/actions/workflow/status/MercuriusDream/convert-everything/deploy.yml?label=deploy" alt="Deploy Status" /></a>
  <img src="https://img.shields.io/badge/react-19-61dafb?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/vite-7-646cff?logo=vite&logoColor=white" alt="Vite 7" />
  <img src="https://img.shields.io/badge/bun-%E2%89%A51.3-f9f1e1?logo=bun&logoColor=black" alt="Bun" />
  <img src="https://img.shields.io/badge/PWA-ready-5a0fc8?logo=pwa&logoColor=white" alt="PWA Ready" />
</p>

<p align="center">
  A browser-based conversion toolkit — 200+ converters, zero servers, 100% private.
</p>

---

## Overview

Convert Everything runs **entirely in your browser**. Text encodings, data formats, unit conversions, color spaces, image ops, media transcoding, PDF tools, and developer utilities — all in one place, all offline-capable, all private.

**No uploads. No tracking. No ads.**

## Quick Start

```bash
git clone https://github.com/MercuriusDream/convert-everything.git
cd convert-everything
bun install
bun run dev
```

> Requires [Bun](https://bun.sh/) ≥ 1.3 or [Node.js](https://nodejs.org/) ≥ 18

## Stack

React 19 · Vite 7 · Vanilla CSS · pdf-lib · qrcode · FFmpeg WASM · GitHub Pages

## Documentation

Detailed documentation lives in [`docs/`](docs/):

| | |
| --- | --- |
| [Product Overview](docs/01-product-overview.md) | Mission, goals, user profiles |
| [Architecture](docs/02-architecture.md) | System design, component graph, data flow |
| [Converter Catalog](docs/03-converter-catalog.md) | Full inventory of every converter |
| [SEO & Discovery](docs/04-seo-and-discovery.md) | Meta strategy, discoverability |
| [Accessibility & UX](docs/05-accessibility-and-ux.md) | a11y, keyboard nav, responsive design |
| [Security & Privacy](docs/06-security-and-privacy.md) | Threat model, local-first guarantees |
| [Performance](docs/07-performance-and-reliability.md) | Metrics, chunking, error handling |
| [Deployment](docs/08-deployment-and-operations.md) | CI/CD, GitHub Pages, PWA |
| [Developer Guide](docs/09-developer-guide.md) | Setup, conventions, adding converters |
| [Contributing](docs/10-governance-and-contributing.md) | PR workflow, code review standards |
| [FAQ](docs/11-faq.md) | Common questions |
| [Changelog](docs/12-changelog-and-release-playbook.md) | Versioning, release process |

## Contributing

See [Contributing](docs/10-governance-and-contributing.md) and [Developer Guide](docs/09-developer-guide.md).

```bash
git checkout -b feat/my-feature
git commit -m 'feat: add my feature'
git push origin feat/my-feature
# → Open a PR
```

## License

[AGPL-3.0-only](LICENSE)
