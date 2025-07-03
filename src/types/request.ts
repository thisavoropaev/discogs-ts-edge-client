import type { EndpointResponseMap } from "./endpoint-response-map.ts";

export type RequestParams<
  TMethod extends keyof EndpointResponseMap,
  TEndpoint extends keyof EndpointResponseMap[TMethod],
> = {
  method: TMethod;
  endpoint: TEndpoint;
  pathParams?: Record<string, string | number>;
  queryParams?: Record<string, string>;
  headers?: Record<string, string>;
};
