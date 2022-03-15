import PG from "./Postgres";
import SQL from "./SQL";
import { Request, Response, NextFunction } from "express";

const CommentExist = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const FindCommentQuery = SQL.select("comments", "id").where({
      id: req.body.comment_id,
    });
    const Comment = await PG.db.query({
      name: "FindComment",
      text: FindCommentQuery.text,
      values: FindCommentQuery.values,
    });

    if (Comment.rowCount === 0) {
      throw {
        msg: "Comment is Deleted",
        codE: 409,
      };
    } else {
      next();
      return;
    }
  } catch (error) {
    res.status(500);
    res.json({ msg: "Internal server Error" });
    res.end();
    return;
  }
};

export default { CommentExist };
