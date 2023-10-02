export interface IListBaseState {
  total: number;
  filter: any;
  search?: string;
  //columns: any[];
  sorting: string;
  pageSize: number;
  currentPage: number;
  listname?: string;
  fetchPolicy?: string;
  headers?: any;
}

export interface IProviderCore {
  query?: string;
  listname?: string;
  resources?: string;
  headers?: any;
}

export interface IProviderBase extends IProviderCore {
  ID: string;
  pid?: string;
  variants?: boolean;
  q?: string;
  depth?: number;
  headers?: any;
}

export interface IProviderItems extends IProviderCore {
  Ids: any[];
}
