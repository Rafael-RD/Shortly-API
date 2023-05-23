import db from "../database/database.connection.js";

export function userByEmail({email}){
    return db.query(`SELECT * FROM users WHERE email=$1`, [email]);
}

export function createUser({name, email, password}){
    return db.query(`
    INSERT INTO users (name, email, password) 
    VALUES ($1, $2, $3)
    `, [name, email, password]);
}

export function urlsByUserId({id}){
    return db.query(`SELECT * FROM links WHERE "userId"=$1`, [id]);
}

export function usersRanking(){
    return db.query(`
    SELECT users.id, users.name, COUNT(links) AS "linksCount", SUM(links."timesUsed") AS "visitCount"
    FROM users
    LEFT JOIN links ON links."userId"=users.id
    GROUP BY users.id
    ORDER BY "visitCount" DESC
    LIMIT 10
    `);
}