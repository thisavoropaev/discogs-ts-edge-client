import type { Pagination } from "./common.ts";

export interface GetSearchResponse {
  pagination: Pagination;
  results: SearchResult[];
}

interface SearchResultBase {
  id: number;
  resource_url: string;
  uri: string;
  title: string;
  thumb: string;
  user_data?: {
    in_wantlist: boolean;
    in_collection: boolean;
  };
}

export interface SearchResultRelease extends SearchResultBase {
  type: "release";
  country?: string;
  format?: string[];
  label?: string[];
  catno?: string;
  year?: string;
  genre?: string[];
  style?: string[];
  barcode?: string[];
  community?: {
    want: number;
    have: number;
  };
}

export interface SearchResultMaster extends SearchResultBase {
  type: "master";
  country?: string;
  format?: string[];
  label?: string[];
  catno?: string;
  year?: string;
  genre?: string[];
  style?: string[];
  barcode?: string[];
  community?: {
    want: number;
    have: number;
  };
}

export interface SearchResultArtist extends SearchResultBase {
  type: "artist";
}

export interface SearchResultLabel extends SearchResultBase {
  type: "label";
  catno?: string;
}

export type SearchResult =
  | SearchResultRelease
  | SearchResultMaster
  | SearchResultArtist
  | SearchResultLabel;
