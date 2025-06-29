import type { BasicInformation, Pagination } from './common.ts';

export interface GetUserWantlistResponse {
  pagination: Pagination;
  wants: WantlistItem[];
}

export interface WantlistItem {
  id: number;
  resource_url: string;
  rating: number;
  date_added: string;
  basic_information: BasicInformation;
  notes?: string;
}
