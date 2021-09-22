import { PROTECT } from './../../Users/Controllers/TokenRenew';
import { Request, Response, NextFunction } from 'express';
import PG from "../../../../Utils/Postgres";

export default async function(req: PROTECT, res: Response, next: NextFunction) { 

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


    let NewReply;
    try { //  content | id | user_id | post_id
        const CreateReplyQuery = `
        INSERT INTO replys
        (content, post_id, comment_id, user_id)
        VALUES
        ($1, $2, $3, $4)
        RETURNING *;
        `

        NewReply = await PG.query({
            name: "Create Reply",
            text: CreateReplyQuery,
            values: [Data.content, Data.post_id, Data.comment_id, req.user.id]
        })

        if (NewReply.rowCount === 0) {
            next({msg: "Error Creating Replay"})
            return;
        }
    } catch (error) {
        console.log(error)
        next({message: "Error Creating Replay"})
        return;
    }

    res.status(200);
    res.json({ NewReply: NewReply.rows[0]})
    res.end()
    return;
}







  
import * as yup from "yup";

let schema = yup.object().shape({
    content: yup.string().required(),
    comment_id: yup.number().required(),
    post_id: yup.number().required(),
});
