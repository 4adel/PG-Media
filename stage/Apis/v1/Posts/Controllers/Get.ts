import PG from "../../../../Utils/Postgres";
import { PROTECT } from "../../Users/Controllers/TokenRenew";
import { Response, NextFunction } from "express";

export default async function (
  req: PROTECT,
  res: Response,
  next: NextFunction
) {
  let Data = req.params;

  // Check if data valid
  try {
    schema.validate(Data, { abortEarly: false });
  } catch (error) {
    res.status(500);
    res.json(error);
    res.end();
    return;
  }

  let GetPost;
  try {
    const GetPostQuery = `
        SELECT
        FROM
            posts
        WHERE
            id = $1;
        `;

    GetPost = await PG.db.query({
      name: "Get Post",
      text: GetPostQuery,
      values: [Data.post_id],
    });
  } catch (error) {
    next({ message: "Error Creating this Post" });
    return;
  }

  if (GetPost.rowCount == 0) {
    next({ message: "This post not Exist", code: 404 });
    return;
  }

  res.status(200);
  res.json(GetPost.rows[0]);
  res.end();
  return;
}

import * as yup from "yup";

let schema = yup.object().shape({
  post_id: yup.number().required(),
});
