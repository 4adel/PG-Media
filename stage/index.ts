import DotEnv from "dotenv";
if (process.env.NODE_ENV !== "production") DotEnv.config();

import Express from "express";
import Http from "http";
import Path from "path";
import Cors from "cors"; // Manage allowed Request);
import compression from "compression";

const App = Express();
const Server = new Http.Server(App);
const dev = process.env.NODE_ENV === "development";

const io = require("socket.io")(Server, {
  origin: dev ? JSON.stringify(process.env.ORIGIN) : "*",
});

const PORT = dev ? process.env.PORT : 5000;

App.use(Express.static(Path.resolve(__dirname, "public")));
App.set("io", io);
App.use(Express.json());
App.use(Express.urlencoded({ extended: false }));
App.use(Express.static("public"));
App.use(compression());

App.use(
  Cors({
    origin: "*",
  })
);

import User from "./Apis/v1/Users/Routes";
import Post from "./Apis/v1/Posts/Routes";
import CommentRoute from "./Apis/v1/Comment/Routes";
import Replay from "./Apis/v1/Replies/Routes";
import Chat from "./Apis/v1/Chat/Routes";
import Message from "./Apis/v1/Messages/Routes";
import DB from "./Utils/Postgres";

App.use("/", User);
App.use("/post", Post);
App.use("/comment", CommentRoute);
App.use("/replies", Replay);
App.use("/chat", Chat);
App.use("/messages", Message);

App.get("/resume", (Req, res, next) => {
  res.sendFile("../resources/Ahmad-Adel-Resume.pdf");
});

/**
 * Catch errors from Routes
 */
App.use((err: any, _req: any, res: any, _next: any) => {
  res.status(404);
  res.send(err.message || "not found");
  res.end();
  return;
});

DB.connect().then(() => {
  Server.listen(PORT, () => {
    console.log(
      `Running ${
        process.env.NODE_ENV === "production" ? "Production" : "Development"
      } on port ${PORT} Baby!`
    );
  });
});

export { io };
