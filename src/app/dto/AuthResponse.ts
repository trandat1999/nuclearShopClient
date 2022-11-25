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

export interface Person {
  lastName : string;
  firstName : string;
  photoFile : Attachment;
}

export interface Attachment {
  downloadUrl : string;
}

