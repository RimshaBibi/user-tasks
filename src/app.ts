import fastify, { FastifyInstance } from 'fastify';
import Routes from "./routes/routes"
import authMiddleware from './middlewares/auth_middleware';
import { PORT } from "./config"

const app: FastifyInstance = fastify({ logger: true });


const PORTN: number = parseInt(PORT || '8080');
app.register(authMiddleware)
app.register(Routes.routes);



app.listen({ port: PORTN }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})