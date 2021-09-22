import { PROTECT } from './../../Users/Controllers/TokenRenew';
import PG from "../../../../Utils/Postgres";
import { NextFunction, Response } from 'express';



export default async function Delete(req: PROTECT, res: Response, next: NextFunction) {
    const user_id = req.user.id;
    const Data = req.headers;

    if (!Data.chat_id) {
        next({ message: "chat_id is Required"})
        return;
    }

    let chat;
    try {
        const DeleteChatQuery = `
        Delete FROM chat
        WHERE id LIKE '${req.user.id}.%'
        OR id LIKE '%.${req.user.id}' 
        AND id = '${Data.chat_id}'
        RETURNING id;
        `

        chat = await PG.query({
            name: "Delete chat",
            text: DeleteChatQuery
        })


    } catch (error) {
        console.log(error)
        next({ message: error , code: 409 })  ;
        return
    }
    if (chat.rowCount === 0) {
        next({ message: "Error deleting this chat" , code: 409 });
        return
    }


    
    res.status(200)
    res.json({ deleted_chat_id: chat.rows[0].id })
    res.end()
    return;
}