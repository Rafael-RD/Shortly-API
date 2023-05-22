import express from "express";
import dotenv from "dotenv";
import cors from "cors";

const server=express();
dotenv.config();
server.use(cors());
server.use(express.json());


server.listen(process.env.PORT,()=>console.log("Server running on "+process.env.PORT));
