export interface LoginAccount {
  loginId: string;
  password: string;
}

export interface ResponseAccount {
  loginId: number;
}

export interface ResponseOrderAccount {
  username: string;
}

export interface ResponseTokens {
  access_token: string;
  refresh_token: string;
}
