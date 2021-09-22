import CreateToken from '../../../../Utils/CreateToken';

import { Request, Response, NextFunction } from 'express';

export interface PROTECT extends Request {
	user: {
		id: string, 
		username: string
	}
}

export default async function Create(req:  PROTECT , res: Response, next: NextFunction) {

	let TOKEN = CreateToken({ id: req.user.id, username: req.user.username });

	res.cookie("token", TOKEN, {
		httpOnly: process.env.NODE_ENV === "production"? true: false,
		secure: process.env.NODE_ENV === "production"? true: false ,
		path: "/"
	  })
	  res.cookie("auth", true, {
		httpOnly: false,
		secure: false,
		path: "/",
	  })
	res.status(200);
	res.json({ msg: "Token Renewal is done" });
	res.end();
	return;
}