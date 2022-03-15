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

  let NewPost;

  try {
    const NewPostQuery = `
        
        INSERT INTO posts
            (content, user_id, published)
        VALUES
            ($1, $2, $3)
        RETURNING content, user_id, id;

        `;
    NewPost = await PG.db.query({
      name: "New Post",
      text: NewPostQuery,
      values: [
        Data.content,
        req.user.id,
        Data.published.toString() == true.toString() ? true : false,
      ],
    });
  } catch (error) {
    next({ message: "Error Creating this Post" });
    return;
  }

  if (NewPost.rowCount == 0) {
    next({ message: "Error Creating this Post" });
    return;
  }

  res.status(200);
  res.json({ NewPost: NewPost.rows[0] });
  res.end();
  return;
}

import { object, string } from "yup";

let schema = object().shape({
  content: string().required(),
});
