import type { Result } from "neverthrow";
import { createAuthorizationHeader, generateOAuthSignature } from "./utils.ts";

import type { HttpMethod } from "../types/mod.ts";
import type { OAuthCredentials, OAuthError } from "../types/auth.ts";
import type { QueryParams } from "../types/common.ts";

export type OAuthClientConfig = {
  credentials: OAuthCredentials;
};

export type OAuthClient = {
  createAuthHeader: (
    method: HttpMethod,
    url: string,
    parameters?: QueryParams,
  ) => Promise<Result<string, OAuthError>>;
};

export const createOAuthClient = (config: OAuthClientConfig): OAuthClient => {
  const { credentials } = config;

  const createAuthHeader = async (
    method: HttpMethod,
    url: string,
    parameters?: QueryParams,
  ): Promise<Result<string, OAuthError>> => {
    return await createAuthorizationHeader({
      credentials,
      method,
      url,
      parameters,
    });
  };

  return {
    createAuthHeader,
  };
};

// Export internal functions for testing
export const _internal = {
  generateOAuthSignature,
};
