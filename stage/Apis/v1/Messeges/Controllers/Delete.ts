import { PROTECT } from './../../Users/Controllers/TokenRenew';
import PG from "../../../../Utils/Postgres";;
import { Response, NextFunction } from 'express';

export default async function (req: PROTECT, res: Response , next: NextFunction) {
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

    let messege;
    try {
        const DeleteMessegeQuery = `
        DELETE FROM messege
        WHERE sender = '${Data.user_id}' AND id = '${Data.messege_id}'
        RETURNING * ;
        `
        messege = await PG.query({
            name: "Deletes Message",
            text: DeleteMessegeQuery
        })
    } catch (error) {
        next({ message: error })
        return;
    }


    if (messege.rowCount === 0) {
        next({ message: "Error Deleting This Messege1" })
        return;
    }


    const IO = req.app.get("io");
    IO.to(Data.chat_id).emit("deleteMessege", {
        Messege_id: messege.rows[0].id
    })
    res.status(200)
    res.json({ Messege_id: messege.rows[0].id })
    res.end();
    return;
}





import * as yup from "yup";

let schema = yup.object().shape({
    messege_id: yup.number().required(),
    chat_id: yup.string().required()

});


