import Bcrypt from "bcrypt";
import PG from "../../../../Utils/Postgres";
import CreateToken from "../../../../Utils/CreateToken";
import unique_username from "../../../../Utils/UniqueUsername";
import ValiateEmail from "email-validator";
import TrustedDate from "../../../../Utils/TrustedDate";


import Login from "./Login";
/**
 * 00. Make sure that all required information are provided
 * 01. Check if this information provided are valid
 * 02. Check if username is not used before
 * 03. Generate Hash
 * 04. Insert the new user to users table
 * 05. insert username to used_usernames table
 * 06. Check if date if Valid
 * 07. Convert date to ISO format
 * 08. Generate Token
 * 09. send token back to user
 * 10. end Requiest
 */

import { Request, Response, NextFunction } from 'express';

// POST
export default async function (req: Request, res: Response, next: NextFunction) {
  // Desturcture data from requiest
  let Data = req.body;

  // Check if data valid
  try {
    schema.validate(Data, { abortEarly: false })
  } catch (error) {
    res.status(500)
    res.json(error)
    res.end()
    return;
  }

  // Check if Email Valid
  if (!ValiateEmail.validate(Data.email)) {
    res.status(405);
    res.send(`${Data.email} is not a valid Email`);
    res.end();
    return;
  }

  // Year-Month-Day
  let date_of_birth;
  try {
    date_of_birth =  TrustedDate({ day : Data.day, month: Data.month, year: Data.year })    
  } catch (error) {
    res.status(500);
    res.send(error);
    res.end();
    return;
  }



  let is_username_unique = await unique_username(Data.username);
  if (!is_username_unique) {
    res.status(500)
    res.send(`${Data.username} is Already Registered`);
    res.end()
    return;
  }

  let hash = Bcrypt.hashSync(Data.password, 10);
  let NewUser;
  try {
    let register_new_user_query = `
    INSERT INTO users
    (username, pass, first_name, last_name, email, date_of_birth)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, username;
    `;

    NewUser = await PG.query({
      name: "Insert New User",
      text: register_new_user_query,
      values: [ Data.username, hash, Data.first_name, Data.last_name, Data.email, date_of_birth],
    });
    await PG.query({
      name: "Insert New used username",
      text: `
        INSERT INTO used_usernames
        (username)
        VALUES ($1);
      `,
      values: [Data.username],
    });
  } catch (error) {
    res.status(409);
    res.send(error);
    res.end();
    return;
  }

  if (NewUser.rowCount === 0) {
    res.status(409);
    res.send("Faild to Inset New User to Database");
    res.end();
    return;
  }

  let token = CreateToken({
    username: NewUser.rows[0].username,
    id: NewUser.rows[0].id,
  });

  if (!token) {
    res.status(500);
    res.send("Failed to Create Token maybe you some data are missed");
    res.end();
    return;
  }

  res.cookie("token", token, {
    httpOnly: process.env.NODE_ENV === "production"? true: false,
    secure: process.env.NODE_ENV === "production"? true: false ,
    path: "/"
  })
  res.cookie("auth", true, {
    httpOnly: false,
    secure: false,
    path: "/"
  })

  res.status(200)
  res.json({ msg: "Account created successfully" });
  res.end();
  return;
};


const year = new Date;

import * as yup from 'yup';

let schema = yup.object().shape({
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  day: yup.number().min(1).max(31).required(),
  month: yup.number().min(1).max(12).required(),
  year: yup.number().min(1900).max(year.getFullYear() - 13).required(),
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required().min(8)
});