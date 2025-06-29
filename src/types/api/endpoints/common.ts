export interface Pagination {
  per_page: number;
  items: number;
  page: number;
  urls: {
    next?: string;
    last?: string;
  };
  pages: number;
}

export interface BasicInformationFormat {
  name: string;
  qty: string;
  descriptions?: string[];
  text?: string;
}

export interface BasicInformationLabel {
  name: string;
  catno: string;
  entity_type: string;
  entity_type_name: string;
  id: number;
  resource_url: string;
}

export interface BasicInformationArtist {
  name: string;
  anv: string;
  join: string;
  role: string;
  tracks: string;
  id: number;
  resource_url: string;
}

export interface BasicInformation {
  id: number;
  master_id: number;
  master_url: string | null;
  resource_url: string;
  thumb: string;
  cover_image: string;
  title: string;
  year: number;
  formats: BasicInformationFormat[];
  labels: BasicInformationLabel[];
  artists: BasicInformationArtist[];
  genres: string[];
  styles?: string[];
}
