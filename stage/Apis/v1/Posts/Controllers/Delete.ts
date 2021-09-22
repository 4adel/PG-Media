import PG from "../../../../Utils/Postgres";
import { PROTECT } from "../../Users/Controllers/TokenRenew";
import { Response, NextFunction } from "express";



export default async function (req: PROTECT, res: Response, next: NextFunction) {
    let Data = req.headers;

    // Check if data valid
    try {
        schema.validate(Data, { abortEarly: false })
    } catch (error) {
        res.status(500)
        res.json(error)
        res.end()
        return;
    }

    let DeletePost;
    try {
        const DeletePostQuery = `
        DELETE FROM posts
        WHERE
            id = $1 AND user_id = $2
        RETUTNING 
            id;
        `;


        DeletePost = await PG.query({
            name: "Delete Post",
            text: DeletePostQuery,
            values: [Data.post_id, req.user.id]
        })


        const DeleteCommentRelatedToPost = `
        
        DELETE FROM
            comments
        WHERE
            post_id = $1

        `
    

        await PG.query({
            name: "Delete Comments",
            text: DeleteCommentRelatedToPost,
            values: [Data.post_id]
        })

        const DeleteRepliesRelatedToPost = `
            DELETE FROM
                replys
            WHERE
                post_id = $1

        `;
        


        await PG.query({
            name: "Delete Replys",
            text: DeleteRepliesRelatedToPost,
            values: [Data.post_id]
        })
    } catch (error) {
        next({ message: "This post is not exist or you just not the Owner"})
        return;
    }

    if (DeletePost.rowCount == 0) {
        next({ message: "This post is not exist or you just not the Owner"})
        return;
    }


    res.status(200);
    res.json({ DeletedPostId: DeletePost.rows[0].id })
    res.end()
    return;
}



import * as yup from "yup";

let schema = yup.object().shape({
    post_id: yup.number().required(),
});
