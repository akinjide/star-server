const http = require('http')
const passport = require('passport')
const query = require('../query')
const logger = require('../logger')
const { isAuthorized, isAuthenticated } = require('../hooks/policy')
const { encryptPassword, create } = require('../hooks/token')
const userValidation = require('../hooks/validation/users')

module.exports = (app, options) => {
    app.post('/auth/login', userValidation.login, passport.authenticate('local', options.passport), (req, res) => {
        return res.json({ ...req.user, token: create(req.user) })
    })

    app.post('/auth/create', (req, res) => {
        const { full_name, title = '', email, passwd, department = '', graduation_year, student_number } = req.body

        app.pg.query(query.auth.find, [email], (err, b) => {
            if (err) {
                logger.error(err, { req: req })
                return res.status(500).json({
                    errorCode: 500,
                    errorMessage: http.STATUS_CODES[500],
                })
            }

            if (b.rows && b.rows[0]) {
                return res.status(400).json({
                    errorCode: 400,
                    errorMessage: 'account with email or password exist',
                })
            }

            encryptPassword(passwd, (err, { hash }) => {
                if (err) {
                    logger.error(err, { req: req })
                    return res.status(500).json({
                        errorCode: 500,
                        errorMessage: http.STATUS_CODES[500],
                    })
                }

                const p = [full_name, title, email, hash, department, graduation_year, student_number, 1]

                app.pg.query(query.auth.create, p, (err, b) => {
                    if (err) {
                        logger.error(err, { req: req })
                        return res.status(500).json({
                            errorCode: 500,
                            errorMessage: http.STATUS_CODES[500],
                        })
                    }

                    const [{ id }] = b.rows
                    return res.status(201).json({ id, email, token: create({ id, email }) })
                })
            })
        })
    })

    app.get('/users', isAuthenticated(options), isAuthorized, (req, res) => {
        app.pg.query(query.auth.find, [], (err, b) => {
            if (err) {
                logger.error(err, { req: req })
                return res.status(500).json({
                    errorCode: 500,
                    errorMessage: http.STATUS_CODES[500],
                })
            }

            if (b.rows && b.rows[0]) {
                return res.status(200).json(b.rows[0])
            }

            return res.status(200).json({
                message: 'no users'
            })
        })
    })

    app.get('/users/:user_id', isAuthenticated(options), isAuthorized, (req, res) => {
        const { user_id } = req.params

        app.pg.query(query.auth.findOne, [user_id], (err, b) => {
            if (err) {
                logger.error(err, { req: req })
                return res.status(500).json({
                    errorCode: 500,
                    errorMessage: http.STATUS_CODES[500],
                })
            }

            if (b.rows && b.rows[0]) {
                return res.status(200).json(b.rows[0])
            }

            return res.status(200).json({
                message: 'user not found'
            })
        })
    })

    app.delete('/users/:user_id', isAuthenticated(options), isAuthorized, (req, res) => {
        const { user_id } = req.params

        app.pg.query(query.auth.findOne, [user_id], (err, b) => {
            if (err) {
                logger.error(err, { req: req })
                return res.status(500).json({
                    errorCode: 500,
                    errorMessage: http.STATUS_CODES[500],
                })
            }

            if (b.rows && b.rows[0]) {
                return app.pg.query(query.auth.deleteOne, [user_id], (err) => {
                    if (err) {
                        logger.error(err, { req: req })
                        return res.status(500).json({
                            errorCode: 500,
                            errorMessage: http.STATUS_CODES[500],
                        })
                    }

                    return res.status(200).json({
                        message: 'user deleted'
                    })
                })
            }
        })
    })
}
