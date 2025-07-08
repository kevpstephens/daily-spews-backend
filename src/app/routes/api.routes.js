import express from "express";
import topicsRouter from "./topics.routes.js";
import articlesRouter from "./articles.routes.js";
import commentsRouter from "./comments.routes.js";
import usersRouter from "./users.routes.js";
import authRouter from "./auth.routes.js";
import getApi from "../controllers/api.controller.js";

const apiRouter = express.Router();

apiRouter.get("/", getApi);

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/", commentsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/auth", authRouter);

export default apiRouter;
