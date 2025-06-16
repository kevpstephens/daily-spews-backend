const express = require("express");
const { getTopics } = require("../controllers/topics.controller");

const topicsRouter = express.Router();

// GET all topics
topicsRouter.get("/", getTopics);

module.exports = topicsRouter;