import { PROTECT } from "../../Users/Controllers/TokenRenew";
import PG from "../../../../Utils/Postgres";
import { Response, NextFunction } from "express";

export default async function (
  req: PROTECT,
  res: Response,
  next: NextFunction
) {
  const user_id = req.user.id;

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

  let messege;
  try {
    const EditMessegeQuery = `
        UPDATE messege
        SET
            content = '${Data.content}'
        WHERE sender = '${user_id}' AND id = '${Data.messege_id}'
        RETURNING * ;
        `;
    messege = await PG.db.query({
      name: "Edit Message",
      text: EditMessegeQuery,
    });
  } catch (error) {
    next({ message: error });
    return;
  }

  if (messege.rowCount === 0) {
    next({ message: "This Messege is Deleted ot it's not Yours" });
    return;
  }

  const IO = req.app.get("io");
  IO.to(Data.chat_id).emit("editMessege", {
    Messege_id: messege.rows[0],
  });
  res.status(200);
  res.json({ Messege: messege.rows[0] });
  res.end();
  return;
}

import * as yup from "yup";

let schema = yup.object().shape({
  messege_id: yup.number().required(),
  chat_id: yup.string().required(),
  content: yup.string().required(),
});
