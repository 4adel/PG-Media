import PG from "../../../../Utils/Postgres";
import { PROTECT } from "../../Users/Controllers/TokenRenew";
import { Response, NextFunction } from "express";

export default async function (
  req: PROTECT,
  res: Response,
  next: NextFunction
) {
  let Data = req.body;

  // Check if data valid
  try {
    schema.validate(Data, { abortEarly: false });
  } catch (error) {
    res.status(500);
    res.json(error);
    res.end();
    return;
  }

  let EditPost;

  try {
    const EditPostQuery = `
        
        UPDATE
            posts
        SET 
            content = $1
        WHERE
            id = $2 AND
            user_id = $3
        RETURNING
            content
            id;

        
        `;

    EditPost = await PG.db.query({
      name: "Edit Post",
      text: EditPostQuery,
      values: [Data.content, Data.post_id, req.user.id],
    });
  } catch (error) {
    console.log(error);
    next({ message: "This post is not exist or you just not the Owner1" });
    return;
  }

  if (EditPost.rowCount == 0) {
    next({ message: "This post is not exist or you just not the Owner" });
    return;
  }

  res.status(200);
  res.json({ EditedPost: EditPost.rows[0] });
  res.end();
  return;
}

import * as yup from "yup";

let schema = yup.object().shape({
  post_id: yup.number().required(),
  content: yup.string().required(),
});
