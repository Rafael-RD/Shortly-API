import { nanoid } from "nanoid";
import db from "../database/database.connection.js";

export async function postUrl(req, res){
    const {email}=res.locals.tokenData;
    const {url}=req.body;

    try {
        const emailSearch=await db.query("SELECT * FROM users WHERE email=$1",[email]);
        if(!emailSearch.rowCount) return res.sendStatus(404);
        const urlShorted=nanoid(8);
        const createLog=await db.query(`
        INSERT INTO links ("userId", "urlOriginal", "urlShorted")
        VALUES ($1, $2, $3)
        RETURNING id
        `, [emailSearch.rows[0].id, url, urlShorted]);
        return res.status(201).send({id: createLog.rows[0].id, shortUrl: urlShorted});
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}