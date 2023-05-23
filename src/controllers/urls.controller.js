import { nanoid } from "nanoid";
import { createLink, urlById, urlDelete, urlOpen } from "../repositories/links.repository.js";
import { userByEmail } from "../repositories/users.repository.js";

export async function postUrl(req, res){
    const {email}=res.locals.tokenData;
    const {url}=req.body;

    try {
        const emailSearch=await userByEmail({email});
        if(!emailSearch.rowCount) return res.sendStatus(404);
        const urlShorted=nanoid(8);
        const createLog=await createLink({userId: emailSearch.rows[0].id, url, urlShorted});
        return res.status(201).send({id: createLog.rows[0].id, shortUrl: urlShorted});
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

export async function getUrlById(req, res){
    const {id}=req.params;

    try {
        const idSearch=await urlById({id});
        if(!idSearch.rowCount) return res.sendStatus(404);
        return res.send({
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
        const searchUpdate=await urlOpen({shortUrl});
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
        const emailSearch=await userByEmail({email});
        if(!emailSearch.rowCount) return res.sendStatus(401);
        const urlSearch=await urlById({id});
        if(!urlSearch.rowCount) return res.sendStatus(404);
        if(urlSearch.rows[0].userId !== emailSearch.rows[0].id) return res.sendStatus(404);
        await urlDelete({id});
        return res.sendStatus(204);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}