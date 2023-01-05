import {AdministrativeUnit} from "./AdministrativeUnit.class";

export class Publisher{
  name? : string;
  code? : string;
  id? : number;
  description? : string;
  address?:string;
  administrativeUnit?:AdministrativeUnit;
  province?:AdministrativeUnit
  district?:AdministrativeUnit
}
