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
    app.post('/auth/login', validation.users.login, passport.authenticate('local', options.passport), (req, res) => {
        return res.json({ ...req.user, token: create(req.user) })
    })

    app.post('/auth/create', isAuthenticated(options), isLessThanTwoAuthorized, isPermitted(app.pg), (req, res) => {
        const { full_name, title = '', email, passwd, department = '', graduation_year = '', student_number = '', role_id = 1 } = req.body

        app.pg.query(query.users.findByEmail, [email], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return handleError(null, req, res, 'account with email or password exist', 400)
            }

            encryptPassword(passwd, (err, { hash }) => {
                if (err) {
                    return handleError(err, req, res)
                }

                const p = [full_name, title, email, hash, department, graduation_year, student_number, role_id]

                app.pg.query(query.users.create, p, (err, b) => {
                    if (err) {
                        return handleError(err, req, res)
                    }

                    const [{ id }] = b.rows

                    return res.status(201).json({ id, email, token: create({ id, email }) })
                })
            })
        })
    })

    app.get('/users', isAuthenticated(options), isEqualAuthorized, isPermitted(app.pg), (req, res) => {
        app.pg.query(query.users.find, [], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return res.status(200).json(b.rows[0])
            }

            return handleSuccess(req, res, 'no users')
        })
    })

    app.get('/users/:user_id', isAuthenticated(options), isEqualAuthorized, isPermitted(app.pg), (req, res) => {
        const { user_id } = req.params

        app.pg.query(query.users.findOne, [user_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return res.status(200).json(b.rows[0])
            }

            return handleSuccess(req, res, 'user not found')
        })
    })

    app.delete('/users/:user_id', isAuthenticated(options), isLessThanThreeAuthorized, isPermitted(app.pg), (req, res) => {
        const { user_id } = req.params

        app.pg.query(query.users.findOne, [user_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return app.pg.query(query.users.deleteOne, [user_id], (err) => {
                    if (err) {
                        return handleError(err, req, res)
                    }

                    return handleSuccess(req, res, 'user deleted')
                })
            }

            return handleSuccess(req, res, 'user not found')
        })
    })
}
