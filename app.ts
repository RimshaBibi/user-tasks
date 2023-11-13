import fastify, { FastifyInstance } from 'fastify';
import dotenv from 'dotenv'
import Routes from "./routes/routes"
dotenv.config()


const app: FastifyInstance = fastify({ logger: true });


const PORT: number = parseInt(process.env.PORT || '8080');

app.register(Routes.routes);

app.listen({ port: PORT }, (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`Server listening at ${address}`)
  })