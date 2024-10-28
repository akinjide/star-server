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
    app.get('/rubrics', isAuthenticated(options), isEqualAuthorized, (req, res) => {
        return app.pg.query(query.rubrics.find, [], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return handleSuccess(req, res, null, b.rows)
            }

            return handleSuccess(req, res, 'no rubrics')
        })
    })

    app.get('/rubrics/:rubric_id', isAuthenticated(options), isEqualAuthorized, (req, res) => {
        const { rubric_id } = req.params

        return app.pg.query(query.rubrics.findOne, [rubric_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return handleSuccess(req, res, null, b.rows[0])
            }

            return handleSuccess(req, res, 'rubric not found')
        })
    })
}
