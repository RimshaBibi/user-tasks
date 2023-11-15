import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export default async function authMiddleware(fastify: FastifyInstance) {
  fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
  
    const authorization = request.headers['authorization'];

    if (!authorization) {
      return reply.status(403).send('No token provided');
    }

    const token = authorization.split(' ')[1];
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET!;
    try{
    const verified = jwt.verify(token,accessTokenSecret);
    (request as any).user = verified;
    }
    catch(e){
      if(e instanceof jwt.TokenExpiredError){
        return reply.status(401).send("Token is expired");
      }
      else if(e instanceof jwt.JsonWebTokenError){
        return reply.status(401).send("Token verification failed, authorization denied.");
      }
      else{
        return reply.status(500).send(e)
      }
     
    }
    // console.log((request as any).user.user_id);
     
  });
}



