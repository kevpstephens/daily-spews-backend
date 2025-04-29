const db = require("../../db/connection.js")

exports.selectTopics = async () => {
    const result = await db.query(`SELECT 
        slug, 
        description 
        FROM topics;`)
    return result.rows 
}

exports.selectArticleById = async (article_id) => {
    const result = await db.query(
        `SELECT * FROM articles
        WHERE article_id = $1`, 
        [article_id])

        if (!result.rows.length) { 
            throw {
                status: 404,
                msg: `Article not found!`
            }
        }       

    return result.rows[0]
}