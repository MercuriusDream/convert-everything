# Converter Catalog

## 1. Purpose of this catalog

This document maps the implemented converter surface in this repository and explains how to reason about converter coverage. It is intentionally factual and anchored to source files in `src/formats.js` and `src/converters/`.

Important note:
- This is a representative implementation catalog, not a legal API contract.
- Exact converter lists should be verified against source for release-critical use.

## 2. Catalog architecture

The product exposes conversion capability through two systems:
- Format graph conversions in `src/formats.js`.
- Tool converters aggregated in `src/converters/index.js`.

The registry composition currently includes module sets:
- `textConverters`
- `qrConverters`
- `imageConverters`
- `hashConverters`
- `cryptoConverters`
- `dataConverters`
- `webConverters`
- `numberConverters`
- `colorConverters`
- `utilityConverters`
- `imageFormatConverters`
- `mediaConverters`
- `pdfConverters`

## 3. Category model used in ToolPicker

Categories exposed by `src/converters/index.js`:
- `all`
- `encode`
- `hash`
- `data`
- `number`
- `color`
- `utility`
- `image`
- `media`
- `document`

These categories are UI-level discovery facets and do not replace the format graph grouping in `src/formats.js`.

## 4. Format graph coverage (from `src/formats.js`)

The format graph defines many IDs grouped by semantic domains. Below is a representative map of implemented groups and examples.

### 4.1 Text and encoding groups

Representative format IDs:
- `text`, `base64`, `base32`, `base58`, `base64url`
- `url`, `html-ent`, `hex`, `binary`, `unicode`
- `morse`, `nato`, `rot13`, `atbash`
- `reverse`, `json-escaped`, `braille`, `piglatin`, `leetspeak`

### 4.2 Case and markup groups

Representative format IDs:
- `uppercase`, `lowercase`, `titlecase`, `camelcase`, `snakecase`, `kebabcase`
- `markdown`, `html-markup`, `plain`

### 4.3 Data interchange and structured text groups

Representative format IDs:
- `json`, `json-min`, `yaml`, `csv`, `tsv`, `xml`, `querystring`, `toml`

### 4.4 Time and hash groups

Representative format IDs:
- `timestamp`, `iso-date`, `human-date`
- `sha1`, `sha256`, `sha384`, `sha512`, `md5`

### 4.5 Number systems and scientific groups

Representative format IDs:
- Number systems: `decimal`, `numhex`, `numbin`, `numoct`, `roman`
- Data size: `bits`, `bytes`, `kilobytes`, `megabytes`, `gigabytes`, `terabytes`, `petabytes`
- Temperature: `celsius`, `fahrenheit`, `kelvin`, `rankine`
- Angle: `degrees`, `radians`, `gradians`, `turns`, `arcminutes`, `arcseconds`
- Frequency: `hz`, `khz`, `mhz`, `ghz`, `terahertz`, `rpm`
- Data rate: `bps`, `kbps`, `mbps`, `gbps`, `tbps`

### 4.6 Physical units and engineering groups

Representative format IDs:
- Length and distance: `inches`, `cm`, `mm`, `feet`, `meters`, `miles`, `km`, `yards`, `nautmiles`, `light-year`, `au`
- Weight: `kg`, `grams`, `lb`, `oz`, `stone`, `ton-metric`, `ton-short`, `milligrams`, `micrograms`, `carats`, `troy-oz`
- Volume and cooking: `liters`, `ml`, `gallons`, `floz`, `cups`, `tsp`, `tbsp`, `pint-cook`, `qt-cook`
- Area: `sqft`, `sqm`, `acres`, `hectares`, `sqkm`, `sqmiles`, `sqinches`, `sqcm`
- Speed: `mph`, `kmh`, `ms`, `knots`, `fps`, `mach`
- Power and energy: `watts`, `kilowatts`, `horsepower`, `btuh`, `joules`, `kcal`, `kwh`, `btu`, `megajoules`
- Pressure: `psi`, `bar`, `atm`, `pascal`, `mmhg`, `kpa`, `hpa`
- Force, torque, density, electric, voltage, resistance, acceleration, capacitance, illuminance, typography

### 4.7 Color formats in graph mode

Representative format IDs:
- `color-hex`, `color-rgb`, `color-hsl`, `color-hsv`, `color-cmyk`

This graph-level coverage is one major reason the app can support broad day-to-day conversions with a consistent panel UX.

## 5. Tool converter modules and representative entries

The sections below list representative converter entries directly observable from module metadata.

### 5.1 Hash converters (`src/converters/hash.js`)

Representative entries:
- SHA-1
- SHA-256
- SHA-384
- SHA-512
- SHA-224
- All Hashes (multi-output)

### 5.2 Data converters (`src/converters/data.js`)

