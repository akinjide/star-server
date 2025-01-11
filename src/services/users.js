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
        return handleSuccess(req, res, null, { ...req.user, token: create(req.user) })
    })

    app.post('/auth/create', isAuthenticated(options), isLessThanTwoAuthorized, isPermitted(app.pg), (req, res) => {
        const {
            full_name,
            title = '',
            image = 'uploads/images/13099629981030824019.png',
            email,
            passwd,
            department = '',
            graduation_year = null,
            student_number = null,
            role_id = 1
        } = req.body

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

                const p = [full_name, title, email, hash, department, graduation_year, student_number, role_id, image]

                app.pg.query(query.users.create, p, (err, b) => {
                    if (err) {
                        return handleError(err, req, res)
                    }

                    const [{ id }] = b.rows

                    return handleSuccess(req, res, null, { id, email, token: create({ id, email }) }, 201)
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
                return handleSuccess(req, res, null, b.rows)
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
                return handleSuccess(req, res, null, b.rows[0])
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

    app.put('/users/:user_id', isAuthenticated(options), isLessThanTwoAuthorized, isPermitted(app.pg), (req, res) => {
        const { user_id } = req.params

        app.pg.query(query.users.findOne, [user_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                const { passwd: newPasswd } = req.body
                const user = b.rows[0]
                const applyChanges = (p, callback) => {
                    return app.pg.query(query.users.updateOne, p, (err, b) => {
                        if (err) {
                            return callback(err)
                        }

                        return callback(null)
                    })
                }

                const {
                    full_name,
                    title,
                    email,
                    department,
                    graduation_year,
                    student_number,
                    role_id,
                    password,
                    image
                } = {
                    ...b.rows[0],
                    ...req.body
                }

                if (newPasswd && newPasswd.length > 0) {
                    return encryptPassword(newPasswd, (err, { hash }) => {
                        if (err) {
                            return handleError(err, req, res)
                        }

                        const p = [user_id, full_name, title, email, hash, department, graduation_year, student_number, image, role_id]
                        return applyChanges(p, (err) => {
                            if (err) {
                                return handleError(err, req, res)
                            }

                            return handleSuccess(req, res, null)
                        })
                    })
                }

                const p = [user_id, full_name, title, email, password, department, graduation_year, student_number, image, role_id]
                return applyChanges(p, (err, b) => {
                    if (err) {
                        return handleError(err, req, res)
                    }

                    return handleSuccess(req, res, null)
                })
            }

            return handleSuccess(req, res, 'user not found')
        })
    })
}
