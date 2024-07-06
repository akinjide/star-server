const http = require('http')
const query = require('../query')
const logger = require('../logger')
const { isAuthorized, isAuthenticated } = require('../hooks/policy')

module.exports = (app, options) => {
    app.post('/roles')
    app.get('/roles')
    app.get('/roles/:role_id')
    app.get('/roles/:role_id')
    app.delete('/roles/:role_id')
    app.post('/roles/attach')
    app.post('/roles/detach')


    app.post('/permissions', isAuthenticated(options), isAuthorized, (req, res) => {
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

    app.get('/permissions', isAuthenticated(options), isAuthorized, (req, res) => {
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

    app.get('/permissions/:permission_id', isAuthenticated(options), isAuthorized, (req, res) => {
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

    app.put('/permissions/:permission_id')
    app.delete('/permissions/:permission_id')

    app.post('/permissions/attach', isAuthenticated(options), isAuthorized, (req, req) => {
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

            return app.pg.query(query.roles.create, [role_id, permission_id, 'TODO=slug'], (err, b) => {
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

    app.post('/permissions/detach', isAuthenticated(options), isAuthorized, (req, req) => {
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

            return app.pg.query(query.roles.remove, [role_id, permission_id], (err, b) => {
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
