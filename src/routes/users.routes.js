import { Router } from "express";
import validationMiddleware from "../middlewares/validation.middleware.js";
import { getMe, getRanking, postLogin, postRegister } from "../controllers/users.controller.js";
import { loginSchema, registerSchema } from "../schemas/users.schema.js";
import validateTokenMiddleware from "../middlewares/validateToken.middleware.js";


const usersRouter=Router();

usersRouter.post("/signup", validationMiddleware(registerSchema), postRegister);
usersRouter.post("/signin", validationMiddleware(loginSchema), postLogin);
usersRouter.get("/ranking", getRanking);

//autenticated
usersRouter.get("/users/me", validateTokenMiddleware, getMe);


export default usersRouter;