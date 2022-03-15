import { PROTECT } from "./../../Users/Controllers/TokenRenew";
import { Request, Response, NextFunction } from "express";
import PG from "../../../../Utils/Postgres";

export default async function (
  req: PROTECT,
  res: Response,
  next: NextFunction
) {
  let Data = req.headers;

  // Check if data valid
  try {
    schema.validate(Data, { abortEarly: false });
  } catch (error) {
    res.status(500);
    res.json(error);
    res.end();
    return;
  }

  let DeleteReply;
  try {
    //  content | id | user_id | post_id
    const DeleteReqplyQuery = `
        
        DELETE FROM replys
        WHERE
            id = $1 AND
            user_id = $2
        RETURNING *;

        `;

    DeleteReply = await PG.db.query({
      name: "Delete Reply",
      text: DeleteReqplyQuery,
      values: [Data.reply_id, req.user.id],
    });

    if (DeleteReply.rowCount === 0) {
      next({ msg: "Error Deleting Replay" });
      return;
    }
  } catch (error) {
    next({ message: "Error Creating Replay" });
    return;
  }

  res.status(200);
  res.json({ DeletedReplyId: DeleteReply.rows[0].id });
  res.end();
  return;
}

import * as yup from "yup";

let schema = yup.object().shape({
  content: yup.string().required(),
  comment_id: yup.number().required(),
  post_id: yup.number().required(),
});
