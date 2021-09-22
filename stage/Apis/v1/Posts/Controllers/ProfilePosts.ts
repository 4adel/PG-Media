import PG from "../../../../Utils/Postgres";;


import { PROTECT } from "../../Users/Controllers/TokenRenew";
import { Response, NextFunction } from "express";



export default async function (req: PROTECT, res: Response, next: NextFunction) {

    let Data = req.params;

    // Check if data valid
    try {
        schema.validate(Data, { abortEarly: false })
    } catch (error) {
        res.status(500)
        res.json(error)
        res.end()
        return;
    }



    let GetPost;
    try {
        const GetPostsQuery = `
        SELECT
        FROM
            posts
        WHERE
            user_id = $1
        LIMIT 5
        ;

        `
        
        
    
        GetPost = await PG.query({
            name: "Get Posts",
            text: GetPostsQuery,
            values: [Data.post_id]
        })

    } catch (error) {
        next({ message: "Error Creating this Post"})
        return;
    }

    if (GetPost.rowCount == 0) {
        next({ message: "No thing to show", code: 404 })
        return;
    }



    res.status(200);
    res.json(GetPost.rows)
    res.end()
    return;
}



import * as yup from "yup";

let schema = yup.object().shape({
    round: yup.number().min(1).required(),
    user_id: yup.number().required(),
})