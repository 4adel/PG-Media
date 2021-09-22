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
const bcrypt_1 = __importDefault(require("bcrypt"));
const Postgres_1 = __importDefault(require("../../../../Utils/Postgres"));
;
const CreateToken_1 = __importDefault(require("../../../../Utils/CreateToken"));
const SQL_1 = __importDefault(require("../../../../Utils/SQL"));
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
        let User;
        try {
            const FindUserQuery = SQL_1.default.select("users", "username, pass, id")
                .where({
                username: Data.username
            });
            User = yield Postgres_1.default.query({
                name: "Get User",
                text: FindUserQuery.text,
                values: FindUserQuery.values
            });
        }
        catch (error) {
            res.status(500);
            res.send(error);
            res.end();
            return;
        }
        if (User.rowCount === 0) {
            next({ message: `${Data.username} don't related to Any Account`, code: 404 });
            return;
        }
        if (!bcrypt_1.default.compareSync(Data.password, User.rows[0].pass)) {
            next({ message: "Username or Password is Wrong", code: 401 });
            return;
        }
        let token = (0, CreateToken_1.default)({
            username: User.rows[0].username,
            id: User.rows[0].id
        });
        res.cookie("token", token, {
            httpOnly: process.env.NODE_ENV === "production" ? true : false,
            secure: process.env.NODE_ENV === "production" ? true : false,
            path: "/"
        });
        res.cookie("auth", true, {
            httpOnly: false,
            secure: false,
            path: "/"
        });
        res.status(200);
        res.json({ msg: "Logged In Sucessfully" });
        res.end();
        return;
    });
}
exports.default = default_1;
const yup = __importStar(require("yup"));
let schema = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required().min(8)
});
