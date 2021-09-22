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
const CreateToken_1 = __importDefault(require("../../../../Utils/CreateToken"));
function Create(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let TOKEN = (0, CreateToken_1.default)({ id: req.user.id, username: req.user.username });
        res.cookie("token", TOKEN, {
            httpOnly: process.env.NODE_ENV === "production" ? true : false,
            secure: process.env.NODE_ENV === "production" ? true : false,
            path: "/"
        });
        res.cookie("auth", true, {
            httpOnly: false,
            secure: false,
            path: "/",
        });
        res.status(200);
        res.json({ msg: "Token Renewal is done" });
        res.end();
        return;
    });
}
exports.default = Create;
