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
    app.get('/messages', isAuthenticated(options), isEqualAuthorized, (req, res) => {
        const { id: user_id } = req.user

        return app.pg.query(query.messages.find, [], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                const messages = []

                for (const row of b.rows) {
                    if (user_id == row.user_id) {
                        messages.push({
                            avatar: row.user_image,
                            title: 'You',
                            subtitle: {
                                created_at: row.added_at,
                                text: row.message,
                                color: "teal"
                            }
                        })

                        continue
                    }

                    messages.push({
                        avatar: row.user_image,
                        title: row.user_full_name,
                        subtitle: {
                            created_at: row.added_at,
                            text: row.message,
                            color: "black"
                        }
                    })
                }

                return handleSuccess(req, res, null, messages)
            }

            return handleSuccess(req, res, 'no messages')
        })
    })

    app.post('/messages', isAuthenticated(options), isEqualAuthorized, (req, res) => {
        const { id: user_id } = req.user
        const { message } = req.body

        return app.pg.query(query.messages.create, [user_id, message], (err) => {
            if (err) {
                return handleError(err, req, res)
            }

            return handleSuccess(req, res, 'message created successfully')
        })
    })
}
