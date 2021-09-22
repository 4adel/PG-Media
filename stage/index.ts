if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

import Express from "express";
const App = Express();
import Http from "http";
const Server = new Http.Server(App);
import Path from "path";

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

App.use(
  Cors({
    origin: "*"
  })
);
App.use(compression());

import User from "./Apis/v1/Users/Routes"
import Post from "./Apis/v1/Posts/Routes"
import CommentRoute from "./Apis/v1/Comment/Routes"
import Replay from "./Apis/v1/Replys/Routes"
import Chat from "./Apis/v1/Chat/Routes"
import Messege from "./Apis/v1/Messeges/Routes"

App.use("/users", User);
App.use("/posts", Post);
App.use("/comments", CommentRoute);
App.use("/replies", Replay);
App.use("/chat", Chat);
App.use("/messages", Messege);


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


io.on("connection", function(socket: any) {
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

Server.listen(PORT, () => {
  console.log(
    `Running ${
      process.env.NODE_ENV === "production" ? "Production" : "Development"
    } on port ${PORT} Baby!`
  );
});
