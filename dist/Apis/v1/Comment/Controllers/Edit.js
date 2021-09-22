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
;
const SQL_1 = __importDefault(require("../../../../Utils/SQL"));
const yup = __importStar(require("yup"));
function default_1(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const Data = req.body;
        try {
            Schema.validate(Data, { abortEarly: false });
        }
        catch (error) {
            res.status(500);
            res.json(error);
            res.end();
            return;
        }
        let EditedComment;
        try {
            const UpdateCommentQuery = SQL_1.default.update("comments", { content: Data.content })
                .where({
                user_id: req.user.id,
                id: Data.comment_id,
            })
                .returning("content, id");
            EditedComment = yield Postgres_1.default.query({
                name: "Edit Commmet",
                text: UpdateCommentQuery.text,
                values: UpdateCommentQuery.values
            });
            if (EditedComment.rowCount == 0) {
                next({
                    message: "This comment is Deleted or It's not Yours"
                });
                return;
            }
        }
        catch (error) {
            next({
                message: "Error Editing this comment"
            });
            return;
        }
        res.status(200);
        res.json({ EditedComment: EditedComment.rows[0] });
        res.end();
        return;
    });
}
exports.default = default_1;
const Schema = yup.object().shape({
    content: yup.string().required(),
    comment_id: yup.string().required()
});
