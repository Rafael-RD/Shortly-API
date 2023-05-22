import { Router } from "express";
import validationMiddleware from "../middlewares/validation.middleware.js";
import { urlSchema } from "../schemas/urls.schema.js";
import validateTokenMiddleware from "../middlewares/validateToken.middleware.js";
import { deleteById, getOpenUrl, getUrlById, postUrl } from "../controllers/urls.controller.js";

const urlsRouter=Router();

urlsRouter.get("/urls/:id", getUrlById);
urlsRouter.get("/urls/open/:shortUrl", getOpenUrl);

//autenticated
urlsRouter.post("/urls/shorten", validateTokenMiddleware, validationMiddleware(urlSchema), postUrl);
urlsRouter.delete("/urls/:id", validateTokenMiddleware, deleteById);

export default urlsRouter;