import db from "../database/database.connection.js";

export function urlsByUserId({id}){
    return db.query(`SELECT * FROM links WHERE "userId"=$1`, [id]);
}

export function urlById({id}){
    return db.query("SELECT * FROM links WHERE id=$1", [id]);
}

export function createLink({userId, url, urlShorted}){
    return db.query(`
    INSERT INTO links ("userId", "urlOriginal", "urlShorted")
    VALUES ($1, $2, $3)
    RETURNING id
    `, [userId, url, urlShorted]);
}

export function urlOpen({shortUrl}){
    return db.query(`
    UPDATE links 
    SET "timesUsed"="timesUsed"+1 
    WHERE "urlShorted"=$1 
    RETURNING "urlOriginal"`, [shortUrl]);
}

export function urlDelete({id}){
    return db.query("DELETE FROM links WHERE id=$1", [id]);
}