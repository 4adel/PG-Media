import { PROTECT } from "./../../Users/Controllers/TokenRenew";
import { Response, NextFunction } from "express";
import PG from "../../../../Utils/Postgres";

export default async function (
  req: PROTECT,
  res: Response,
  next: NextFunction
) {
  const user_id = req.user.id;

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

  let messege;
  try {
    const SendMessegeQuery = `
        INSERT INTO messege (sender, recever, content)
        VALUES 
        ('${user_id}','${Data.chat_with}','${Data.content}')
        RETURNING *;
        `;
    messege = await PG.db.query({
      name: "Send Message",
      text: SendMessegeQuery,
    });
  } catch (error) {
    next({ message: error });
    return;
  }
  if (messege.rowCount === 0) {
    next({ message: "Error SendingThis Messege2" });
    return;
  }

  const IO = req.app.get("io");
  IO.to(Data.chat_id).emit("newMessege", {
    Messege: messege.rows[0],
  });
  res.status(200);
  res.json({ messege: messege.rows[0] });
  res.end();
  return;
}

import * as yup from "yup";

let schema = yup.object().shape({
  chat_with: yup.string().required(),
  content: yup.string().required(),
});
