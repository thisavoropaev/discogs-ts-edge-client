import type { Pagination } from "./common.ts";

export interface GetLabelReleasesResponse {
  pagination: Pagination;
  releases: LabelRelease[];
}

export interface LabelRelease {
  artist: string;
  catno: string;
  format: string;
  id: number;
  resource_url: string;
  status: string;
  thumb: string;
  title: string;
  year: number;
}
