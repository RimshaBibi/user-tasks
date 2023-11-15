"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
class UserSchema {
}
exports.UserSchema = UserSchema;
UserSchema.postUserSignUpOptions = {
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
                    token: { type: 'string' }
                },
            },
        },
    },
};
UserSchema.postUserSignInOptions = {
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
UserSchema.postRefreshTokenOptions = {
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
