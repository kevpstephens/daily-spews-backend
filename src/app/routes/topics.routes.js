const express = require("express");
const { getTopics, postTopic } = require("../controllers/topics.controller");

const topicsRouter = express.Router();

//! GET /api/topics
topicsRouter.get("/", getTopics);

//! POST /api/topics
topicsRouter.post("/", postTopic);

module.exports = topicsRouter;
