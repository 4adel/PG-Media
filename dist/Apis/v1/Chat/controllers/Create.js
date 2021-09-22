"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Postgres_1 = __importDefault(require("../../../../Utils/Postgres"));
;
function default_1(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user_id = req.user.id;
        const Data = req.body;
        if (!Data.chat_with) {
            res.status(420);
            res.send("chat_with is Required");
            res.end();
            return;
        }
        let chat;
        try {
            const FindChatQuery = `
        SELECT * 
        FROM chat
        WHERE id IN('${user_id}.${Data.chat_with}', '${Data.chat_with}.${user_id}')
        `;
            chat = yield Postgres_1.default.query({
                name: "find chat",
                text: FindChatQuery
            });
        }
        catch (error) {
            res.status(420);
            res.send(error);
            res.end();
            return;
        }
        if (chat.rowCount > 0) {
            res.status(409);
            res.send("there is a chat with this user");
            res.end();
            return;
        }
        let createChat;
        try {
            const CreateChatChatQuery = `
        INSERT INTO chat (id)
        VALUES ('${user_id}.${Data.chat_with}')
        RETURNING id;
        `;
            createChat = yield Postgres_1.default.query({
                name: "create chat",
                text: CreateChatChatQuery
            });
        }
        catch (error) {
            res.status(500);
            res.send(JSON.stringify(error));
            res.end();
            return;
        }
        res.status(200);
        res.json({ chat_id: createChat.rows[0].id });
        res.end();
        return;
    });
}
exports.default = default_1;
