import { PROTECT } from "./../../Users/Controllers/TokenRenew";
import PG from "../../../../Utils/Postgres";
import SQL from "../../../../Utils/SQL";
import { Response, NextFunction } from "express";
import * as yup from "yup";
import { QueryResult } from "pg";

export default async function (
  req: PROTECT,
  res: Response,
  next: NextFunction
) {
  const Data = req.body;

  try {
    Schema.validate(Data, { abortEarly: false });
  } catch (error) {
    res.status(500);
    res.json(error);
    res.end();
    return;
  }

  let EditedComment: QueryResult<any>;
  try {
    const UpdateCommentQuery = SQL.update("comments", { content: Data.content })
      .where({
        user_id: req.user.id,
        id: Data.comment_id,
      })
      .returning("content, id");

    EditedComment = await PG.db.query({
      name: "Edit Commmet",
      text: UpdateCommentQuery.text,
      values: UpdateCommentQuery.values,
    });

    if (EditedComment.rowCount == 0) {
      next({
        message: "This comment is Deleted or It's not Yours",
      });
      return;
    }
  } catch (error) {
    next({
      message: "Error Editing this comment",
    });
    return;
  }

  res.status(200);
  res.json({ EditedComment: EditedComment.rows[0] });
  res.end();
  return;
}

const Schema = yup.object().shape({
  content: yup.string().required(),
  comment_id: yup.string().required(),
});
