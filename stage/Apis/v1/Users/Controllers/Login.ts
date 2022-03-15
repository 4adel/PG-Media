import Bcrypt from "bcrypt";
import PG from "../../../../Utils/Postgres";
import CreateToken from "../../../../Utils/CreateToken";
import SQL from "../../../../Utils/SQL";

/**
 * 0. Make sure that all required information are provided
 * 1. Check if this information provided are valid
 * 2. Check if username is not used before
 * 3. Generate Hash
 * 4. Insert the new user to users table
 * 5. insert username to used_usernames table
 * 6. Check if date if Valid
 * 7. Convert date to ISO format
 * 8. Generate Token
 * 9. send token bach to user
 * 10. end Requiest
 */

import { Request, Response, NextFunction } from "express";

export default async function (
  req: Request,
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

  let User;
  try {
    const FindUserQuery = SQL.select("users", "username, pass, id").where({
      username: Data.username,
    });

    User = await PG.db.query({
      name: "Get User",
      text: FindUserQuery.text,
      values: FindUserQuery.values,
    });
  } catch (error) {
    res.status(500);
    res.send(error);
    res.end();
    return;
  }

  if (User.rowCount === 0) {
    next({
      message: `${Data.username} don't related to Any Account`,
      code: 404,
    });
    return;
  }

  if (!Bcrypt.compareSync(Data.password, User.rows[0].pass)) {
    next({ message: "Username or Password is Wrong", code: 401 });
    return;
  }

  let token = CreateToken({
    username: User.rows[0].username,
    id: User.rows[0].id,
  });

  res.cookie("token", token, {
    httpOnly: process.env.NODE_ENV === "production" ? true : false,
    secure: process.env.NODE_ENV === "production" ? true : false,
    path: "/",
  });
  res.cookie("auth", true, {
    httpOnly: false,
    secure: false,
    path: "/",
  });

  res.status(200);
  res.json({ msg: "Logged In Sucessfully" });
  res.end();
  return;
}

import * as yup from "yup";

let schema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required().min(8),
});
