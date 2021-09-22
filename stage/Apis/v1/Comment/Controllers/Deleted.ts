import { PROTECT } from './../../Users/Controllers/TokenRenew';
import PG from "../../../../Utils/Postgres";;
import SQL from "../../../../Utils/SQL";
import { Response, NextFunction } from 'express';
import { QueryResult } from 'pg';



export default async function (req: PROTECT, res: Response, next: NextFunction) {
    const Data = req.headers;
    

    try {
        Schema.validate(Data, { abortEarly: false })
    } catch (error) {
        res.status(500)
        res.json(error)
        res.end()
        return;
    }

    
    let DeletedComment: QueryResult<any>;
    try {
        const DeleteCommentQuery = SQL.deletes("comments")
                            .where({
                                user_id: req.user.id,
                                id: Data!.comment_id,
                            })
                            .returning("content, id")

        DeletedComment = await PG.query({
            name: "Delete Commmet",
            text: DeleteCommentQuery.text,
            values: DeleteCommentQuery.values
        })
        const DeleteRepliesRelatedToPost = SQL.deletes("replys")
                                                .where({
                                                    post_id: Data.post_id
                                                })
        await PG.query({
            name: "Delete Replysx",
            text: DeleteRepliesRelatedToPost.text,
            values: DeleteRepliesRelatedToPost.values
        })
        if (DeletedComment.rowCount == 0) {
            next({message: "This Comment Not Exist Or it's not yours"})
            return;
        }

    
    } catch (error) {
        next({message: "PG- Error Deletring this comment"})
    }
    

    
    
    res.status(200);
    res.json({ DeletedCommentId: DeletedComment!.rows[0].id })
    res.end()
    return;
}


import * as yup from 'yup'


const Schema = yup.object().shape({
    comment_id: yup.string().required(),
    post_id: yup.string().required(),
})