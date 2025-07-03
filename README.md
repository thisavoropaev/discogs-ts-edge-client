# Discogs Deno Client for Edge Runtime

A modern TypeScript client for the Discogs API, optimized for edge runtime
environments like Vercel Edge Functions and Cloudflare Workers, also suitable
for Node.js as well.

## Features

- 🚀 **Edge Runtime Optimized**: Built specifically for serverless edge
  environments
- 🦕 **Deno Native**: Developed and built with Deno for maximum compatibility
- 📦 **Zero Dependencies**: Lightweight bundle with no external runtime
  dependencies
- 🔒 **Type Safe**: Full TypeScript support with generated declarations
- 🌐 **Web Standards**: Uses modern Web APIs (fetch, URL, etc.)
- ⚡ **Fast**: Optimized bundle size for quick cold starts
- 🔄 **Result-based Error Handling**: Uses the `Result` pattern for elegant
  error handling

## Supported Platforms

- ✅ Vercel Edge Functions
- ✅ Cloudflare Workers
- ✅ Deno Deploy
- ✅ Deno Runtime
- ✅ Node.js 18+ (ESM only)

## Installation

### For Deno

```typescript
import { createDiscogsClient } from "jsr:@thisavoropaev/discogs-deno-client";
```

### For npm/Node.js (after publishing)

```bash
deno add @thisavoropaev/discogs-deno-client
```

```typescript
import { createDiscogsClient } from "discogs-deno-client";
```

## Quick Start

```typescript
import { createDiscogsClient } from "jsr:@thisavoropaev/discogs-deno-client";

// Initialize client
const client = createDiscogsClient({
  credentials: {
    consumerKey: "your-consumer-key",
    consumerSecret: "your-consumer-secret",
    token: "your-access-token", // optional
    tokenSecret: "your-access-token-secret", // optional
  },
  userAgent: "MyApp/1.0 +https://github.com/your-username/your-app",
});

// Get release details
const result = await client.request({
  method: "GET",
  endpoint: "/releases/:release_id",
  pathParams: { release_id: "249504" }, // Nirvana - Nevermind
});

// Handle success or error with Result pattern
if (result.isErr()) {
  console.error("Error:", result.error);
} else {
  const release = result.value;
  console.log(`Release: ${release.title} by ${release.artists[0]?.name}`);
}
```

## Using the Result Pattern

The client uses the [neverthrow](https://github.com/supermacro/neverthrow)
library for error handling:

```typescript
// Making a request with query parameters
const result = await client.request({
  method: "GET",
  endpoint: "/releases/:release_id",
  pathParams: { release_id: "249504" },
  queryParams: { curr_abbr: "USD" },
});

if (result.isErr()) {
  console.error("Error:", result.error.message);
  console.error("Error type:", result.error.type);
  return;
}

// Safely access the successful result
const release = result.value;
console.log(`${release.title} (${release.year})`);
```

## Edge Function Examples

### Vercel Edge Function

```typescript
// api/discogs.ts
import { createDiscogsClient } from "jsr:@thisavoropaev/discogs-deno-client";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const client = createDiscogsClient({
    credentials: {
      consumerKey: process.env.DISCOGS_CONSUMER_KEY || "",
      consumerSecret: process.env.DISCOGS_CONSUMER_SECRET || "",
      token: process.env.DISCOGS_ACCESS_TOKEN || "",
      tokenSecret: process.env.DISCOGS_ACCESS_TOKEN_SECRET || "",
    },
    userAgent: "MyApp/1.0 +https://github.com/your-username/your-app",
  });

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return new Response("Missing query parameter", { status: 400 });
  }

  const result = await client.request({
    method: "GET",
    endpoint: "/database/search",
    queryParams: { q: query },
  });

  if (result.isErr()) {
    return new Response(`Search failed: ${result.error.message}`, {
      status: 500,
    });
  }

  return Response.json(result.value);
}
```

### Cloudflare Worker

```typescript
import { createDiscogsClient } from "jsr:@thisavoropaev/discogs-deno-client";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const client = createDiscogsClient({
      credentials: {
        consumerKey: env.DISCOGS_CONSUMER_KEY,
        consumerSecret: env.DISCOGS_CONSUMER_SECRET,
        token: env.DISCOGS_ACCESS_TOKEN,
        tokenSecret: env.DISCOGS_ACCESS_TOKEN_SECRET,
      },
      userAgent: "MyApp/1.0 +https://github.com/your-username/your-app",
    });

    const url = new URL(request.url);
    const query = url.searchParams.get("q");

    if (!query) {
      return new Response("Missing query parameter", { status: 400 });
    }

    const result = await client.request({
      method: "GET",
      endpoint: "/database/search",
      queryParams: { q: query },
    });

    if (result.isErr()) {
      return new Response(`Search failed: ${result.error.message}`, {
        status: 500,
      });
    }

    return Response.json(result.value);
  },
};
```

## Development

### Prerequisites

- [Deno](https://deno.land/) 2.x

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd discogs-deno-client

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

### createDiscogsClient

```typescript
const client = createDiscogsClient(config: DiscogsClientConfig);
```

#### Configuration

```typescript
type DiscogsClientConfig = {
  credentials: {
    consumerKey: string;
    consumerSecret: string;
    token?: string;
    tokenSecret?: string;
  };
  userAgent: string; // Required: Your app identifier
  baseUrl?: string; // Optional: Override the base API URL
};
```

#### Request Method

```typescript
client.request({
  method: "GET" | "POST" | "PUT" | "DELETE", // HTTP method
  endpoint: string, // API endpoint path with placeholders
  pathParams?: Record<string, string | number>, // Path parameters
  queryParams?: Record<string, string | number>, // Query parameters
  headers?: Record<string, string>, // Additional headers
});
```

## Environment Variables

For authenticated requests, set these environment variables:

```bash
DISCOGS_CONSUMER_KEY=your-consumer-key
DISCOGS_CONSUMER_SECRET=your-consumer-secret
DISCOGS_ACCESS_TOKEN=your-access-token
DISCOGS_ACCESS_TOKEN_SECRET=your-access-token-secret
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

### v0.2.0

- Current development version
- Edge runtime optimization
- Full TypeScript support
- Deno native development
- Result pattern for error handling
