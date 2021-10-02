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
const CreateToken_1 = __importDefault(require("../../../../Utils/CreateToken"));
const UniqueUsername_1 = __importDefault(require("../../../../Utils/UniqueUsername"));
const email_validator_1 = __importDefault(require("email-validator"));
const TrustedDate_1 = __importDefault(require("../../../../Utils/TrustedDate"));
// POST
function default_1(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Desturcture data from requiest
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
        // Check if Email Valid
        if (!email_validator_1.default.validate(Data.email)) {
            res.status(405);
            res.send(`${Data.email} is not a valid Email`);
            res.end();
            return;
        }
        // Year-Month-Day
        let date_of_birth;
        try {
            date_of_birth = (0, TrustedDate_1.default)({ day: Data.day, month: Data.month, year: Data.year });
        }
        catch (error) {
            res.status(500);
            res.send(error);
            res.end();
            return;
        }
        let is_username_unique = yield (0, UniqueUsername_1.default)(Data.username);
        if (!is_username_unique) {
            res.status(500);
            res.send(`${Data.username} is Already Registered`);
            res.end();
            return;
        }
        let hash = bcrypt_1.default.hashSync(Data.password, 10);
        let NewUser;
        try {
            let register_new_user_query = `
    INSERT INTO users
    (username, pass, first_name, last_name, email, date_of_birth)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, username;
    `;
            NewUser = yield Postgres_1.default.query({
                name: "Insert New User",
                text: register_new_user_query,
                values: [Data.username, hash, Data.first_name, Data.last_name, Data.email, date_of_birth],
            });
            yield Postgres_1.default.query({
                name: "Insert New used username",
                text: `
        INSERT INTO used_usernames
        (username)
        VALUES ($1);
      `,
                values: [Data.username],
            });
        }
        catch (error) {
            res.status(409);
            res.send(error);
            res.end();
            return;
        }
        if (NewUser.rowCount === 0) {
            res.status(409);
            res.send("Faild to Inset New User to Database");
            res.end();
            return;
        }
        let token = (0, CreateToken_1.default)({
            username: NewUser.rows[0].username,
            id: NewUser.rows[0].id,
        });
        if (!token) {
            res.status(500);
            res.send("Failed to Create Token maybe you some data are missed");
            res.end();
            return;
        }
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
        res.json({ msg: "Account created successfully" });
        res.end();
        return;
    });
}
exports.default = default_1;
;
const year = new Date;
const yup = __importStar(require("yup"));
let schema = yup.object().shape({
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    day: yup.number().min(1).max(31).required(),
    month: yup.number().min(1).max(12).required(),
    year: yup.number().min(1900).max(year.getFullYear() - 13).required(),
    username: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required().min(8)
});
