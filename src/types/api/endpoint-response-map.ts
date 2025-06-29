import {
  GetReleaseResponse,
  GetUserIdentityResponse,
  GetUserProfileResponse,
} from "./endpoints/index.ts";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type EndpointResponseMap = {
  GET: {
    "/oauth/identity": GetUserIdentityResponse;
    "/users/:username": GetUserProfileResponse;
    "/releases/:release_id": GetReleaseResponse;
  };
};
