import { err, ok, Result } from "neverthrow";
import * as oauth from "jsr:@thisavoropaev/oauth-1a";
import type { OAuthError, OAuthSignatureParams } from "@/types/auth.ts";

export { createOAuthClient } from "@/auth/client.ts";

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

    const signResult = await client.sign(params.method, params.url, {
      token,
      body: params.parameters
        ? new URLSearchParams(params.parameters)
        : undefined,
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

    const signResult = await client.sign(params.method, params.url, {
      token,
      body: params.parameters
        ? new URLSearchParams(params.parameters)
        : undefined,
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
