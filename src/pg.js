const { Pool } = require('pg')
const config = require('config')
const logger = require('./logger')

const pool = new Pool({
    connectionString: config.get('postgresql.connection'),
    max: config.get('postgresql.poolSizeMax'),
    idleTimeoutMillis:  config.get('postgresql.idleTimeoutMs'),
    connectionTimeoutMillis: config.get('postgresql.connTimeoutMs'),
})

const query = (text, params, callback) => {
    const start = Date.now()
    // pool.query with diagnostic information to debug connection leak
    return pool.query(text, params, (err, res) => {
        const duration = Date.now() - start
        logger.debug('executed query', { text, duration, rows: (res ? res.rowCount : 0 ) })
        callback(err, res)
    })
}

const client = (callback) => {
    // pool.connect with transactional diagnostic information to debug connection leak
    pool.connect((err, client, done) => {
        const { query } = client

        client.query = (...args) => {
            client.lastQuery = args
            return query.apply(client, args)
        }

        const timeout = setTimeout(() => {
            logger.debug('client exceeded 5 seconds!')
            logger.debug(`last executed query on client was: ${client.lastQuery}`)
        }, 5000)

        const release = (err) => {
            done(err)
            clearTimeout(timeout)
            client.query = query
        }

        callback(err, client, release)
    })
}

module.exports = {
    query,
    client,
    pool,
}
