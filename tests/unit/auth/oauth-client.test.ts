import { assertEquals, assertExists } from "@std/assert";
import { createAuthHeader, _internal } from "@/auth.ts";
import type { OAuthCredentials } from "@/types/auth.ts";

Deno.test("OAuth - createAuthHeader function exists", () => {
  assertExists(createAuthHeader);
  assertEquals(typeof createAuthHeader, "function");
});

Deno.test("OAuth - internal sign function", async () => {
  const credentials: OAuthCredentials = {
    consumerKey: "test-key",
    consumerSecret: "test-secret",
    token: "test-token",
    tokenSecret: "test-token-secret",
  };

  const result = await _internal.generateOAuthSignature({
    credentials,
    method: "GET",
    url: "https://api.example.com/test",
  });

  assertEquals(result.isOk(), true);
  if (result.isOk()) {
    assertExists(result.value);
    assertEquals(typeof result.value, "string");
  }
});

Deno.test("OAuth - createAuthHeader returns Result", async () => {
  const credentials: OAuthCredentials = {
    consumerKey: "test-key",
    consumerSecret: "test-secret",
    token: "test-token",
    tokenSecret: "test-token-secret",
  };

  const result = await createAuthHeader(
    credentials,
    "GET",
    "https://api.example.com/test",
  );

  assertEquals(result.isOk(), true);
  if (result.isOk()) {
    assertExists(result.value);
    assertEquals(typeof result.value, "string");
    assertEquals(result.value.startsWith("OAuth "), true);
  }
});

Deno.test("OAuth - error handling", async () => {
  const credentials: OAuthCredentials = {
    consumerKey: "", // Invalid credentials to trigger error
    consumerSecret: "",
  };

  const result = await createAuthHeader(credentials, "GET", "https://api.example.com/test");

  // Should handle errors gracefully and return a Result.Err
  assertEquals(result.isErr(), true);
});
