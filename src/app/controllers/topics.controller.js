const { selectTopics, insertTopic } = require("../models/topics.model");

//! GET /api/topics
exports.getTopics = async (req, res, next) => {
  try {
    const topics = await selectTopics();
    res.status(200).send({ topics });
  } catch (err) {
    next(err);
  }
};

//! POST /api/topics
exports.postTopic = async (req, res, next) => {
  const topicData = req.body;

  try {
    const newTopic = await insertTopic(topicData);
    res.status(201).send({ topic: newTopic });
  } catch (err) {
    next(err);
  }
};
