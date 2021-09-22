"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
function default_1(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let Data = req.body;
        // Check if data valid
        try {
            schema.validate(Data, { abortEarly: false });
        }
        catch (error) {
            res.status(500);
            res.json(error);
            res.end();
            return;
        }
        let NewReply;
        try { //  content | id | user_id | post_id
            const CreateReplyQuery = `
        INSERT INTO replys
        (content, post_id, comment_id, user_id)
        VALUES
        ($1, $2, $3, $4)
        RETURNING *;
        `;
            NewReply = yield Postgres_1.default.query({
                name: "Create Reply",
                text: CreateReplyQuery,
                values: [Data.content, Data.post_id, Data.comment_id, req.user.id]
            });
            if (NewReply.rowCount === 0) {
                next({ msg: "Error Creating Replay" });
                return;
            }
        }
        catch (error) {
            console.log(error);
            next({ message: "Error Creating Replay" });
            return;
        }
        res.status(200);
        res.json({ NewReply: NewReply.rows[0] });
        res.end();
        return;
    });
}
exports.default = default_1;
const yup = __importStar(require("yup"));
let schema = yup.object().shape({
    content: yup.string().required(),
    comment_id: yup.number().required(),
    post_id: yup.number().required(),
});
