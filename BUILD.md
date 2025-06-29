# Build Guide for Edge Runtime

This guide explains how to build the Discogs TypeScript client for edge runtime
environments.

## Overview

The project is now optimized for edge runtime environments and uses Deno as the
primary development and build tool. This approach provides:

- **Native edge compatibility**: No Node.js-specific dependencies
- **Zero runtime dependencies**: Self-contained bundle
- **Fast cold starts**: Optimized bundle size
- **Type safety**: Full TypeScript support
- **Web standards**: Uses fetch, URL, and other web APIs

## Prerequisites

- [Deno](https://deno.land/) 1.40 or later

## Development Workflow

### 1. Setup

```bash
# Clone and enter the project
git clone <repository-url>
cd discogs-ts-client

# Verify Deno installation
deno --version
```

### 2. Development Commands

```bash
# Type checking
deno task check

# Run tests
deno task test
deno task test:unit
deno task test:integration

# Code formatting
deno task fmt

# Linting
deno task lint

# Development server (with file watching)
deno task dev
```

### 3. Building

#### Simple Bundle (for testing)

```bash
deno task build
```

This creates a single `dist/index.js` file using `deno bundle`.

#### Production ESM Bundle

```bash
deno task build:esm
```

This creates a complete distribution package:

- `dist/index.js` - Main ESM bundle
- `dist/index.d.ts` - TypeScript declarations
- `dist/package.json` - Package metadata
- `dist/README.md` - Documentation

## Build Process Details

### ESM Build Script (`scripts/build_esm.ts`)

The ESM build process:

1. **Bundle Creation**: Uses `deno bundle` to create a single JavaScript file
2. **Type Generation**: Generates TypeScript declarations
3. **Package Metadata**: Creates `package.json` for npm compatibility
4. **Documentation**: Copies README.md

### Type Generation (`scripts/generate_types.ts`)

The type generation process:

1. **Export Analysis**: Scans source files for exports
2. **Declaration Generation**: Creates comprehensive type definitions
3. **Edge Compatibility**: Ensures types work in edge environments

## Configuration Files

### `deno.json`

Main configuration file with:

- **Compiler options**: Target ES2022, ESNext modules, bundler resolution
- **Library support**: `deno.window` and `webworker` for edge compatibility
- **Import maps**: Path aliases (`@/` for src, `@tests/` for tests)
- **Tasks**: Development and build commands

### `.gitignore`

Simplified to exclude only:

- Environment files (`.env*`)
- Build outputs (`dist/`, `build/`, `out/`)
- Coverage reports
- Logs

## Deployment

### Vercel Edge Functions

1. Build the project:
   ```bash
   deno task build:esm
   ```

2. Copy `dist/index.js` to your Vercel project

3. Create an edge function:
   ```typescript
   import { DiscogsClient } from "./path/to/dist/index.js";

   export const config = { runtime: "edge" };

   export default async function handler(req) {
     // Your edge function code
   }
   ```

### Cloudflare Workers

1. Build the project:
   ```bash
   deno task build:esm
   ```

2. Use the bundle in your worker:
   ```typescript
   import { DiscogsClient } from "./dist/index.js";

   export default {
     async fetch(request, env) {
       // Your worker code
     },
   };
   ```

### Deno Deploy

1. No build step needed - deploy directly:
   ```typescript
   import { DiscogsClient } from "./src/index.ts";
   ```

2. Or use the built bundle:
   ```typescript
   import { DiscogsClient } from "./dist/index.js";
   ```

## Publishing to npm

1. Build the ESM package:
   ```bash
   deno task build:esm
   ```

2. Navigate to dist directory:
   ```bash
   cd dist
   ```

3. Publish:
   ```bash
   npm publish
   ```

## Troubleshooting

### `deno check` Errors

If you see type errors:

1. **Import resolution**: Ensure all imports use proper paths or aliases
2. **Web API types**: Make sure `lib` includes `"webworker"` for edge APIs
3. **Module resolution**: Use `"bundler"` for modern bundling

### Bundle Size Issues

1. **Check dependencies**: Ensure no unnecessary imports
2. **Tree shaking**: `deno bundle` automatically removes unused code
3. **Web APIs**: Prefer built-in web APIs over external libraries

### Edge Runtime Compatibility

1. **No Node.js APIs**: Avoid `process`, `fs`, `path`, etc.
2. **Use Web APIs**: `fetch`, `URL`, `crypto.subtle`, etc.
3. **ESM only**: No CommonJS support in edge environments

## Key Differences from Node.js Build

| Aspect            | Node.js (tsup)    | Edge Runtime (Deno) |
| ----------------- | ----------------- | ------------------- |
| **Build tool**    | tsup + TypeScript | deno bundle         |
| **Dependencies**  | npm packages      | Web APIs + Deno std |
| **Module system** | ESM + CommonJS    | ESM only            |
| **Runtime APIs**  | Node.js APIs      | Web APIs            |
| **Type checking** | tsc               | deno check          |
| **Bundle size**   | Larger            | Smaller             |
| **Cold start**    | Slower            | Faster              |

## Performance Considerations

- **Bundle size**: Optimized for minimal size
- **Cold starts**: No external dependencies to load
- **Memory usage**: Efficient with Web APIs
- **Network**: Built-in fetch with proper error handling

This build system provides a modern, efficient way to create edge-compatible
packages while maintaining full TypeScript support and developer experience.
