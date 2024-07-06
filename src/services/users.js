const http = require('http')
const passport = require('passport')
const query = require('../query')
const logger = require('../logger')
const { isAuthorized, isAuthenticated, roles } = require('../hooks/policy')
const { encryptPassword, create } = require('../hooks/token')
const validation = require('../hooks/validation')

module.exports = (app, options) => {
    const isLessThanTwoAuthorized = isAuthorized([
        roles[1]
    ])

    const isLessThanThreeAuthorized = isAuthorized([
        roles[1],
        roles[2]
    ])

    app.post('/auth/login', validation.users.login, passport.authenticate('local', options.passport), (req, res) => {
        return res.json({ ...req.user, token: create(req.user) })
    })

    app.post('/auth/create', validation.users.create, isAuthenticated(options), isLessThanTwoAuthorized, (req, res) => {
        const { full_name, title = '', email, passwd, department = '', graduation_year, student_number } = req.body

        app.pg.query(query.users.findByEmail, [email], (err, b) => {
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

                app.pg.query(query.users.create, p, (err, b) => {
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
        app.pg.query(query.users.find, [], (err, b) => {
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
                errorCode: -1,
                errorMessage: null,
                message: 'no users'
            })
        })
    })

    app.get('/users/:user_id', isAuthenticated(options), isAuthorized, (req, res) => {
        const { user_id } = req.params

        app.pg.query(query.users.findOne, [user_id], (err, b) => {
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
                errorCode: -1,
                errorMessage: null,
                message: 'user not found'
            })
        })
    })

    app.delete('/users/:user_id', isAuthenticated(options), isLessThanThreeAuthorized, (req, res) => {
        const { user_id } = req.params

        app.pg.query(query.users.findOne, [user_id], (err, b) => {
            if (err) {
                logger.error(err, { req: req })
                return res.status(500).json({
                    errorCode: 500,
                    errorMessage: http.STATUS_CODES[500],
                })
            }

            if (b.rows && b.rows[0]) {
                return app.pg.query(query.users.deleteOne, [user_id], (err) => {
                    if (err) {
                        logger.error(err, { req: req })
                        return res.status(500).json({
                            errorCode: 500,
                            errorMessage: http.STATUS_CODES[500],
                        })
                    }

                    return res.status(200).json({
                        errorCode: -1,
                        errorMessage: null,
                        message: 'user deleted'
                    })
                })
            }

            return res.status(200).json({
                errorCode: -1,
                errorMessage: null,
                message: 'user not found'
            })
        })
    })
}
