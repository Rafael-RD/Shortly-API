import { Router } from "express";
import validationMiddleware from "../middlewares/validation.middleware.js";
import { urlSchema } from "../schemas/urls.schema.js";
import validateTokenMiddleware from "../middlewares/validateToken.middleware.js";
import { postUrl } from "../controllers/urls.controller.js";

const urlsRouter=Router();

urlsRouter.get("/urls/:id");
urlsRouter.get("/urls/open/:shortUrl");

//autenticated
urlsRouter.post("/urls/shorten", validateTokenMiddleware, validationMiddleware(urlSchema), postUrl);
urlsRouter.delete("/urls/:id", validateTokenMiddleware);

export default urlsRouter;