import express from "express";
import { getTopics, postTopic } from "../controllers/topics.controller.js";

const topicsRouter = express.Router();

//! GET /api/topics
topicsRouter.get("/", getTopics);

//! POST /api/topics
topicsRouter.post("/", postTopic);

export default topicsRouter;