Representative entries:
- JSON Prettify / Minify / Escape / Unescape
- CSV to JSON, TSV to JSON, JSON to TSV
- `.env` to JSON, JSON to INI, INI to JSON
- JSON to Markdown Table, Markdown Table to JSON
- NDJSON/JSON Lines conversions
- JSON Deep Merge
- CSV statistics, CSV transpose, CSV sort/filter
- JSON to SQL INSERT
- CSV to HTML Table
- JSON to Zod schema
- JSON to GraphQL schema
- JSON to Prisma schema
- JSON to Protocol Buffers schema
- JSON to Avro schema
- HAR entry to cURL
- OpenAPI path generator

### 5.3 Image and QR converters (`src/converters/image.js`, `src/converters/imageFormat.js`, `src/converters/qr.js`)

Representative entries:
- Image to Base64
- Base64 to Image
- Any File to Base64
- Image Resize / Compress / Rotate / Flip / Crop / Filter
- SVG to PNG
- Text to QR Code
- QR Code Reader

### 5.4 Document/PDF converters (`src/converters/pdf.js`)

Representative entries:
- Images to PDF
- Merge PDFs
- PDF Page Count
- PDF Split (extract page)
- PDF Extract Pages (range)
- Text to PDF
- PDF Metadata
- PDF Rotate Pages

### 5.5 Utility converters (`src/converters/utility.js`)

Representative entries from observed metadata include:
- WCAG Contrast Checker
- JSON Flatten / Unflatten
- Color Scheme Generator
- Unicode Inspector
- JSON to TypeScript
- HTTP Status lookup
- Password strength and entropy tools
- Timezone conversion utilities
- Date/time calculators
- Financial calculators (loan, mortgage, savings)
- Health and fitness calculators (BMI, body fat, water intake, heart rate)
- Practical household calculators (paint coverage, unit price)

The utility module is very large and contains many domain-specific helpers beyond the sample above.

### 5.6 Other registry modules

Additional modules included in the registry:
- `text.js`
- `crypto.js`
- `web.js`
- `number.js`
- `color.js`
- `media.js`

These modules provide additional converter breadth and are part of the same ToolPicker discovery workflow.

## 6. File-routing and converter entry points

`App.jsx` includes MIME/name-based file routing into tool mode. Current mappings include:
- PDF file -> `pdf-page-count`
- SVG file -> `svg-to-png`
- Generic image file -> `image-resize`
- Video file -> `video-to-audio`
- Audio file -> `audio-to-mp3`

This behavior accelerates conversion start time and reduces manual picker overhead.

## 7. Discovery experience for catalog scale

The catalog is intentionally broad. Discovery is supported by:
- Category filtering in ToolPicker.
- Search and recent/favorites support in picker/panel workflows.
- URL-deep-link support for direct converter entry.
- History recall for repeated conversion paths.

As converter count grows, documentation and metadata quality become as important as implementation count.

## 8. Quality expectations per converter

To maintain SaaS-grade quality at this scale, each converter should satisfy:
- Clear and concise description text.
- Predictable empty input behavior.
- Structured error output where possible.
- Keyboard-operable interaction paths for file and text workflows.
- Reasonable output naming for downloadable artifacts.

## 9. Catalog governance and maintenance

Recommended governance rules:
- Keep converter IDs stable once published to avoid broken deep links.
- Keep category assignments meaningful for discovery.
- Avoid duplicate converter intent unless differentiation is explicit.
- Document non-trivial input syntax in converter descriptions.
- Update this catalog doc when adding or removing converters.

## 10. Known catalog maintenance challenges

Observed challenges in a broad catalog architecture:
- Naming drift across modules over time.
- Potential overlap between format graph transforms and tool converters.
- Inconsistent phrasing of input conventions in descriptions.
- Large-module discoverability and maintainability pressure.

Mitigation directions:
- Introduce metadata linting for naming/description conventions.
- Add docs generation scripts from converter metadata.
- Normalize converter capability flags and return contracts.

## 11. Recommended contributor checklist for new converter entries

1. Choose stable `id` and clear `name`.
2. Write concise `description` with expected input pattern.
3. Set category intentionally.
4. Ensure converter handles empty/invalid input gracefully.
5. Confirm output formatting is user-readable.
6. Ensure compatibility with history/share workflows where applicable.
7. Update documentation references.

## 12. Summary

The converter catalog in this repository is broad and practical, spanning core encoding, structured data transforms, numerical/scientific conversion, image/media/PDF workflows, and many utility calculators. The architecture supports rapid expansion, but long-term quality depends on strict metadata consistency, predictable converter contracts, and disciplined documentation updates. This catalog should be maintained as a living map of implemented behavior, not marketing-only copy.
