"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
let Conn = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? true : false,
});
Conn.connect();
exports.default = Conn;
