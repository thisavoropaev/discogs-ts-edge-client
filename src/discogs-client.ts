import { err, ok, type Result } from "neverthrow";
import { createOAuthClient, type OAuthClient } from "./auth/client.ts";
import type {
  DiscogsApiError,
  DiscogsClient,
  DiscogsClientConfig,
  DiscogsClientOptions,
  EndpointResponseMap,
  RequestParams,
} from "./types/mod.ts";

import { API_BASE_URL } from "./config/constants.ts";
import { buildPath, buildQueryString } from "./utils/url.ts";

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
      params: RequestParams<TMethod, TEndpoint>,
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

async function handleApiResponse<T>(
  response: Response,
): Promise<Result<T, DiscogsApiError>> {
  try {
    const text = await response.text();

    if (!response.ok) {
      return err({
        message: text || response.statusText,
        statusCode: response.status,
        type: response.status === 401 ? "AUTH_ERROR" : "API_ERROR",
      });
    }

    const data = JSON.parse(text) as T;
    return ok(data);
  } catch (error) {
    return err({
      message: error instanceof Error ? error.message : "Unknown error",
      type: "NETWORK_ERROR",
    });
  }
}
