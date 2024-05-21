const http = require('http')
const passport = require('passport')
const query = require('../query')
const logger = require('../logger')
const { encryptPassword, create } = require('../hooks/token')

const services = (app, options) => {
    app.post('/auth/login', passport.authenticate('local', options.passport), (req, res) => {
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

    app.get('/', (req, res) => {
        res.send('OK')
    })
}

module.exports = {
    services
}