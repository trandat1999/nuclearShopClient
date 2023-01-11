import {AdministrativeUnit} from "./AdministrativeUnit.class";

export class Warehouse{
  name? : string;
  code? : string;
  id? : number;
  description? : string;
  address?:string;
  acreage?:number;
  phoneNumber?:string;
  administrativeUnit?:AdministrativeUnit;
  province?:AdministrativeUnit
  district?:AdministrativeUnit
}
