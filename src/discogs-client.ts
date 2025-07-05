import { err, ok, type Result } from "neverthrow";
import { DISCOGS_API_URL } from "./constants.ts";
import { buildPath, buildRequestUrl } from "./utils/url.ts";
import { createOAuthClient, type OAuthClient } from "./auth/oauth-client.ts";
import type {
  DiscogsApiError,
  DiscogsClient,
  DiscogsClientConfig,
  DiscogsClientOptions,
  EndpointResponseMap,
  RequestParams,
} from "./types/mod.ts";


export const createDiscogsClient = (
  config: DiscogsClientConfig,
  _options: DiscogsClientOptions = {},
): DiscogsClient => {
  const oauthClient: OAuthClient = createOAuthClient({
    credentials: config.credentials,
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
      const path = buildPath(params.endpoint as string, params.pathParams);
      const fullUrl = `${DISCOGS_API_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

      const authHeaderResult = await oauthClient.createAuthHeader(
        params.method,
        fullUrl,
        params.queryParams,
      );

      if (authHeaderResult.isErr()) {
        return err({
          message: authHeaderResult.error.message,
          type: "AUTH_ERROR",
        });
      }

      const requestUrl = buildRequestUrl(fullUrl, params.queryParams);

      const headers = {
        "User-Agent": config.userAgent,
        "Authorization": authHeaderResult.value,
        ...params.headers,
      };

      try {
        const response = await fetch(requestUrl, {
          method: params.method,
          headers,
        });

        return handleApiResponse<EndpointResponseMap[TMethod][TEndpoint]>(
          response,
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return err({
          message: `Network request failed: ${message}`,
          type: "NETWORK_ERROR",
        });
      }
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
