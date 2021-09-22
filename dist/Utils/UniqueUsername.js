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
const Postgres_1 = __importDefault(require("./Postgres"));
;
function default_1(username) {
    return __awaiter(this, void 0, void 0, function* () {
        let FindUsername;
        try {
            FindUsername = yield Postgres_1.default.query({
                name: "Check Username Avilibility",
                text: `
                SELECT FROM used_usernames
                WHERE username = $1;
            `,
                values: [username]
            });
        }
        catch (error) {
            return false;
        }
        if (FindUsername.rowCount === 0) {
            return true;
        }
        else {
            return false;
        }
    });
}
exports.default = default_1;
