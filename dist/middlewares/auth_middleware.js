"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
async function authMiddleware(fastify) {
    fastify.decorate('authenticate', async (request, reply) => {
        const authorization = request.headers['authorization'];
        if (!authorization) {
            return reply.status(401).send({ "message": "No token provided" });
        }
        const token = authorization.split(' ')[1];
        try {
            const verified = jsonwebtoken_1.default.verify(token, config_1.ACCESS_TOKEN_SECRET);
            request.user = verified;
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
        // console.log((request as any).user.user_id);
    });
}
exports.default = authMiddleware;
//# sourceMappingURL=auth_middleware.js.map