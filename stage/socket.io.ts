import { verify } from "jsonwebtoken";
import { io } from "./index";

io.on("connection", function (socket: any) {
  if (!socket.handshake.headers.auth || !socket.handshake.headers.chat_id) {
    return;
  }

  const TOKEN = socket.handshake.headers.auth.split(" ")[1];

  if (TOKEN.length < 2) {
    return;
  }

  const CHAT_ID = socket.handshake.headers.chat_id;

  let decoded: any = verify(TOKEN, process.env.JWT_SECRET || "") || {
    id: null,
    username: null,
  };

  if (CHAT_ID.search(decoded.id)) {
    return;
  } else {
    socket.join(CHAT_ID);
  }
});
