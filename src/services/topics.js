const http = require('http')
const passport = require('passport')
const query = require('../query')
const logger = require('../logger')
const {
    isAuthorized,
    isAuthenticated,
    isPermitted,
    isLessThanTwoAuthorized,
    isLessThanThreeAuthorized,
    isEqualAuthorized,
    roles
} = require('../hooks/policy')
const { encryptPassword, create } = require('../hooks/token')
const { handleError, handleSuccess } = require('../hooks/http')
const validation = require('../hooks/validation')

module.exports = (app, options) => {
    app.get('/topics', isAuthenticated(options), isEqualAuthorized, (req, res) => {
        return app.pg.query(query.topics.find, [], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return handleSuccess(req, res, null, b.rows)
            }

            return handleSuccess(req, res, 'no topics')
        })
    })

    app.get('/topics/:topic_id', isAuthenticated(options), isEqualAuthorized, (req, res) => {
        const { topic_id } = req.params

        return app.pg.query(query.topics.findOne, [topic_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return handleSuccess(req, res, null, b.rows[0])
            }

            return handleSuccess(req, res, 'topic not found')
        })
    })

    app.post('/topics', validation.topics.create, isAuthenticated(options), isLessThanThreeAuthorized, (req, res) => {
        const { name, supervisor_id, description = '', raw_text = '', url = '' } = req.body

        app.pg.query(query.users.findOne, [supervisor_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return app.pg.query(query.topics.create, [name, supervisor_id, description, url, raw_text], (err, b) => {
                    if (err) {
                        return handleError(err, req, res)
                    }

                    return handleSuccess(req, res, null, b.rows[0])
                })
            }

            return handleSuccess(req, res, 'user not found')
        })
    })

    app.put('/topics/:topic_id', validation.topics.update, isAuthenticated(options), isLessThanThreeAuthorized, (req, res) => {
        const { topic_id } = req.params

        return app.pg.query(query.topics.findOne, [topic_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                const { name, description, raw_text, url } = {
                    ...b.rows[0],
                    ...req.body
                }

                return app.pg.query(query.topics.update, [name, url, description, raw_text, new Date(), topic_id], (err, b) => {
                    if (err) {
                        return handleError(err, req, res)
                    }

                    return handleSuccess(req, res, null, b.rows[0])
                })
            }

            return handleSuccess(req, res, 'topic not found')
        })
    })

    app.delete('/topics/:topic_id', validation.topics.delete, isAuthenticated(options), isLessThanThreeAuthorized, (req, res) => {
        const { topic_id } = req.params
        const { supervisor_id } = req.body

        return app.pg.query(query.topics.findOne, [topic_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return app.pg.query(query.topics.delete, [topic_id, supervisor_id], (err) => {
                    if (err) {
                        return handleError(err, req, res)
                    }

                    return handleSuccess(req, res, 'topic deleted')
                })
            }

            return handleSuccess(req, res, 'topic not found')
        })
    })
}
