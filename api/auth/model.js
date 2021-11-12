const db = require('../../data/dbConfig')

function findBy(filter) {
    return db('users')
    .select('username', 'password', 'user_id')
    .where(filter)
}

module.exports = {
    findBy,
}