"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
async function adminAuthMiddleware(fastify) {
    fastify.decorate('adminAuth', async (request, reply) => {
        const authorization = request.headers['authorization'];
        if (!authorization) {
            return reply.status(401).send({ "message": "No token provided" });
        }
        const token = authorization.split(' ')[1];
        try {
            const verified = jsonwebtoken_1.default.verify(token, config_1.ADMIN_ACCESS_TOKEN_SECRET);
            request.admin = verified;
        }
        catch (e) {
            if (e instanceof jsonwebtoken_1.default.TokenExpiredError) {
                return reply.status(401).send({ "message": "Token is expired" });
            }
            else if (e instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                return reply.status(401).send({ "message": "Token verification failed, authorization denied." });
            }
            else {
                return reply.status(500).send(e);
            }
        }
        //console.log((request as any).admin)
    });
}
exports.default = adminAuthMiddleware;
//# sourceMappingURL=admin_auth_middleware.js.map