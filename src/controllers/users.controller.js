import db from "../database/database.connection.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export async function postRegister(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) return res.status(422).send("passwords did not match");

    try {
        const emailSearch = await db.query(`SELECT * FROM users WHERE email=$1`, [email]);
        if (emailSearch.rowCount) return res.sendStatus(409);

        const hash = bcrypt.hashSync(password, 10);
        const createLog = await db.query(`
            INSERT INTO users (name, email, password, "createdAt")
            VALUES ($1, $2, $3, $4)`, [name, email, hash, new Date().toISOString()]);

        return res.sendStatus(201);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

export async function postLogin(req, res){
    const { email, password }=req.body;

    try {
        const emailSearch=await db.query(`SELECT * FROM users WHERE email=$1`, [email]);
        if(emailSearch.rowCount!==1) return res.sendStatus(404);
        if(bcrypt.compareSync(password, emailSearch.rows[0].password)===false) return res.sendStatus(401);
        const token=jwt.sign({email, password: emailSearch.rows[0].password}, process.env.JWT_SECRET, {expiresIn: "24h"});
        return res.send({token});
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}