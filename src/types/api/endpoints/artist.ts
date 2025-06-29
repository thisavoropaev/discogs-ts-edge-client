import type { Image } from './release.ts';

export interface GetArtistResponse {
  id: number;
  name: string;
  resource_url: string;
  uri: string;
  releases_url: string;
  data_quality: string;
  profile?: string;
  namevariations?: string[];
  urls?: string[];
  images?: Image[];
  members?: Member[];
}

export interface Member {
  active: boolean;
  id: number;
  name: string;
  resource_url: string;
}
