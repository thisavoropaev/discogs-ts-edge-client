import { assertEquals, assertExists } from "@std/assert";
import { createOAuthClient } from "@/auth/mod.ts";
import type { OAuthCredentials } from "@/types/auth.ts";
import { API_BASE_URL } from "@/config/constants.ts";

Deno.test("OAuth Client - createOAuthClient", () => {
  const credentials: OAuthCredentials = {
    consumerKey: "test-key",
    consumerSecret: "test-secret",
    token: "test-token",
    tokenSecret: "test-token-secret",
  };

  const client = createOAuthClient({ credentials });

  assertExists(client);
  assertExists(client.sign);
  assertExists(client.createAuthHeader);
  assertExists(client.request);
});

Deno.test("OAuth Client - sign method returns Result", async () => {
  const credentials: OAuthCredentials = {
    consumerKey: "test-key",
    consumerSecret: "test-secret",
    token: "test-token",
    tokenSecret: "test-token-secret",
  };

  const client = createOAuthClient({ credentials });
  const result = await client.sign("GET", "https://api.example.com/test");

  assertEquals(result.isOk(), true);
  if (result.isOk()) {
    assertExists(result.value);
    assertEquals(typeof result.value, "string");
  }
});

Deno.test("OAuth Client - createAuthHeader returns Result", async () => {
  const credentials: OAuthCredentials = {
    consumerKey: "test-key",
    consumerSecret: "test-secret",
    token: "test-token",
    tokenSecret: "test-token-secret",
  };

  const client = createOAuthClient({ credentials });
  const result = await client.createAuthHeader(
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

Deno.test("OAuth Client - baseUrl configuration", () => {
  const credentials: OAuthCredentials = {
    consumerKey: "test-key",
    consumerSecret: "test-secret",
  };

  const client = createOAuthClient({
    credentials,
    baseUrl: API_BASE_URL,
  });

  assertExists(client);
});

Deno.test("OAuth Client - error handling", async () => {
  const credentials: OAuthCredentials = {
    consumerKey: "", // Invalid credentials to trigger error
    consumerSecret: "",
  };

  const client = createOAuthClient({ credentials });
  const result = await client.sign("GET", "https://api.example.com/test");

  // Should handle errors gracefully and return a Result.Err
  assertEquals(result.isErr(), true);
});
