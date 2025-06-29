export interface GetUserCollectionFoldersResponse {
  folders: CollectionFolder[];
}

export interface CollectionFolder {
  id: number;
  name: string;
  count: number;
  resource_url: string;
}
