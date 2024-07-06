const http = require('http')
const query = require('../query')
const logger = require('../logger')
const { isAuthorized, isAuthenticated, roles } = require('../hooks/policy')

module.exports = (app, options) => {
    const isLessThanTwoAuthorized = isAuthorized([
        roles[1]
    ])

    app.get('/roles', isAuthenticated(options), isLessThanTwoAuthorized, (req, res) => {
        return app.pg.query(query.roles.find, [], (err, b) => {
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
                message: 'no roles'
            })
        })
    })

    app.get('/roles/:role_id', isAuthenticated(options), isLessThanTwoAuthorized, (req, res) => {
        const { role_id } = req.params

        return app.pg.query(query.roles.findByID, [role_id], (err, b) => {
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
                message: 'role not found'
            })
        })
    })

    app.delete('/roles/:role_id', isAuthenticated(options), isLessThanTwoAuthorized, (req, res) => {
        const { role_id } = req.params


        app.pg.query(query.roles.findByID, [role_id], (err, b) => {
            if (err) {
                logger.error(err, { req: req })
                return res.status(500).json({
                    errorCode: 500,
                    errorMessage: http.STATUS_CODES[500],
                })
            }

            if (b.rows && b.rows[0]) {
                return app.pg.query(query.roles.deleteOne, [role_id], (err) => {
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
                        message: 'role permission deleted'
                    })
                })
            }

            return res.status(200).json({
                errorCode: -1,
                errorMessage: null,
                message: 'role not found'
            })
        })
    })

    app.post('/roles/replace', isAuthenticated(options), isLessThanTwoAuthorized, (req, res) => {
        const { role_id, user_id } = req.body

        app.pg.query(query.users.findOne, [user_id], (err, b) => {
            if (err) {
                logger.error(err, { req: req })
                return res.status(500).json({
                    errorCode: 500,
                    errorMessage: http.STATUS_CODES[500],
                })
            }

            if (b.rows && b.rows[0]) {
                return app.pg.query(query.roles.findByID, [role_id], (err, b) => {
                    if (err) {
                        logger.error(err, { req: req })
                        return res.status(500).json({
                            errorCode: 500,
                            errorMessage: http.STATUS_CODES[500],
                        })
                    }

                    if (b.rows && b.rows[0]) {
                        return app.pg.query(query.users.update, [user_id, role_id], (err) => {
                            if (err) {
                                logger.error(err, { req: req })
                                return res.status(500).json({
                                    errorCode: 500,
                                    errorMessage: http.STATUS_CODES[500],
                                })
                            }

                            return res.status(201).json(b.rows[0])
                        })
                    }

                    return res.status(200).json({
                        errorCode: -1,
                        errorMessage: null,
                        message: 'role not found'
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

    app.post('/permissions', isAuthenticated(options), isLessThanTwoAuthorized, (req, res) => {
        const { description = '', slug } = req.body

        app.pg.query(query.permissions.findBySlug, [slug], (err, b) => {
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
                    errorMessage: 'permission with slug exist',
                })
            }

            return app.pg.query(query.permissions.create, [description, slug], (err, b) => {
                if (err) {
                    logger.error(err, { req: req })
                    return res.status(500).json({
                        errorCode: 500,
                        errorMessage: http.STATUS_CODES[500],
                    })
                }

                return res.status(201).json(b.rows[0])
            })
        })
    })

    app.get('/permissions', isAuthenticated(options), isLessThanTwoAuthorized, (req, res) => {
        app.pg.query(query.permissions.find, [], (err, b) => {
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
                message: 'no permissions'
            })
        })
    })

    app.get('/permissions/:permission_id', isAuthenticated(options), isLessThanTwoAuthorized, (req, res) => {
        const { permission_id } = req.params

        app.pg.query(query.permissions.findOne, [permission_id], (err, b) => {
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
                message: 'permission not found'
            })
        })
    })

    app.put('/permissions/:permission_id', isAuthenticated(options), isLessThanTwoAuthorized, (req, res) => {
        const { permission_id } = req.params
        const { description } = req.body

        app.pg.query(query.permissions.findOne, [permission_id], (err, b) => {
            if (err) {
                logger.error(err, { req: req })
                return res.status(500).json({
                    errorCode: 500,
                    errorMessage: http.STATUS_CODES[500],
                })
            }

            if (b.rows && b.rows[0]) {
                return app.pg.query(query.permissions.update, [permission_id, description], (err) => {
                    if (err) {
                        logger.error(err, { req: req })
                        return res.status(500).json({
                            errorCode: 500,
                            errorMessage: http.STATUS_CODES[500],
                        })
                    }

                    return res.status(201).json(b.rows[0])
                })
            }

            return res.status(200).json({
                errorCode: -1,
                errorMessage: null,
                message: 'permission not found'
            })
        })
    })

    app.delete('/permissions/:permission_id', isAuthenticated(options), isLessThanTwoAuthorized, (req, res) => {
        const { permission_id } = req.params

        app.pg.query(query.permissions.findOne, [permission_id], (err, b) => {
            if (err) {
                logger.error(err, { req: req })
                return res.status(500).json({
                    errorCode: 500,
                    errorMessage: http.STATUS_CODES[500],
                })
            }

            if (b.rows && b.rows[0]) {
                return app.pg.query(query.permissions.delete, [permission_id], (err) => {
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
                        message: 'permission deleted'
                    })
                })
            }

            return res.status(200).json({
                errorCode: -1,
                errorMessage: null,
                message: 'permission not found'
            })
        })
    })

    app.post('/permissions/attach', isAuthenticated(options), isLessThanTwoAuthorized, (req, req) => {
        const { role_id, permission_id } = req.body

        app.pg.query(query.roles.findOne, [role_id, permission_id], (err, b) => {
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
                    errorMessage: 'permission already attached to role'
                })
            }

            return app.pg.query(query.roles.create, [role_id, permission_id, roles[role_id]], (err, b) => {
                if (err) {
                    logger.error(err, { req: req })
                    return res.status(500).json({
                        errorCode: 500,
                        errorMessage: http.STATUS_CODES[500],
                    })
                }

                return res.status(200).json(b.rows[0])
            })
        })
    })

    app.post('/permissions/detach', isAuthenticated(options), isLessThanTwoAuthorized, (req, req) => {
        const { role_id, permission_id } = req.body

        app.pg.query(query.roles.findOne, [role_id, permission_id], (err, b) => {
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
                    errorMessage: 'permission already attached to role'
                })
            }

            return app.pg.query(query.roles.delete, [role_id, permission_id], (err, b) => {
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
                    message: 'permission detached from role successfully'
                })
            })
        })
    })
}
