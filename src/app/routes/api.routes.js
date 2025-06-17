const express = require("express");
const topicsRouter = require("./topics.routes");
const articlesRouter = require("./articles.routes");
const commentsRouter = require("./comments.routes");
const usersRouter = require("./users.routes");
const authRouter = require("./auth.routes");
const { getApi } = require("../controllers/api.controller");

const apiRouter = express.Router();

apiRouter.get("/", getApi);

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/", commentsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/auth", authRouter);

module.exports = apiRouter;
