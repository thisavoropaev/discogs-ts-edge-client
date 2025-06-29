# Discogs TypeScript Client for Edge Runtime

A modern TypeScript client for the Discogs API, optimized for edge runtime
environments like Vercel Edge Functions and Cloudflare Workers.

## Features

- 🚀 **Edge Runtime Optimized**: Built specifically for serverless edge
  environments
- 🦕 **Deno Native**: Developed and built with Deno for maximum compatibility
- 📦 **Zero Dependencies**: Lightweight bundle with no external runtime
  dependencies
- 🔒 **Type Safe**: Full TypeScript support with generated declarations
- 🌐 **Web Standards**: Uses modern Web APIs (fetch, URL, etc.)
- ⚡ **Fast**: Optimized bundle size for quick cold starts

## Supported Platforms

- ✅ Vercel Edge Functions
- ✅ Cloudflare Workers
- ✅ Deno Deploy
- ✅ Deno Runtime
- ✅ Modern browsers
- ✅ Node.js 18+ (ESM only)

## Installation

### For Deno

```typescript
import { DiscogsClient } from "https://deno.land/x/discogs_client/mod.ts";
```

### For npm/Node.js (after publishing)

```bash
npm install discogs-ts-client
```

```typescript
import { DiscogsClient } from "discogs-ts-client";
```

## Quick Start

```typescript
import { DiscogsClient } from "./src/index.ts";

// Initialize client
const client = new DiscogsClient({
  userAgent: "MyApp/1.0",
  // Optional: for authenticated requests
  consumerKey: "your-consumer-key",
  consumerSecret: "your-consumer-secret",
});

// Search for releases
const searchResults = await client.search("Nirvana Nevermind");
console.log(searchResults.data);

// Get release details
const release = await client.getRelease(249504);
console.log(release.data);
```

## Edge Function Examples

### Vercel Edge Function

```typescript
// api/discogs.ts
import { DiscogsClient } from "discogs-ts-client";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const client = new DiscogsClient({
    userAgent: "MyApp/1.0",
    consumerKey: process.env.DISCOGS_CONSUMER_KEY,
    consumerSecret: process.env.DISCOGS_CONSUMER_SECRET,
  });

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return new Response("Missing query parameter", { status: 400 });
  }

  try {
    const results = await client.search(query);
    return Response.json(results.data);
  } catch (error) {
    return new Response("Search failed", { status: 500 });
  }
}
```

### Cloudflare Worker

```typescript
import { DiscogsClient } from "discogs-ts-client";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const client = new DiscogsClient({
      userAgent: "MyApp/1.0",
      consumerKey: env.DISCOGS_CONSUMER_KEY,
      consumerSecret: env.DISCOGS_CONSUMER_SECRET,
    });

    const url = new URL(request.url);
    const query = url.searchParams.get("q");

    if (!query) {
      return new Response("Missing query parameter", { status: 400 });
    }

    try {
      const results = await client.search(query);
      return Response.json(results.data);
    } catch (error) {
      return new Response("Search failed", { status: 500 });
    }
  },
};
```

## Development

### Prerequisites

- [Deno](https://deno.land/) 1.40+

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd discogs-ts-client

# Run tests
deno task test

# Check types
deno task check

# Format code
deno task fmt

# Lint code
deno task lint
```

### Building

```bash
# Build ESM bundle
deno task build:esm

# Simple bundle (for testing)
deno task build
```

### Testing

```bash
# Run all tests
deno task test

# Run unit tests only
deno task test:unit

# Run integration tests only
deno task test:integration
```

## API Reference

### DiscogsClient

#### Constructor

```typescript
new DiscogsClient(config: DiscogsClientConfig)
```

#### Configuration

```typescript
type DiscogsClientConfig = {
  userAgent: string; // Required: Your app identifier
  consumerKey?: string; // OAuth consumer key
  consumerSecret?: string; // OAuth consumer secret
  token?: string; // OAuth access token
  tokenSecret?: string; // OAuth access token secret
};
```

#### Methods

- `search(query: string, options?: SearchOptions)` - Search the Discogs database
- `getRelease(id: number)` - Get release details
- `getMaster(id: number)` - Get master release details
- `getArtist(id: number)` - Get artist details
- `getLabel(id: number)` - Get label details
- `getIdentity()` - Get authenticated user identity
- `getProfile(username: string)` - Get user profile

## Environment Variables

For authenticated requests, set these environment variables:

```bash
DISCOGS_CONSUMER_KEY=your-consumer-key
DISCOGS_CONSUMER_SECRET=your-consumer-secret
DISCOGS_TOKEN=your-access-token
DISCOGS_TOKEN_SECRET=your-access-token-secret
```

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run `deno task test` and `deno task check`
6. Submit a pull request

## Changelog

### v1.0.0

- Initial release
- Edge runtime optimization
- Full TypeScript support
- Deno native development
