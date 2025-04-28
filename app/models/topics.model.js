const db = require("../../db/connection.js")

exports.selectTopics = async () => {
    const result = await db.query(`SELECT 
        slug, 
        description 
        FROM topics;`)
    return result.rows 
}