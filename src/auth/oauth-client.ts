import { err, ok, type Result } from "neverthrow";
import { createAuthorizationHeader, generateOAuthSignature } from "./utils.ts";

import type { HttpMethod } from "../types/mod.ts";
import type { OAuthCredentials, OAuthError } from "../types/auth.ts";
import type { QueryParams } from "../types/common.ts";

import { buildUrlWithParams } from "../utils/url.ts";

export type OAuthClientConfig = {
  credentials: OAuthCredentials;
  baseUrl: string;
};

export type RequestOptions = {
  headers?: Record<string, string>;
  body?: BodyInit;
  parameters?: QueryParams;
};

export interface OAuthClient {
  sign: (
    method: HttpMethod,
    url: string,
    parameters?: QueryParams,
  ) => Promise<Result<string, OAuthError>>;
  createAuthHeader: (
    method: HttpMethod,
    url: string,
    parameters?: QueryParams,
  ) => Promise<Result<string, OAuthError>>;
  request: (
    method: HttpMethod,
    endpoint: string,
    options?: RequestOptions,
  ) => Promise<Result<Response, OAuthError>>;
}

export const createOAuthClient = (config: OAuthClientConfig): OAuthClient => {
  const { credentials, baseUrl } = config;

  const buildFullUrl = (endpoint: string): string => {
    return `${baseUrl.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
  };

  const sign = async (
    method: HttpMethod,
    url: string,
    parameters?: QueryParams,
  ): Promise<Result<string, OAuthError>> => {
    return await generateOAuthSignature({
      credentials,
      method,
      url,
      parameters,
    });
  };

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

  const request = async (
    method: HttpMethod,
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<Result<Response, OAuthError>> => {
    const { headers = {}, body, parameters } = options;
    const fullUrl = buildFullUrl(endpoint);
    const url = buildUrlWithParams(fullUrl, parameters);

    const authHeaderResult = await createAuthHeader(
      method,
      fullUrl,
      parameters,
    );

    if (authHeaderResult.isErr()) {
      return err(authHeaderResult.error);
    }

    const authHeader = authHeaderResult.value;

    const requestHeaders = new Headers({
      ...headers,
      Authorization: authHeader,
    });

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      body,
    };

    try {
      const response = await fetch(url.toString(), requestOptions);
      return ok(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return err({
        code: "NETWORK_ERROR",
        message: `Network request failed: ${message}`,
        details: error,
      });
    }
  };

  return {
    sign,
    createAuthHeader,
    request,
  };
};
