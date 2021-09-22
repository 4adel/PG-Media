"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Postgres_1 = __importDefault(require("./Postgres"));
;
const SQL_1 = __importDefault(require("./SQL"));
const IsPostExist = function (req, res, next) {
    const { post_id } = req.body;
    if (!post_id) {
        res.status(401);
        res.send("post_id is required");
        res.end();
        return;
    }
    const FindPostQuery = SQL_1.default.select("posts", "id").where({
        id: post_id
    });
    Postgres_1.default.query({
        name: "Find Post",
        text: FindPostQuery.text,
        values: FindPostQuery.values
    })
        .then((PGRes) => {
        if (PGRes.rowCount === 0) {
            res.status(409);
            res.send("This post has been deleted");
            res.end();
            return;
        }
        else {
            next();
            return;
        }
    })
        .catch((_err) => {
        res.status(500);
        res.send("It's not you fault Internal Server Error");
        res.end();
        return;
    });
};
const IsPostOwner = function (req, res, next) {
    const { post_id } = req.body;
    const { id, username: _username } = req.user;
    if (!post_id) {
        res.status(401);
        res.send("post_id is required");
        res.end();
        return;
    }
    const FindPostOwnerQuery = SQL_1.default.select("posts", "id, user_id").where({
        id: post_id
    });
    Postgres_1.default.query({
        name: "Find Post Owner",
        text: FindPostOwnerQuery.text,
        values: FindPostOwnerQuery.values
    })
        .then((PGRes) => {
        if (PGRes.rowCount === 0) {
            res.status(409);
            res.send("This post has been deleted");
            res.end();
            return;
        }
        else if (PGRes.rows[0].user_id != id) {
            res.status(409);
            res.send("This post is not Your's");
            res.end();
            return;
        }
        else {
            next();
            return;
        }
    })
        .catch((_err) => {
        res.status(500);
        res.send("It's not you fault Internal Server Error");
        res.end();
        return;
    });
};
exports.default = { IsPostExist, IsPostOwner };
