export { createDiscogsClient } from "@/client/discogs-client.ts";

export type {
  DiscogsClient,
  DiscogsClientConfig,
  DiscogsClientOptions,
} from "@/client/types.ts";

export type { EndpointResponseMap } from "@/types/api/endpoint-response-map.ts";

export type {
  GetReleaseResponse,
  GetUserIdentityResponse,
  GetUserProfileResponse,
} from "@/types/api/endpoints/mod.ts";

export type {
  ApiResult,
  DiscogsApiError,
  DiscogsApiErrorType,
  RequestRawParams,
} from "@/types/mod.ts";

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

export const VERSION = "0.0.2";
