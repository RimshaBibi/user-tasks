export class UserSchema {
  postUserSignUpOptions = {
    schema: {
      body: {
        type: 'object',
        required: ['userName', 'userEmail', 'userPassword'],
        properties: {
          userName: { type: 'string' },
          userEmail: { type: 'string', format: 'email', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' },
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
            token: { type: 'string' },
            status: { type: 'string' },
            createddate: { type: 'string' },
            role: { type: 'string' },
          },
        },
      },
    },
  };
  postUserSignInOptions = {
    schema: {
      body: {
        type: 'object',
        required: ['userEmail', 'userPassword'],
        properties: {
          userEmail: { type: 'string', format: 'email', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' },
          userPassword: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            user_id: { type: 'string' },
            email: { type: 'string' },
            token: { type: 'string' },
          },
        },
      },
    },
  };

  postRefreshTokenOptions = {
    schema: {
      body: {
        type: 'object',
        required: ['token'],
        properties: {
          token: { type: 'string' },
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
