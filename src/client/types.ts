import type { Result } from "neverthrow";
import type {
  DiscogsApiError,
  EndpointResponseMap,
  RequestRawParams,
} from "@/types/mod.ts";
import type { OAuthCredentials } from "@/types/auth.ts";

export type DiscogsClientConfig = {
  credentials: OAuthCredentials;
  userAgent: string;
  baseUrl?: string;
};

export type DiscogsClientOptions = {
  timeout?: number;
  retries?: number;
};

export type DiscogsClient = {
  request: <
    TMethod extends keyof EndpointResponseMap,
    TEndpoint extends keyof EndpointResponseMap[TMethod],
  >(
    params: RequestRawParams<TMethod, TEndpoint>,
  ) => Promise<
    Result<EndpointResponseMap[TMethod][TEndpoint], DiscogsApiError>
  >;
};
