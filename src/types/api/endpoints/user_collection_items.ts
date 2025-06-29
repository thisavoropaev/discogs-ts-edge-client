import type { BasicInformation, Pagination } from './common.ts';

export interface GetUserCollectionItemsResponse {
  pagination: Pagination;
  releases: CollectionItem[];
}

export interface CollectionItem {
  id: number;
  instance_id: number;
  folder_id: number;
  rating: number;
  date_added: string;
  basic_information: BasicInformation;
}
