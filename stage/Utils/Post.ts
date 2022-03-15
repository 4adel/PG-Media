import { PROTECT } from "./../Apis/v1/Users/Controllers/TokenRenew";
import { NextFunction, Request, Response } from "express";
import PG from "./Postgres";
import SQL from "./SQL";

const IsPostExist = function (req: Request, res: Response, next: NextFunction) {
  const { post_id } = req.body;

  if (!post_id) {
    res.status(401);
    res.send("post_id is required");
    res.end();
    return;
  }

  const FindPostQuery = SQL.select("posts", "id").where({
    id: post_id,
  });

  PG.db
    .query({
      name: "Find Post",
      text: FindPostQuery.text,
      values: FindPostQuery.values,
    })
    .then((PGRes: any) => {
      if (PGRes.rowCount === 0) {
        res.status(409);
        res.send("This post has been deleted");
        res.end();
        return;
      } else {
        next();
        return;
      }
    })
    .catch((_err: any) => {
      res.status(500);
      res.send("It's not you fault Internal Server Error");
      res.end();
      return;
    });
};

const IsPostOwner = function (req: PROTECT, res: Response, next: NextFunction) {
  const { post_id } = req.body;
  const { id, username: _username } = req!.user;

  if (!post_id) {
    res.status(401);
    res.send("post_id is required");
    res.end();
    return;
  }

  const FindPostOwnerQuery = SQL.select("posts", "id, user_id").where({
    id: post_id,
  });

  PG.db
    .query({
      name: "Find Post Owner",
      text: FindPostOwnerQuery.text,
      values: FindPostOwnerQuery.values,
    })
    .then((PGRes: any) => {
      if (PGRes.rowCount === 0) {
        res.status(409);
        res.send("This post has been deleted");
        res.end();
        return;
      } else if (PGRes.rows[0].user_id != id) {
        res.status(409);
        res.send("This post is not Your's");
        res.end();
        return;
      } else {
        next();
        return;
      }
    })
    .catch((_err: any) => {
      res.status(500);
      res.send("It's not you fault Internal Server Error");
      res.end();
      return;
    });
};

export default { IsPostExist, IsPostOwner };
