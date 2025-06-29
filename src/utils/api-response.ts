import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";
import type { DiscogsApiError } from "@/types/mod.ts";

export const handleApiResponse = async <T>(
  response: Response,
): Promise<Result<T, DiscogsApiError>> => {
  try {
    const text = await response.text();

    if (!response.ok) {
      return err({
        message: text || response.statusText,
        statusCode: response.status,
        type: response.status === 401 ? "AUTH_ERROR" : "API_ERROR",
      });
    }

    const data = JSON.parse(text) as T;
    return ok(data);
  } catch (error) {
    return err({
      message: error instanceof Error ? error.message : "Unknown error",
      type: "NETWORK_ERROR",
    });
  }
};
