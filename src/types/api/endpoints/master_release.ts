import type { Artist, Image, Track, Video } from './release.ts';

export interface GetMasterReleaseResponse {
  id: number;
  main_release: number;
  main_release_url: string;
  resource_url: string;
  versions_url: string;
  title: string;
  artists: Artist[];
  genres: string[];
  styles: string[];
  year: number;
  tracklist: Track[];
  images: Image[];
  videos: Video[];
  data_quality: string;
  num_for_sale: number;
  lowest_price: number;
}
