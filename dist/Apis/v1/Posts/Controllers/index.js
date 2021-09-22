"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProgilePictures = exports.Get = exports.Edit = exports.Delete = exports.Create = void 0;
const Create_1 = __importDefault(require("./Create"));
exports.Create = Create_1.default;
const Delete_1 = __importDefault(require("./Delete"));
exports.Delete = Delete_1.default;
const Edit_1 = __importDefault(require("./Edit"));
exports.Edit = Edit_1.default;
const Get_1 = __importDefault(require("./Get"));
exports.Get = Get_1.default;
const ProfilePosts_1 = __importDefault(require("./ProfilePosts"));
exports.GetProgilePictures = ProfilePosts_1.default;
