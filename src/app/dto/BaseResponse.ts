export interface BaseResponse{
  body : any;
  message : string;
  status : string;
  code : number;
}

export interface ErrorResponse{
  errors : any;
  message : string;
  status : string;
  code : number;
  timestamp: any;
  path : string;
}
