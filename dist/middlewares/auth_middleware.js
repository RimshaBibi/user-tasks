"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function authMiddleware(fastify) {
    fastify.decorate('authenticate', async (request, reply) => {
        const authorization = request.headers['authorization'];
        if (!authorization) {
            return reply.status(403).send('No token provided');
        }
        const token = authorization.split(' ')[1];
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
        try {
            const verified = jsonwebtoken_1.default.verify(token, accessTokenSecret);
            request.user = verified;
        }
        catch (e) {
            if (e instanceof jsonwebtoken_1.default.TokenExpiredError) {
                return reply.status(401).send("Token is expired");
            }
            else if (e instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                return reply.status(401).send("Token verification failed, authorization denied.");
            }
            else {
                return reply.status(500).send(e);
            }
        }
        // console.log((request as any).user.user_id);
    });
}
exports.default = authMiddleware;
