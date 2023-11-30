import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
import { ADMIN_ACCESS_TOKEN_SECRET } from '../config';

declare module 'fastify' {
  interface FastifyInstance {
    adminAuth: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export default async function adminAuthMiddleware(fastify: FastifyInstance) {
  fastify.decorate('adminAuth', async (request: FastifyRequest, reply: FastifyReply) => {

    const authorization = request.headers['authorization'];

    if (!authorization) {
      return reply.status(401).send({ "message": "No token provided" });
    }

    const token = authorization.split(' ')[1];
    try {
      const verified = jwt.verify(token, ADMIN_ACCESS_TOKEN_SECRET);
      (request as any).admin = verified;
    }
    catch (e) {
      if (e instanceof jwt.TokenExpiredError) {
        return reply.status(401).send({ "message": "Token is expired" });
      }
      else if (e instanceof jwt.JsonWebTokenError) {
        return reply.status(401).send({ "message": "Token verification failed, authorization denied." });
      }
      else {
        return reply.status(500).send(e)
      }

    }
    //console.log((request as any).admin)

  });

}



