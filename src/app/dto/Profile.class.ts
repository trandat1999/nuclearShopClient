export interface Person {
  birthDate : Date ;
  lastName : string;
  firstName : string;
  gender : string;
  phoneNumber : string;
  idNumber : string;
  idNumberIssueBy : string;
  idNumberIssueDate : any;
  photoFile : Attachment;
  email : string;
}

export interface Attachment {
  id : number
  downloadUrl : string;
}

export interface Profile{
  person : Profile;
}
