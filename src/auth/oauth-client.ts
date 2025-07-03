import { err, ok, type Result } from "neverthrow";
import { buildQueryString } from "../utils/url.ts";
import { createAuthorizationHeader, generateOAuthSignature } from "./utils.ts";

import type { HttpMethod } from "../types/mod.ts";
import type { OAuthCredentials, OAuthError } from "../types/auth.ts";

export type OAuthClientConfig = {
  credentials: OAuthCredentials;
  baseUrl: string;
};

export type RequestOptions = {
  headers?: Record<string, string>;
  body?: string | URLSearchParams | FormData;
  parameters?: Record<string, string>;
};

export type OAuthClient = {
  sign: (
    method: HttpMethod,
    url: string,
    parameters?: Record<string, string>,
  ) => Promise<Result<string, OAuthError>>;
  createAuthHeader: (
    method: HttpMethod,
    url: string,
    parameters?: Record<string, string>,
  ) => Promise<Result<string, OAuthError>>;
  request: (
    method: HttpMethod,
    endpoint: string,
    options?: RequestOptions,
  ) => Promise<Result<Response, OAuthError>>;
};

export const createOAuthClient = (config: OAuthClientConfig): OAuthClient => {
  const { credentials, baseUrl } = config;

  const buildFullUrl = (endpoint: string): string => {
    if (endpoint.startsWith("http")) {
      return endpoint;
    }

    return `${baseUrl.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
  };

  const sign = async (
    method: HttpMethod,
    url: string,
    parameters?: Record<string, string>,
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
    parameters?: Record<string, string>,
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
    const fullUrl = buildFullUrl(endpoint);
    const { headers = {}, body, parameters } = options;

    const authHeaderResult = await createAuthHeader(
      method,
      fullUrl,
      parameters,
    );

    if (authHeaderResult.isErr()) {
      return err(authHeaderResult.error);
    }

    const authHeader = authHeaderResult.value;

    // Debug logging
    console.log(`[DEBUG] OAuth Request:`);
    console.log(`  Method: ${method}`);
    console.log(`  URL: ${fullUrl}`);
    console.log(`  Parameters:`, parameters);
    console.log(`  Auth Header: ${authHeader}`);

    const requestHeaders = new Headers({
      ...headers,
      Authorization: authHeader,
    });

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      body,
    };

    const queryString = parameters ? buildQueryString(parameters) : "";
    const urlForFetch = queryString ? `${fullUrl}?${queryString}` : fullUrl;
    
    console.log(`  Final URL: ${urlForFetch}`);
    console.log(`  Headers:`, Object.fromEntries(requestHeaders.entries()));

    try {
      const response = await fetch(urlForFetch, requestOptions);
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
