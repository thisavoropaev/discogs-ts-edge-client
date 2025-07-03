export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type DiscogsApiErrorType =
  | "NETWORK_ERROR"
  | "AUTH_ERROR"
  | "API_ERROR"
  | "VALIDATION_ERROR";

export type DiscogsApiError = {
  type: DiscogsApiErrorType;
  message: string;
  statusCode?: number;
  details?: unknown;
};

export type ApiResult<T> =
  | { success: true; data: T }
  | {
      success: false;
      error: DiscogsApiError;
    };

export type PaginatedResponse<T> = {
  pagination: {
    page: number;
    pages: number;
    per_page: number;
    items: number;
    urls: {
      last?: string;
      next?: string;
      prev?: string;
      first?: string;
    };
  };
  results: T[];
};

export type DiscogsResponse<T> = T;

export type QueryParams = Record<string, string>;
