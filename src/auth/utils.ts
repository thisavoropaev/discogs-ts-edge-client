import * as oauth from "oauth-1a";
import { err, ok, type Result } from "neverthrow";
import type { OAuthError, OAuthSignatureParams } from "../types/auth.ts";
import { buildUrlWithParams } from "../utils/url.ts";

export const generateOAuthSignature = async (
  params: OAuthSignatureParams,
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

    const token = params.credentials.token && params.credentials.tokenSecret
      ? {
        key: params.credentials.token,
        secret: params.credentials.tokenSecret,
      }
      : undefined;

    const url = buildUrlWithParams(params.url, params.parameters);

    const signResult = await client.sign(params.method, url.toString(), {
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
  params: OAuthSignatureParams,
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

    const token = params.credentials.token && params.credentials.tokenSecret
      ? {
        key: params.credentials.token,
        secret: params.credentials.tokenSecret,
      }
      : undefined;

    // Include query parameters in URL for OAuth signature
    const url = new URL(params.url);
    if (params.parameters) {
      Object.entries(params.parameters).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const signResult = await client.sign(params.method, url.toString(), {
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
