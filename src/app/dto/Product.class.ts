import { Category } from "./Category";

export interface Product{
  name : string;
  code : string;
  id? : number;
  description : string;
  shortDescription : string;
  files : File[];
  categories : Category[];
}

export interface File{
  id : number;
  downloadUrl : string;

  fileName : string;

  fileSize : number;
}
