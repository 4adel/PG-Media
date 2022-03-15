import { Response, NextFunction } from "express";
import { PROTECT } from "./../../Users/Controllers/TokenRenew";
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

  let EditedReply;
  try {
    /**
     * content  | id | user_id | post_id | comment_id
     */
    const EditReplyQuery = `
        
            UPDATE replys
            SET
                content = $1
            WHERE
                id =  $2 AND 
                user_id = $3
            RETURNING *;

        `;

    EditedReply = await PG.db.query({
      name: "Edit Reply",
      text: EditReplyQuery,
      values: [Data.content, Data.reply_id, req.user.id],
    });

    if (EditedReply.rowCount == 0) {
      next({ msg: "This Reply Not Exist Or it's not yours" });
      return;
    }
  } catch (error) {
    next({ message: "Error Creating Replay" });
    return;
  }

  res.status(200);
  res.json({ EditedReply: EditedReply.rows[0] });
  res.end();
  return;
}

import * as yup from "yup";

let schema = yup.object().shape({
  content: yup.string().required(),
  reply_id: yup.number().required(),
});
