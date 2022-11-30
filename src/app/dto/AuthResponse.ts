export interface CurrentUser {
  user : User
}

export interface User {
  username : string;
  roles : Role[];
  person : Person;
}

export interface Role {
  id : number;
  name : string;
  description : string;
}

export class Person {
  lastName : string | undefined;
  firstName : string | undefined;
  gender : string | undefined;
  birthDate : Date | undefined;
  phoneNumber : string | undefined;
  photoFile : Attachment | undefined;
}

export interface Attachment {
  downloadUrl : string;
}

export interface UserRequest {
  username : string;
  password : string;
  email : string;
  person : Person;
  roles : Role[];
}

