export interface LoginRequest {
  username: string;
  password: string;
  recaptchaResponse : any
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  username: string;
}

