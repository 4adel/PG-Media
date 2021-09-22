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
function Delete(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user_id = req.user.id;
        const Data = req.headers;
        if (!Data.chat_id) {
            next({ message: "chat_id is Required" });
            return;
        }
        let chat;
        try {
            const DeleteChatQuery = `
        Delete FROM chat
        WHERE id LIKE '${req.user.id}.%'
        OR id LIKE '%.${req.user.id}' 
        AND id = '${Data.chat_id}'
        RETURNING id;
        `;
            chat = yield Postgres_1.default.query({
                name: "Delete chat",
                text: DeleteChatQuery
            });
        }
        catch (error) {
            console.log(error);
            next({ message: error, code: 409 });
            return;
        }
        if (chat.rowCount === 0) {
            next({ message: "Error deleting this chat", code: 409 });
            return;
        }
        res.status(200);
        res.json({ deleted_chat_id: chat.rows[0].id });
        res.end();
        return;
    });
}
exports.default = Delete;
