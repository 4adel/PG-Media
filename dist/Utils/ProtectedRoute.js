"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function ProtectedRoute(req, res, next) {
    const cookies = { token: "", auth: "" };
    req.headers.cookie.split('; ').forEach((tok) => {
        const TOKEN = tok.split("=");
        cookies[TOKEN[0]] = TOKEN[1];
    });
    try {
        if (!cookies) {
            throw "Missing authorization headers";
        }
        if (!cookies.token) {
            throw "Missing Authrization token";
        }
    }
    catch (error) {
        res.status(401);
        res.send(error);
        res.end();
        return;
    }
    const JWT_SECRET_TYPE = process.env.JWT_SECRET;
    jsonwebtoken_1.default.verify(cookies.token, JWT_SECRET_TYPE, (error, decoded) => {
        if (error) {
            res.cookie("token", null, {
                httpOnly: process.env.NODE_ENV === "production" ? true : false,
                secure: process.env.NODE_ENV === "production" ? true : false,
                path: "/"
            });
            res.cookie("auth", false, {
                httpOnly: false,
                secure: false,
                path: "/"
            });
            res.status(401);
            res.send("Invalid authorization token");
            res.end();
            return;
        }
        req.user = decoded;
        return next();
    });
}
exports.default = ProtectedRoute;
;
