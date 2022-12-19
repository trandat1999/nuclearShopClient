export class AdministrativeUnit {
  children? : AdministrativeUnit[]
  id : number| undefined
  code : string | undefined
  name : string | undefined
  parent : AdministrativeUnit | undefined
}
