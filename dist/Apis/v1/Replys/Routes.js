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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Router = express_1.default.Router();
const Controller = __importStar(require("./Controllers"));
const Comments_1 = __importDefault(require("../../../Utils/Comments"));
const CatchError_1 = __importDefault(require("../../../Utils/CatchError"));
const ProtectedRoute_1 = __importDefault(require("../../../Utils/ProtectedRoute"));
Router.post("/create", ProtectedRoute_1.default, Comments_1.default.CommentExist, (0, CatchError_1.default)(Controller.Create));
Router.post("/edit", ProtectedRoute_1.default, (0, CatchError_1.default)(Controller.Edit));
Router.delete("/delete", ProtectedRoute_1.default, (0, CatchError_1.default)(Controller.Delete));
exports.default = Router;
