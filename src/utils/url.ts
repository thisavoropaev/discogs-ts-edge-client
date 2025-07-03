import type { QueryParams } from "../types/common.ts";

export const buildPath = (
  endpoint: string,
  pathParams: Record<string, string | number>,
): string => {
  let path = endpoint;

  // Replace path parameters in both formats: {param} and :param
  for (const [key, value] of Object.entries(pathParams)) {
    path = path.replace(`{${key}}`, String(value));
    path = path.replace(`:${key}`, String(value));
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
