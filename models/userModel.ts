namespace Interfaces{
export interface IUserSignUpReq {
    userName: string;
    userEmail:string;
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
    userEmail:string;
    userPassword: string;
  }

export interface ISignInReply {
    email:string,
    user_password:string
    salt:string
}

export interface Task {
    task_id: string;
    title: string;
    description: string;
    user_id: string;
  }
}


class UserSchema{
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
            salt:{type:'string'},
            user_password: { type: 'string' }, 
           
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
            user_id:{type:'string'},
            email: { type: 'string' }, 
            user_password: { type: 'string' }, 
            salt:{type: 'string'}
          },
        },
      },
    },
  };
}

export {Interfaces,UserSchema} ;