"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
if (process.env.NODE_ENV !== "production") {
    dotenv_1.default.config();
}
const express_1 = __importDefault(require("express"));
const App = (0, express_1.default)();
const http_1 = __importDefault(require("http"));
const Server = new http_1.default.Server(App);
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const io = require("socket.io")(Server, {
    origin: process.env.NODE_ENV === "production"
        ? JSON.stringify(process.env.ORIGIN)
        : "*",
});
module.exports.io = io;
const PORT = process.env.NODE_ENV === "production" ? process.env.PORT : 5000;
const cors_1 = __importDefault(require("cors")); // Manage allowed Request);
const compression_1 = __importDefault(require("compression"));
App.use(express_1.default.static(path_1.default.resolve(__dirname, "public")));
App.set("io", io);
App.use(express_1.default.json());
App.use(express_1.default.urlencoded({ extended: false }));
App.use((0, cookie_parser_1.default)());
App.use((0, cors_1.default)({
    origin: "*"
}));
App.use((0, compression_1.default)());
const Routes_1 = __importDefault(require("./Apis/v1/Users/Routes"));
const Routes_2 = __importDefault(require("./Apis/v1/Posts/Routes"));
const Routes_3 = __importDefault(require("./Apis/v1/Comment/Routes"));
const Routes_4 = __importDefault(require("./Apis/v1/Replies/Routes"));
const Routes_5 = __importDefault(require("./Apis/v1/Chat/Routes"));
const Routes_6 = __importDefault(require("./Apis/v1/Messages/Routes"));
App.use("/", Routes_1.default);
App.use("/post", Routes_2.default);
App.use("/comment", Routes_3.default);
App.use("/replies", Routes_4.default);
App.use("/chat", Routes_5.default);
App.use("/messages", Routes_6.default);
const fs_1 = __importDefault(require("fs"));
App.all("/resume", (Req, res, next) => {
    res.redirect("/Ahmad_Adel_Resume.pdf");
});
App.all("/Ahmad_Adel_Resume.pdf", (Req, res, next) => {
    const Resume = fs_1.default.createWriteStream("../resources/Ahmad Adel Resume.pdf");
    Resume.on("connection", (ee) => {
        Resume.pipe(res);
    });
    Resume.on("error", err => {
        res.send("<h1>Some thing went wrong</h1>");
    });
});
/**
 * Catch errors from Routes
 */
App.use((err, _req, res, _next) => {
    res.status(404);
    res.send(err.message || "not found");
    res.end();
    return;
});
const jsonwebtoken_1 = require("jsonwebtoken");
io.on("connection", function (socket) {
    if (!socket.handshake.headers.auth || !socket.handshake.headers.chat_id) {
        return;
    }
    const TOKEN = socket.handshake.headers.auth.split(" ")[1];
    if (TOKEN.length < 2) {
        return;
    }
    const CHAT_ID = socket.handshake.headers.chat_id;
    let decoded = (0, jsonwebtoken_1.verify)(TOKEN, process.env.JWT_SECRET || "") || { id: null, username: null };
    if (CHAT_ID.search(decoded.id)) {
        return;
    }
    else {
        socket.join(CHAT_ID);
    }
});
console.log(process.env.NODE_ENV);
Server.listen(PORT, () => {
    console.log(`Running ${process.env.NODE_ENV === "production" ? "Production" : "Development"} on port ${PORT} Baby!`);
});
