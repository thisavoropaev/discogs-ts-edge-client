import type { Pagination } from "./common.ts";

export interface GetMasterReleaseVersionsResponse {
  pagination: Pagination;
  versions: MasterReleaseVersion[];
}

export interface MasterReleaseVersion {
  id: number;
  title: string;
  resource_url: string;
  thumb: string;
  format: string;
  label: string;
  country: string;
  released: string;
  status: string;
  catno: string;
}
