"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const config_1 = require("../config");
const dbConfig = {
    user: config_1.dbUser,
    password: config_1.dbPassword,
    host: config_1.host,
    port: config_1.dbPort,
    database: 'userdatabase',
};
const pool = new pg_1.Pool(dbConfig);
exports.default = pool;
