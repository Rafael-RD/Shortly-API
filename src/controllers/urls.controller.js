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

export async function getUrlById(req, res){
    const {id}=req.params;

    try {
        const idSearch=await db.query("SELECT * FROM links WHERE id=$1", [id]);
        if(!idSearch.rowCount) return res.sendStatus(404);
        res.send({
            id: idSearch.rows[0].id,
            shortUrl: idSearch.rows[0].urlShorted,
            url: idSearch.rows[0].urlOriginal
        });
        
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

export async function getOpenUrl(req, res){
    const {shortUrl}=req.params;

    try {
        const searchUpdate=await db.query(`
        UPDATE links 
        SET "timesUsed"="timesUsed"+1 
        WHERE "urlShorted"=$1 
        RETURNING "urlOriginal"`, [shortUrl]);

        return res.redirect(searchUpdate.rows[0].urlOriginal);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

export async function deleteById(req, res){
    const {id}=req.params;
    const {email}=res.locals.tokenData;

    try {
        const emailSearch=await db.query("SELECT * FROM users WHERE email=$1",[email]);
        if(!emailSearch.rowCount) return res.sendStatus(401);
        const urlSearch=await db.query("SELECT * FROM links WHERE id=$1", [id]);
        if(!urlSearch.rowCount) return res.sendStatus(404);
        if(urlSearch.rows[0].userId !== emailSearch.rows[0].id) return res.sendStatus(404);
        const deleteLog=await db.query("DELETE FROM links WHERE id=$1", [id]);
        return res.sendStatus(204);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}