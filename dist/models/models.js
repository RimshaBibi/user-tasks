"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = void 0;
class Schema {
}
exports.Schema = Schema;
Schema.postUserSignUpOptions = {
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
                    userName: { type: 'string' },
                    userEmail: { type: 'string' },
                    salt: { type: 'string' },
                    newPassword: { type: 'string' },
                },
            },
        },
    },
};
Schema.postUserSignInOptions = {
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
                    email: { type: 'string' },
                    user_password: { type: 'string' },
                    salt: { type: 'string' }
                },
            },
        },
    },
};
