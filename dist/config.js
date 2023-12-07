"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.sendingMail = exports.ACCESS_TOKEN_SECRET = exports.ADMIN_ACCESS_TOKEN_SECRET = exports.host = exports.dbUser = exports.dbPort = exports.dbPassword = exports.mailPassword = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mailPassword = process.env.mailPassword;
exports.mailPassword = mailPassword;
const dbPassword = process.env.dbPassword;
exports.dbPassword = dbPassword;
const dbPort = process.env.dbPort;
exports.dbPort = dbPort;
const dbUser = process.env.dbUser;
exports.dbUser = dbUser;
const host = process.env.host;
exports.host = host;
const ADMIN_ACCESS_TOKEN_SECRET = process.env.ADMIN_ACCESS_TOKEN_SECRET;
exports.ADMIN_ACCESS_TOKEN_SECRET = ADMIN_ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
exports.ACCESS_TOKEN_SECRET = ACCESS_TOKEN_SECRET;
const sendingMail = process.env.sendingMail;
exports.sendingMail = sendingMail;
const PORT = process.env.PORT;
exports.PORT = PORT;
//# sourceMappingURL=config.js.map