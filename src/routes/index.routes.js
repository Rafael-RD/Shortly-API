import express from "express";
import usersRouter from "./users.routes.js";
import urlsRouter from "./urls.routes.js";
import cors from "cors";

const router=express.Router();
router.use(cors());
router.use(express.json());

router.use(usersRouter);
router.use(urlsRouter);

export default router;