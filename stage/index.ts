import DotEnv from 'dotenv';

if (process.env.NODE_ENV !== "production") {
	DotEnv.config();
}

import Express from "express";
const App = Express();
import Http from "http";
const Server = new Http.Server(App);
import Path from "path";
import cookieParser from 'cookie-parser';

const io = require("socket.io")(Server, {
	origin:
		process.env.NODE_ENV === "production"
			? JSON.stringify(process.env.ORIGIN)
			: "*",
});

module.exports.io = io;

const PORT = process.env.NODE_ENV === "production" ? process.env.PORT : 5000;
import Cors from "cors"; // Manage allowed Request);
import compression from "compression";

App.use(Express.static(Path.resolve(__dirname, "public")));

App.set("io", io);
App.use(Express.json());
App.use(Express.urlencoded({ extended: false }));
App.use(cookieParser())

App.use(
	Cors({
		origin: "*"
	})
);
App.use(compression());

import User from "./Apis/v1/Users/Routes"
import Post from "./Apis/v1/Posts/Routes"
import CommentRoute from "./Apis/v1/Comment/Routes"
import Replay from "./Apis/v1/Replies/Routes"
import Chat from "./Apis/v1/Chat/Routes"
import Message from "./Apis/v1/Messages/Routes"

App.use("/", User);
App.use("/post", Post);
App.use("/comment", CommentRoute);
App.use("/replies", Replay);
App.use("/chat", Chat);
App.use("/messages", Message);
import FS from "fs";

App.all("/resume", (Req, res, next) => {
	res.redirect("/Ahmad_Adel_Resume.pdf")
})


App.all("/Ahmad_Adel_Resume.pdf", (Req, res, next) => {
	const Resume = FS.createWriteStream("../resources/Ahmad_Adel_Resume.pdf")
	Resume.on("connection", (ee) => {
		Resume.pipe(res)
	})
	Resume.on("error", err => {
		res.send("<h1>Some thing went wrong</h1>")
	})
})

/**
 * Catch errors from Routes
 */
App.use((err: any, _req: any, res: any, _next: any) => {
	res.status(404);
	res.send(err.message || "not found");
	res.end();
	return;
});

import { verify } from "jsonwebtoken";


io.on("connection", function (socket: any) {
	if (!socket.handshake.headers.auth || !socket.handshake.headers.chat_id) {
		return;
	}

	const TOKEN = socket.handshake.headers.auth.split(" ")[1];

	if (TOKEN.length < 2) {
		return;
	}

	const CHAT_ID = socket.handshake.headers.chat_id;

	let decoded: any = verify(TOKEN, process.env.JWT_SECRET || "") || { id: null, username: null };


	if (CHAT_ID.search(decoded.id)) {
		return;
	} else {
		socket.join(CHAT_ID);
	}
});

console.log(process.env.NODE_ENV)

Server.listen(PORT, () => {
	console.log(
		`Running ${process.env.NODE_ENV === "production" ? "Production" : "Development"
		} on port ${PORT} Baby!`
	);
})
