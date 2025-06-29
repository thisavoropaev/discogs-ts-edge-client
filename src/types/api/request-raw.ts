import type { EndpointResponseMap } from "./endpoint-response-map.ts";

export type RequestRawParams<
  TMethod extends keyof EndpointResponseMap,
  TEndpoint extends keyof EndpointResponseMap[TMethod],
> = {
  method: TMethod;
  endpoint: TEndpoint;
  pathParams?: Record<string, string | number>;
  queryParams?: Record<string, string | number>;
  headers?: Record<string, string>;
};
