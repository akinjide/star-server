const http = require('http')
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
const { handleError, handleSuccess } = require('../hooks/http')
const validation = require('../hooks/validation')

module.exports = (app, options) => {

    app.get('/roles', isAuthenticated(options), isLessThanTwoAuthorized, (req, res) => {
        return app.pg.query(query.roles.find, [], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return res.status(200).json(b.rows[0])
            }

            return handleSuccess(req, res, 'no roles')
        })
    })

    app.get('/roles/:role_id', isAuthenticated(options), isLessThanTwoAuthorized, (req, res) => {
        const { role_id } = req.params

        return app.pg.query(query.roles.findByID, [role_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return res.status(200).json(b.rows[0])
            }

            return handleSuccess(req, res, 'role not found')
        })
    })

    app.delete('/roles/:role_id', isAuthenticated(options), isLessThanTwoAuthorized, (req, res) => {
        const { role_id } = req.params

        app.pg.query(query.roles.findByID, [role_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return app.pg.query(query.roles.deleteOne, [role_id], (err) => {
                    if (err) {
                        return handleError(err, req, res)
                    }

                    return handleSuccess(req, res, 'role permission deleted')
                })
            }

            return handleSuccess(req, res, 'role not found')
        })
    })

    app.post('/roles/replace', validation.rbac.replace, isAuthenticated(options), isLessThanTwoAuthorized, (req, res) => {
        const { role_id, user_id } = req.body

        app.pg.query(query.users.findOne, [user_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return app.pg.query(query.roles.findByID, [role_id], (err, b) => {
                    if (err) {
                        return handleError(err, req, res)
                    }

                    if (b.rows && b.rows[0]) {
                        return app.pg.query(query.users.update, [user_id, role_id], (err) => {
                            if (err) {
                                return handleError(err, req, res)
                            }

                            return res.status(201).json(b.rows[0])
                        })
                    }

                    return handleSuccess(req, res, 'role not found')
                })
            }

            return handleSuccess(req, res, 'user not found')
        })
    })

    app.post('/permissions', validation.rbac.create, isAuthenticated(options), isLessThanTwoAuthorized, (req, res) => {
        const { description = '', slug } = req.body

        app.pg.query(query.permissions.findBySlug, [slug], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return handleError(null, req, res, 'permission with slug exist', 400)
            }

            return app.pg.query(query.permissions.create, [description, slug], (err, b) => {
                if (err) {
                    return handleError(err, req, res)
                }

                return res.status(201).json(b.rows[0])
            })
        })
    })

    app.get('/permissions', isAuthenticated(options), isLessThanTwoAuthorized, (req, res) => {
        app.pg.query(query.permissions.find, [], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return res.status(200).json(b.rows[0])
            }

            return handleSuccess(req, res, 'no permissions')
        })
    })

    app.get('/permissions/:permission_id', isAuthenticated(options), isLessThanTwoAuthorized, (req, res) => {
        const { permission_id } = req.params

        app.pg.query(query.permissions.findOne, [permission_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return res.status(200).json(b.rows[0])
            }

            return handleSuccess(req, res, 'permission not found')
        })
    })

    app.put('/permissions/:permission_id', validation.rbac.update, isAuthenticated(options), isLessThanTwoAuthorized, (req, res) => {
        const { permission_id } = req.params
        const { description } = req.body

        app.pg.query(query.permissions.findOne, [permission_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return app.pg.query(query.permissions.update, [permission_id, description], (err) => {
                    if (err) {
                        return handleError(err, req, res)
                    }

                    return res.status(201).json(b.rows[0])
                })
            }

            return handleSuccess(req, res, 'permission not found')
        })
    })

    app.delete('/permissions/:permission_id', isAuthenticated(options), isLessThanTwoAuthorized, (req, res) => {
        const { permission_id } = req.params

        app.pg.query(query.permissions.findOne, [permission_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return app.pg.query(query.permissions.delete, [permission_id], (err) => {
                    if (err) {
                        return handleError(err, req, res)
                    }

                    return handleSuccess(req, res, 'permission deleted')
                })
            }

            return handleSuccess(req, res, 'permission not found')
        })
    })

    app.post('/permissions/attach', validation.rbac.attachOrDetach, isAuthenticated(options), isLessThanTwoAuthorized, (req, res) => {
        const { role_id, permission_id } = req.body

        app.pg.query(query.roles.findOne, [role_id, permission_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return handleError(null, req, res, 'permission already attached to role', 400)
            }

            return app.pg.query(query.roles.create, [role_id, permission_id, roles[role_id]], (err, b) => {
                if (err) {
                    return handleError(err, req, res)
                }

                return res.status(200).json(b.rows[0])
            })
        })
    })

    app.post('/permissions/detach', validation.rbac.attachOrDetach, isAuthenticated(options), isLessThanTwoAuthorized, (req, res) => {
        const { role_id, permission_id } = req.body

        app.pg.query(query.roles.findOne, [role_id, permission_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return handleError(null, req, res, 'permission not attached to role', 400)
            }

            return app.pg.query(query.roles.delete, [role_id, permission_id], (err, b) => {
                if (err) {
                    return handleError(err, req, res)
                }

                return handleSuccess(req, res, 'permission detached from role successfully')
            })
        })
    })
}
