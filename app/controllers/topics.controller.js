const { selectTopics, selectArticleById, selectAllArticles, selectCommentsByArticleId, insertCommentByArticleId, updateArticleById } = require("../models/topics.model")

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
        throw {
            status: 400,
            msg: 'Bad request!'
        }
    }

    try {
        await selectArticleById(article_id)
        const newComment = await insertCommentByArticleId(article_id, {username, body})
        res.status(201).send({comment: newComment})
    } catch (err) {
        next(err)
    }
}

exports.patchArticlebyId = async (req, res, next) => {
    const {article_id} = req.params
    const {inc_votes} = req.body

    if (isNaN(inc_votes) || isNaN(article_id)) {
        throw {
            status: 400,
            msg: 'Bad request!'
        }
    }

    try {
        await selectArticleById(article_id)
        const updatedArticle = await updateArticleById(inc_votes, article_id)
        res.status(200).send({article: updatedArticle})

    } catch (err) {
        next(err)
    }
}