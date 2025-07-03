import type { EndpointResponseMap } from "./endpoint-response-map.ts";
import type { QueryParams } from "./common.ts";

export type RequestParams<
  TMethod extends keyof EndpointResponseMap,
  TEndpoint extends keyof EndpointResponseMap[TMethod],
> = {
  method: TMethod;
  endpoint: TEndpoint;
  pathParams?: Record<string, string | number>;
  queryParams?: QueryParams;
  headers?: Record<string, string>;
};
