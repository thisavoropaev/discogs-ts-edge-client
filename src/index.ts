export {
  createAuthorizationHeader,
  createOAuthClient,
  generateOAuthSignature,
} from "@/auth/index.ts";

export { createDiscogsClient } from "@/client/discogs-client.ts";
export type {
  DiscogsClient,
  DiscogsClientConfig,
  DiscogsClientOptions,
} from "@/client/types.ts";

export type {
  ApiResult,
  DiscogsApiError,
  DiscogsApiErrorType,
} from "@/types/index.ts";

export type {
  HttpMethod,
  OAuthCredentials,
  OAuthError,
  OAuthParameters,
  OAuthSignatureParams,
} from "@/types/auth.ts";

export type {
  OAuthClient,
  OAuthClientConfig,
  RequestOptions,
} from "@/auth/client.ts";

export const VERSION = "1.0.0";
