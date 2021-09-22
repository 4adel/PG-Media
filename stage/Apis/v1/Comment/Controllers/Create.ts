import { PROTECT } from './../../Users/Controllers/TokenRenew';
import PG from "../../../../Utils/Postgres";;
import SQL from "../../../../Utils/SQL";
import { Response, NextFunction } from 'express';



export default async function (req: PROTECT, res: Response, next: NextFunction) {
    const  Data = req.body;
            
    try {
        Schema.validate(Data, { abortEarly: false })
    } catch (error) {
        res.status(500)
        res.json(error)
        res.end()
        return;
    }

    const NewCommentQuery = SQL.insert("comments", {
        conent: Data.content,
        user_id: req.user.id,
        post_id: Data.post_id,
    })
    .returning("content, user_id, id")

    let NewComment: QueryResult<any>;

    try {
        NewComment = await PG.query({
            name: "New Post",
            text: NewCommentQuery.text,
            values: NewCommentQuery.values
        })
    } catch (error) {
        
    }

    if (NewComment!.rowCount == 0) {
        throw {
            message: "Error Creating this Post"
        }
    }

    res.status(200);
    res.json({ NewComment: NewComment!.rows[0] })
    res.end()
    return;
}






import * as  yup from "yup"
import { QueryResult } from 'pg';

const Schema = yup.object().shape({
    content: yup.string().required(),
    post_id: yup.string().required()
})