import express from "express";
import dotenv from "dotenv";
import router from "./routes/index.routes.js";

const server=express();
dotenv.config();

server.use(router);

server.listen(process.env.PORT,()=>console.log("Server running on "+process.env.PORT));
