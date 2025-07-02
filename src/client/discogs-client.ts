import type { Result } from "neverthrow";
import { err } from "neverthrow";
import type { OAuthClient } from "@/auth/client.ts";
import type {
  DiscogsApiError,
  EndpointResponseMap,
  RequestRawParams,
} from "@/types/mod.ts";
import type {
  DiscogsClient,
  DiscogsClientConfig,
  DiscogsClientOptions,
} from "./types.ts";
import { createOAuthClient } from "../auth/client.ts";
import { API_BASE_URL } from "../config/constants.ts";
import { buildPath, buildQueryString } from "../utils/url.ts";
import { handleApiResponse } from "../utils/api-response.ts";

export const createDiscogsClient = (
  config: DiscogsClientConfig,
  _options: DiscogsClientOptions = {},
): DiscogsClient => {
  const oauthClient: OAuthClient = createOAuthClient({
    credentials: config.credentials,
    baseUrl: config.baseUrl || API_BASE_URL,
  });

  return {
    request: async <
      TMethod extends keyof EndpointResponseMap,
      TEndpoint extends keyof EndpointResponseMap[TMethod],
    >(
      params: RequestRawParams<TMethod, TEndpoint>,
    ): Promise<
      Result<EndpointResponseMap[TMethod][TEndpoint], DiscogsApiError>
    > => {
      // Build the path with parameters
      const path = buildPath(
        params.endpoint as string,
        params.pathParams || {},
      );

      // Build query string if query parameters exist
      const queryString = buildQueryString(params.queryParams || {});
      const fullPath = queryString ? `${path}?${queryString}` : path;

      // Prepare headers
      const headers = {
        "User-Agent": config.userAgent,
        ...params.headers,
      };

      // Make the request
      const responseResult = await oauthClient.request(
        params.method,
        fullPath,
        { headers },
      );

      // Handle OAuth errors
      if (responseResult.isErr()) {
        return err({
          message: responseResult.error.message,
          type: "AUTH_ERROR",
        });
      }

      // Handle the response
      return handleApiResponse<EndpointResponseMap[TMethod][TEndpoint]>(
        responseResult.value,
      );
    },
  };
};
