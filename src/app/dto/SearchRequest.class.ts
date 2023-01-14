export interface SearchRequest{
  keyword : string
  pageIndex : number
  pageSize : number
}
export interface WarehouseSearch{
  keyword: string;
  pageIndex: number;
  pageSize: number;
  provinceId?: number;
  districtId?: number;
  communeId?: number;
}

export interface OrderImportSearch{
  keyword: string;
  pageIndex: number;
  pageSize: number;
  fromDate?:Date;
  toDate?:Date;
  publisherId?: number;
  warehouseId?: number;
}
