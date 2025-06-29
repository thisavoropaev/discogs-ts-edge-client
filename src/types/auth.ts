export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

export type OAuthCredentials = {
  consumerKey: string;
  consumerSecret: string;
  token?: string;
  tokenSecret?: string;
};

export type OAuthParameters = {
  oauth_consumer_key: string;
  oauth_nonce: string;
  oauth_signature_method: string;
  oauth_timestamp: string;
  oauth_version: string;
  oauth_token?: string;
  oauth_signature?: string;
};

export type SignatureBaseStringParams = {
  method: string;
  url: string;
  parameters: Record<string, string>;
};

export type OAuthSignatureParams = {
  credentials: OAuthCredentials;
  method: HttpMethod;
  url: string;
  parameters?: Record<string, string>;
};

export type InternalOAuthErrorCode =
  | "SIGNATURE_GENERATION_FAILED"
  | "NETWORK_ERROR"
  | "INVALID_CREDENTIALS";

export type OAuthError = {
  code: InternalOAuthErrorCode;
  message: string;
  details?: unknown;
};
