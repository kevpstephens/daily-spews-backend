const { commentData, articleData } = require("../../db/data/test-data")
const { selectTopics, selectArticleById, selectAllArticles, selectCommentsByArticleId, insertCommentByArticleId, updateArticleById, removeCommentById } = require("../models/topics.model")

exports.getTopics = async (req, res, next) => {
    try {
        const topics = await selectTopics()
        res.status(200).send({ topics })
    } catch (err) {
        next(err)
    }
}

exports.getArticlesById = async (req, res, next) => {
    const {article_id} = req.params

    try {
        const article = await selectArticleById(article_id)
        res.status(200).send({article})
    } catch (err) {
        next(err)
    }
}

exports.getAllArticles = async (req, res, next) => {
    try {
        const articles = await selectAllArticles()
        res.status(200).send({articles})
    } catch (err) {
        next(err)
    }
}

exports.getCommentsByArticleId = async (req, res, next) => {
    const {article_id} = req.params

    try {
        const comments = await selectCommentsByArticleId(article_id)
        res.status(200).send({comments})
    } catch (err) {
        next(err)
    }
}

exports.postCommentByArticleId = async (req, res, next) => {
    const {article_id} = req.params
    const {username, body} = req.body

    if (!body) {
        return res.status(400).send({msg: "Bad request!"})
    }

    try {
        await selectArticleById(article_id)
        const newComment = await insertCommentByArticleId(article_id, {username, body})
        res.status(201).send({comment: newComment})
    } catch (err) {
        next(err)
    }
}

exports.patchArticleById = async (req, res, next) => {
    const {article_id} = req.params
    const {inc_votes} = req.body

    if (isNaN(inc_votes) || isNaN(article_id)) {
        return res.status(400).send({msg: 'Bad request!'})
    }

    try {
        await selectArticleById(article_id)
        const updatedArticle = await updateArticleById(inc_votes, article_id)
        res.status(200).send({article: updatedArticle})

    } catch (err) {
        next(err)
    }
}

exports.deleteCommentById = async (req, res, next) => {
    const {comment_id} = req.params

    if (isNaN(comment_id)) {
        return res.status(400).send({msg: 'Bad request!'})
    }
    
    try {
        await removeCommentById(comment_id)
        res.status(204).send()

    } catch (err) {
        next (err)
    }
}