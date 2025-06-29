# discogs-ts-edge-client

A universal, lightweight TypeScript client for Discogs API v2, designed for
edge/serverless environments (Vercel Edge Functions, Cloudflare Workers, Deno,
etc.). Supports all endpoints, strong typing (coverage expanding), and
functional error handling via
[`neverthrow`](https://github.com/supermacro/neverthrow).

## Key Features

- **Edge/server-first:** Secure secret storage, no internal retries
- **OAuth 1.0a:** Only request signing with pre-obtained tokens (token
  acquisition is external)
- **Strict typing:** Expanding TypeScript types for all entities and API
  responses
- **Functional error handling:** All methods return `Result<T, DiscogsApiError>`
- **Security:** Never use in the browser—server/edge only

## Important

- **Do not use in the browser:** OAuth secrets must not be exposed on the
  client.
- **Types and models** can be safely used in the frontend for strict typing.

## Error Handling

All API methods return a result via
[`neverthrow`](https://github.com/supermacro/neverthrow):

```typescript
type DiscogsApiError = {
  type:
    | "AUTH_ERROR"
    | "NETWORK_ERROR"
    | "API_ERROR"
    | "RATE_LIMIT_ERROR"
    | "VALIDATION_ERROR";
  message: string;
  statusCode?: number;
  details?: unknown;
};
```

## Usage Example

```typescript
import { createDiscogsClient } from "discogs-ts-client";
import type { OAuthCredentials } from "discogs-ts-client";

const credentials: OAuthCredentials = {
  consumerKey: "your-consumer-key",
  consumerSecret: "your-consumer-secret",
  token: "user-access-token",
  tokenSecret: "user-token-secret",
};

const client = createDiscogsClient({
  credentials,
  userAgent: "DiscogsClient/1.0 +https://github.com/your/repo",
});

// Example: Get release details with path and query parameters
const result = await client.request({
  method: "GET",
  endpoint: "/releases/:release_id",
  pathParams: { release_id: "249504" },
  queryParams: { curr_abbr: "USD" },
  headers: {
    "Accept-Language": "en-US",
  },
});

if (result.isOk()) {
  const release = result.value;
  console.log(release.title, release.id);
} else {
  console.error("DiscogsApiError:", result.error);
}
```

## Target Audience

- Backend developers and microservice authors working with the Discogs API
- Frontend developers who need strict TypeScript types for API data
- Engineers needing a universal, edge-first client with explicit error handling

## Capabilities

- **All Discogs API v2 endpoints** (type coverage expanding)
- **Functional error handling** via `neverthrow`
- **Unit and integration tests** using `deno test` and real tokens via
  environment variables
- **Build process** generates type declarations for frontend import

## Architecture and Structure

- **OAuth signature module**, implementing asynchronous signing with Web Crypto
  API (compatible with Node.js, Deno, Cloudflare Workers, Edge Functions)
- **Main client** with API methods returning `neverthrow.Result`
- **TypeScript types** for all entities and API responses
- **Tests** (unit and integration) using `deno test` and real tokens via
  environment variables
- **Build process** generates type declarations for easy frontend import
