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

export const buildQueryString = (
  queryParams?: Record<string, string>,
): string => {
  if (!queryParams || Object.keys(queryParams).length === 0) return "";

  const params = new URLSearchParams();
  Object.entries(queryParams).forEach(([key, value]) => {
    params.append(key, String(value));
  });

  return params.toString();
};
