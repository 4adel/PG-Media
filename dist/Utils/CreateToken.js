"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JWT = require("jsonwebtoken");
function CreateToken({ id, username }) {
    if (!id || !username) {
        return false;
    }
    return JWT.sign({ id, username }, process.env.JWT_SECRET);
}
exports.default = CreateToken;
