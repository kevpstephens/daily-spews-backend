const { selectArticleById, selectAllArticles, updateArticleById } = require("../models/articles.model.js")


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