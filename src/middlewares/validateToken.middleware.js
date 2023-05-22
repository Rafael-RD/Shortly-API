import db from "../database/database.connection.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default async function validateTokenMiddleware(req, res, next){
    const {token}=req.headers;
    
    try {
        const tokenData=jwt.verify(token, process.env.JWT_SECRET);
        const emailSearch = await db.query(`SELECT * FROM users WHERE email=$1`, [tokenData.email]);
        if (emailSearch.rowCount !== 1) return res.sendStatus(401);
        res.locals.token=tokenData;
        next();
    } catch (error) {
        console.error(error);
        return res.sendStatus(401);
    }
}