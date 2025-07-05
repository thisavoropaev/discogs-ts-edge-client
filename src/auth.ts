import * as oauth from "oauth-1a";
import { err, ok, type Result } from "neverthrow";
import type {
  HttpMethod,
  OAuthCredentials,
  OAuthError,
  OAuthSignatureParams,
  QueryParams,
} from "./types/mod.ts";

import { buildRequestUrl } from "./url.ts";

export const generateOAuthSignature = async (
  params: OAuthSignatureParams
): Promise<Result<string, OAuthError>> => {
  const { consumerKey, consumerSecret } = params.credentials;
  if (!consumerKey || !consumerSecret) {
    return err({
      code: "INVALID_CREDENTIALS",
      message:
        "Consumer Key and Consumer Secret are required for OAuth signature.",
    });
  }

  try {
    const client = new oauth.OAuthClient({
      consumer: {
        key: consumerKey,
        secret: consumerSecret,
      },
      signature: oauth.HMAC_SHA1,
    });

    const token =
      params.credentials.token && params.credentials.tokenSecret
        ? {
            key: params.credentials.token,
            secret: params.credentials.tokenSecret,
          }
        : undefined;

    const requestUrl = buildRequestUrl(params.url, params.parameters);

    const signResult = await client.sign(params.method, requestUrl, {
      token,
    });

    return ok(signResult.oauth_signature);
  } catch (error) {
    return err({
      code: "SIGNATURE_GENERATION_FAILED",
      message: "Failed to generate OAuth signature",
      details: error,
    });
  }
};

export const createAuthorizationHeader = async (
  params: OAuthSignatureParams
): Promise<Result<string, OAuthError>> => {
  const { consumerKey, consumerSecret } = params.credentials;
  if (!consumerKey || !consumerSecret) {
    return err({
      code: "INVALID_CREDENTIALS",
      message:
        "Consumer Key and Consumer Secret are required for OAuth signature.",
    });
  }

  try {
    const client = new oauth.OAuthClient({
      consumer: {
        key: consumerKey,
        secret: consumerSecret,
      },
      signature: oauth.HMAC_SHA1,
    });

    const token =
      params.credentials.token && params.credentials.tokenSecret
        ? {
            key: params.credentials.token,
            secret: params.credentials.tokenSecret,
          }
        : undefined;

    // Include query parameters in URL for OAuth signature
    const requestUrl = buildRequestUrl(params.url, params.parameters);

    const signResult = await client.sign(params.method, requestUrl, {
      token,
    });

    const authHeader = oauth.toAuthHeader(signResult);
    return ok(authHeader);
  } catch (error) {
    return err({
      code: "SIGNATURE_GENERATION_FAILED",
      message: "Failed to create authorization header",
      details: error,
    });
  }
};

export const createAuthHeader = async (
  credentials: OAuthCredentials,
  method: HttpMethod,
  url: string,
  parameters?: QueryParams
): Promise<Result<string, OAuthError>> => {
  return await createAuthorizationHeader({
    credentials,
    method,
    url,
    parameters,
  });
};
