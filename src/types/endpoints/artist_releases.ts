import type { Pagination } from "./common.ts";

export interface GetArtistReleasesResponse {
  pagination: Pagination;
  releases: ArtistRelease[];
}

export interface ArtistRelease {
  id: number;
  title: string;
  resource_url: string;
  thumb: string;
  artist: string;
  role: string;
  year: number;
  type: "master" | "release";
  format?: string;
  label?: string;
  status?: string;
  main_release?: number;
}
