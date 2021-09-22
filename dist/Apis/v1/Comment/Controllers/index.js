"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPostComments = exports.Delete = exports.Edit = exports.Create = void 0;
const Create_1 = __importDefault(require("./Create"));
exports.Create = Create_1.default;
const Edit_1 = __importDefault(require("./Edit"));
exports.Edit = Edit_1.default;
const Deleted_1 = __importDefault(require("./Deleted"));
exports.Delete = Deleted_1.default;
const GetPostComments_1 = __importDefault(require("./GetPostComments"));
exports.GetPostComments = GetPostComments_1.default;
