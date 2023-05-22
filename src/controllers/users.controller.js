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
            INSERT INTO users (name, email, password)
            VALUES ($1, $2, $3)`, [name, email, hash]);

        return res.sendStatus(201);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

export async function postLogin(req, res) {
    const { email, password } = req.body;

    try {
        const emailSearch = await db.query(`SELECT * FROM users WHERE email=$1`, [email]);
        if (emailSearch.rowCount !== 1) return res.sendStatus(404);
        if (bcrypt.compareSync(password, emailSearch.rows[0].password) === false) return res.sendStatus(401);
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "24h" });
        return res.send({ token });
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

export async function getMe(req, res) {
    const { email } = res.locals.tokenData;

    try {
        const emailSearch = await db.query("SELECT * FROM users WHERE email=$1", [email]);
        if (!emailSearch.rowCount) return res.sendStatus(401);
        const urlSearch = await db.query(`SELECT * FROM links WHERE "userId"=$1`, [emailSearch.rows[0].id]);
        return res.send({
            id: emailSearch.rows[0].id,
            name: emailSearch.rows[0].name,
            visitCount: urlSearch.rows.reduce((acc, cur) => acc + cur.timesUsed, 0),
            shortenedUrls: urlSearch.rows.map(obj => ({
                id: obj.id,
                shortUrl: obj.urlShorted,
                url: obj.urlOriginal,
                visitCount: obj.timesUsed
            }))
        });
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

export async function getRanking(req, res) {

    try {
        const search=db.query(`
        SELECT users.id, users.name, COUNT(links) AS "linksCount", SUM(links."timesUsed") AS "visitCount"
        FROM users
        LEFT JOIN links ON links."userId"=users.id
        GROUP BY users.id
        ORDER BY "visitCount" DESC
        LIMIT 10
        `)
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}