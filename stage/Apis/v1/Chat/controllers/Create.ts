import { PROTECT } from './../../Users/Controllers/TokenRenew';
import PG from "../../../../Utils/Postgres";
import { NextFunction, Response } from 'express';
;


export default async function(req: PROTECT, res: Response, next: NextFunction) {
    const user_id = req.user.id;
    const Data = req.body;

    if (!Data.chat_with) {
        res.status(420);
        res.send("chat_with is Required")
        res.end()
        return;
    }

    let chat;
    try {
        const FindChatQuery = `
        SELECT * 
        FROM chat
        WHERE id IN('${user_id}.${Data.chat_with}', '${Data.chat_with}.${user_id}')
        `

        chat = await PG.query({
            name: "find chat",
            text: FindChatQuery
        })


    } catch (error) {
        res.status(420);
        res.send(error)
        res.end()
        return
    }

    if (chat.rowCount > 0) {
        res.status(409);
        res.send("there is a chat with this user")
        res.end()
        return
    }


    let createChat;
    try {
        const CreateChatChatQuery = `
        INSERT INTO chat (id)
        VALUES ('${user_id}.${Data.chat_with}')
        RETURNING id;
        `

        createChat = await PG.query({
            name: "create chat",
            text: CreateChatChatQuery
        })
    } catch (error) {
        res.status(500);
        res.send(JSON.stringify(error))
        res.end()
        return
    }

    res.status(200)
    res.json({ chat_id: createChat.rows[0].id })
    res.end()
    return;
}