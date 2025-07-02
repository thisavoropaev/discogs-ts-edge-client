import "dotenv";
import { assertEquals, assertExists } from "@std/assert";
import { createDiscogsClient } from "@/client/discogs-client.ts";

Deno.test("Discogs Client Integration Tests", async (t) => {
  const credentials = {
    consumerKey: Deno.env.get("DISCOGS_CONSUMER_KEY") || "",
    consumerSecret: Deno.env.get("DISCOGS_CONSUMER_SECRET") || "",
    token: Deno.env.get("DISCOGS_ACCESS_TOKEN") || "",
    tokenSecret: Deno.env.get("DISCOGS_ACCESS_TOKEN_SECRET") || "",
  };

  // Skip tests if credentials are not provided
  if (
    !credentials.consumerKey ||
    !credentials.consumerSecret ||
    !credentials.token ||
    !credentials.tokenSecret
  ) {
    console.log("⚠️  Skipping integration tests - missing credentials");
    return;
  }

  const client = createDiscogsClient({
    credentials,
    userAgent: "DiscogsClient/1.0 +https://github.com/test/discogs-deno-client",
  });

  await t.step(
    "GET /oauth/identity - should return user identity",
    async () => {
      const result = await client.request({
        method: "GET",
        endpoint: "/oauth/identity",
      });

      if (result.isErr()) {
        console.error("Identity error:", result.error);
        throw new Error(`Identity request failed: ${result.error.message}`);
      }

      const identity = result.value;
      assertExists(identity.id);
      assertExists(identity.username);
      assertExists(identity.resource_url);
      assertEquals(typeof identity.id, "number");
      assertEquals(typeof identity.username, "string");
      assertEquals(typeof identity.resource_url, "string");

      console.log(`✅ Identity: ${identity.username} (ID: ${identity.id})`);
    },
  );

  await t.step(
    "GET /releases/:release_id - should return release details",
    async () => {
      // Using a well-known release ID (Nevermind by Nirvana)
      const releaseId = "249504";

      const result = await client.request({
        method: "GET",
        endpoint: "/releases/:release_id",
        pathParams: { release_id: releaseId },
      });

      if (result.isErr()) {
        console.error("Release error:", result.error);
        throw new Error(`Release request failed: ${result.error.message}`);
      }

      const release = result.value;
      assertExists(release.id);
      assertExists(release.title);
      assertExists(release.artists);
      assertEquals(typeof release.id, "number");
      assertEquals(typeof release.title, "string");
      assertEquals(Array.isArray(release.artists), true);
      assertEquals(release.id, parseInt(releaseId));

      console.log(
        `✅ Release: ${release.title} by ${release.artists[0]?.name}`,
      );
    },
  );

  await t.step(
    "GET /users/:username - should return user profile",
    async () => {
      // First get current user identity to use their username
      const identityResult = await client.request({
        method: "GET",
        endpoint: "/oauth/identity",
      });

      if (identityResult.isErr()) {
        throw new Error("Failed to get identity for user profile test");
      }

      const username = identityResult.value.username;

      const result = await client.request({
        method: "GET",
        endpoint: "/users/:username",
        pathParams: { username },
      });

      if (result.isErr()) {
        console.error("User profile error:", result.error);
        throw new Error(`User profile request failed: ${result.error.message}`);
      }

      const profile = result.value;
      assertExists(profile.id);
      assertExists(profile.username);
      assertExists(profile.resource_url);
      assertEquals(typeof profile.id, "number");
      assertEquals(typeof profile.username, "string");
      assertEquals(typeof profile.resource_url, "string");
      assertEquals(profile.username, username);

      console.log(`✅ User Profile: ${profile.username} (ID: ${profile.id})`);
    },
  );

  await t.step(
    "Error handling - should handle invalid release ID",
    async () => {
      const result = await client.request({
        method: "GET",
        endpoint: "/releases/:release_id",
        pathParams: { release_id: "invalid-id" },
      });

      // Should return an error for invalid release ID
      assertEquals(result.isErr(), true);

      if (result.isErr()) {
        assertExists(result.error.message);
        assertExists(result.error.type);
        console.log(
          `✅ Error handling: ${result.error.type} - ${result.error.message}`,
        );
      }
    },
  );

  await t.step(
    "Query parameters - should work with additional parameters",
    async () => {
      const result = await client.request({
        method: "GET",
        endpoint: "/releases/:release_id",
        pathParams: { release_id: "249504" },
        queryParams: { curr_abbr: "USD" },
      });

      if (result.isErr()) {
        console.error("Query params error:", result.error);
        throw new Error(`Query params request failed: ${result.error.message}`);
      }

      const release = result.value;
      assertExists(release.id);
      assertExists(release.title);

      console.log(`✅ Query params: ${release.title}`);
    },
  );

  await t.step(
    "Custom headers - should work with additional headers",
    async () => {
      const result = await client.request({
        method: "GET",
        endpoint: "/oauth/identity",
        headers: {
          "Accept-Language": "en-US",
        },
      });

      if (result.isErr()) {
        console.error("Custom headers error:", result.error);
        throw new Error(
          `Custom headers request failed: ${result.error.message}`,
        );
      }

      const identity = result.value;
      assertExists(identity.id);
      assertExists(identity.username);

      console.log(`✅ Custom headers: ${identity.username}`);
    },
  );
});
