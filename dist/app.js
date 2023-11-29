"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const routes_1 = __importDefault(require("./routes/routes"));
const auth_middleware_1 = __importDefault(require("./middlewares/auth_middleware"));
const config_1 = require("./config");
const app = (0, fastify_1.default)({ logger: true });
const PORTN = parseInt(config_1.PORT || '8080');
app.register(auth_middleware_1.default);
app.register(routes_1.default.routes);
app.listen({ port: PORTN }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
