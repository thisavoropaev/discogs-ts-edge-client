import type { Image } from "./release.ts";

export interface GetLabelResponse {
  id: number;
  name: string;
  resource_url: string;
  uri: string;
  releases_url: string;
  data_quality: string;
  profile?: string;
  contact_info?: string;
  urls?: string[];
  images?: Image[];
  sublabels?: Sublabel[];
}

export interface Sublabel {
  id: number;
  name: string;
  resource_url: string;
}
