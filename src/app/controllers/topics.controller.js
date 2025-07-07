const { selectTopics, insertTopic } = require("../models/topics.model");

//! GET /api/topics
exports.getTopics = async (req, res, next) => {
  try {
    const topics = await selectTopics();
    return res.status(200).send({ topics });
  } catch (err) {
    return next(err);
  }
};

//! POST /api/topics
exports.postTopic = async (req, res, next) => {
  const topicData = req.body;

  if (!topicData || !topicData.slug || !topicData.description) {
    return res.status(400).send({ msg: "Missing required topic fields!" });
  }

  try {
    const newTopic = await insertTopic(topicData);
    return res.status(201).send({ topic: newTopic });
  } catch (err) {
    return next(err);
  }
};
