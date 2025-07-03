import { err, ok, type Result } from "neverthrow";
import { DISCOGS_API_URL } from "./constants.ts";
import { buildPath } from "./utils/url.ts";
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
  _options: DiscogsClientOptions = {}
): DiscogsClient => {
  const oauthClient: OAuthClient = createOAuthClient({
    credentials: config.credentials,
    baseUrl: DISCOGS_API_URL,
  });

  return {
    request: async <
      TMethod extends keyof EndpointResponseMap,
      TEndpoint extends keyof EndpointResponseMap[TMethod]
    >(
      params: RequestParams<TMethod, TEndpoint>
    ): Promise<
      Result<EndpointResponseMap[TMethod][TEndpoint], DiscogsApiError>
    > => {
      const path = buildPath(
        params.endpoint as string,
        params.pathParams || {}
      );

      const headers = {
        "User-Agent": config.userAgent,
        ...params.headers,
      };

      const responseResult = await oauthClient.request(params.method, path, {
        headers,
        parameters: params.queryParams,
      });

      if (responseResult.isErr()) {
        return err({
          message: responseResult.error.message,
          type: "AUTH_ERROR",
        });
      }

      return handleApiResponse<EndpointResponseMap[TMethod][TEndpoint]>(
        responseResult.value
      );
    },
  };
};

async function handleApiResponse<T>(
  response: Response
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
