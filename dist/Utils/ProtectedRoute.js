"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function ProtectedRoute(req, res, next) {
    if (!req.cookies.token) {
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
        res.send("token is missing");
        res.end();
        return;
    }
    const JWT_SECRET_TYPE = process.env.JWT_SECRET;
    jsonwebtoken_1.default.verify(req.cookies.token, JWT_SECRET_TYPE, (error, decoded) => {
        if (error) {
            res.cookie("token", "", {
                httpOnly: process.env.NODE_ENV === "production" ? true : false,
                secure: process.env.NODE_ENV === "production" ? true : false,
                path: "/"
            });
            res.cookie("auth", false, {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production" ? true : false,
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
