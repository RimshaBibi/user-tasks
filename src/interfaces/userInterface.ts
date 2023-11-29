export namespace Interfaces {
  export interface IUserSignUpReq {
    userName: string;
    userEmail: string;
    userPassword: string;
  }

  export interface IUserSignupReply {
    user_id: string;
    name: string;
    email: string;
    user_password: string;
    salt: string;
  }

  export interface IUserSignInReq {
    userEmail: string;
    userPassword: string;
  }

  export interface ISignInReply {
    user_id: string,
    email: string,
    user_password: string
    salt: string
  }

  export interface IRefreshReq {
    token: string
  }
}