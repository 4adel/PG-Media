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
        let NewPost;
        try {
            const NewPostQuery = `
        
        INSERT INTO posts
            (content, user_id, published)
        VALUES
            ($1, $2, $3)
        RETURNING content, user_id, id;

        `;
            NewPost = yield Postgres_1.default.query({
                name: "New Post",
                text: NewPostQuery,
                values: [Data.content, req.user.id, (Data.published.toString() == true.toString() ? true : false)]
            });
        }
        catch (error) {
            next({ message: "Error Creating this Post" });
            return;
        }
        if (NewPost.rowCount == 0) {
            next({ message: "Error Creating this Post" });
            return;
        }
        res.status(200);
        res.json({ NewPost: NewPost.rows[0] });
        res.end();
        return;
    });
}
exports.default = default_1;
const yup_1 = require("yup");
let schema = (0, yup_1.object)().shape({
    content: (0, yup_1.string)().required(),
});
