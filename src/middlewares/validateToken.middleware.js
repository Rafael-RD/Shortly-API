import db from "../database/database.connection.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default async function validateTokenMiddleware(req, res, next){
    const token=req.headers.authorization.replace("Bearer ", "");

    try {
        const tokenData=jwt.verify(token, process.env.JWT_SECRET);
        res.locals.tokenData=tokenData;
        next();
    } catch (error) {
        console.error(error); //remover
        return res.sendStatus(401);
    }
}