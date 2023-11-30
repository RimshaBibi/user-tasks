export namespace AInterfaces {
  export interface IAdminSignUpReq {
    userName: string;
    userEmail: string;
    userPassword: string;
  }
  export interface IAdminSignupReply {
    user_id: string;
    name: string;
    email: string;
    user_password: string;
    salt: string;
    role: string
  }

  export interface IAdminSignInReq {
    userEmail: string;
    userPassword: string;
  }

  export interface IAdminSignInReply {
    user_id: string,
    email: string,
    user_password: string
    salt: string
  }
  export interface IAdminIdReq {
    id: string;
  }
  export interface IAdminBodyReq {
    status: string;
  }
  export interface IRefreshReq {
    token: string
  }
}