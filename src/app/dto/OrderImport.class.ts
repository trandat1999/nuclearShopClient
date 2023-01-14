import {Warehouse} from "./Warehouse.class";
import {Publisher} from "./Publisher.class";
import { Product } from "./Product.class";

export interface OrderImport{
  id?: number;
  orderDate?:Date;
  staffOrder?:String;
  status?:string;
  staffFinished?:string;
  dateFinished?:Date;
  warehouse?:Warehouse;
  publisher?:Publisher;
  products?:ProductImport[];
}

export interface ProductImport{
  id?:number;
  product?:Product;
  price?:number;
  quantity?:number;
}
