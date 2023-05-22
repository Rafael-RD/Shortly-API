import { Router } from "express";
import validationMiddleware from "../middlewares/validation.middleware.js";
import { postLogin, postRegister } from "../controllers/users.controller.js";
import { loginSchema, registerSchema } from "../schemas/users.schema.js";


const usersRouter=Router();

usersRouter.post("/signup", validationMiddleware(registerSchema), postRegister);
usersRouter.post("/signin", validationMiddleware(loginSchema), postLogin);
usersRouter.get("/ranking");

//autenticated
usersRouter.get("/users/me");


export default usersRouter;