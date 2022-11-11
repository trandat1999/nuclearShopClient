export interface BaseResponse{
  body : any;
  message : string;
  status : string;
  code : number;
}

export interface ErrorResponse{
  body : any;
  message : string;
  status : string;
  code : number;
}
