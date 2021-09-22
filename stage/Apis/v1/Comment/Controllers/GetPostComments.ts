import { PROTECT } from './../../Users/Controllers/TokenRenew';
import { QueryResult } from 'pg';
import PG from "../../../../Utils/Postgres";
import { Response, NextFunction } from 'express';
import * as yup from 'yup';


export default async function (req: PROTECT, res: Response, next: NextFunction) {
	const Data = req.params;

	try {
		Schema.validate(Data, { abortEarly: false })	
	} catch (error) {
		res.status(500)
		res.json(error)
		res.end()
		return;
	}


	let comments : QueryResult<any>
	try {
		const GetCommentQuery = `
            SELECT * FROM comments
            WHERE post_id = $1
            LIMIT $2
            OFFSET $3;
        `;

		const CommentsNumberToSkip = Number(Data.round) * 5;
		comments = await PG.query({
			name: "get Post Comment",
			text: GetCommentQuery,
			values: [Data.post_id, 5, CommentsNumberToSkip],
		});
	} catch (error) {
		next({ message: error, code: 500 });
		return;
	}

	res.status(200);
	res.json({ comments: comments.rows });
	res.end();
	return;
};



const Schema = yup.object().shape({
	post_id: yup.string().required(),
	round: yup.number().required(),
})