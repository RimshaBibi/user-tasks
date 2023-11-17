namespace Interfaces {
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
    token: string;
    user_id: string;
    userEmail: string
  }
}


class UserSchema {
  static postUserSignUpOptions = {
    schema: {
      body: {
        type: 'object',
        required: ['userName', 'userEmail', 'userPassword'],
        properties: {
          userName: { type: 'string' },
          userEmail: { type: 'string', format: 'email' },
          userPassword: { type: 'string' },
        },
      },
      response: {
        201: {
          type: 'object',
          properties: {
            user_id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            salt: { type: 'string' },
            user_password: { type: 'string' },
            token: { type: 'string' },
            status: { type: 'string' },
            createddate: { type: 'string' }
          },
        },
      },
    },
  };
  static postUserSignInOptions = {
    schema: {
      body: {
        type: 'object',
        required: ['userEmail', 'userPassword'],
        properties: {
          userEmail: { type: 'string', format: 'email' },
          userPassword: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            user_id: { type: 'string' },
            email: { type: 'string' },
            user_password: { type: 'string' },
            salt: { type: 'string' },
            token: { type: 'string' },
          },
        },
      },
    },
  };

  static postRefreshTokenOptions = {
    schema: {
      body: {
        type: 'object',
        required: ['token', 'user_id', 'userEmail'],
        properties: {
          token: { type: 'string' },
          user_id: { type: 'string', },
          userEmail: { type: 'string', format: 'email' },
        },
      },
      response: {
        201: {
          type: 'object',
          properties: {
            token: { type: 'string' },
          },
        },
      },
    },
  };
}

export { Interfaces, UserSchema };