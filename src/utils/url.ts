import type { QueryParams } from "../types/common.ts";

export const buildPath = (
  endpoint: string,
  pathParams: Record<string, string> | undefined,
): string => {
  if (!pathParams) {
    return endpoint;
  }

  let path = endpoint;

  for (const [key, value] of Object.entries(pathParams)) {
    path = path.replace(`:${key}`, value);
  }

  return path;
};

export const buildUrlWithParams = (
  initialUrl: string,
  queryParams?: QueryParams,
) => {
  const url = new URL(initialUrl);

  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  return url.toString();
};
