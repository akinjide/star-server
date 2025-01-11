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
    app.get('/reports', isAuthenticated(options), isEqualAuthorized, (req, res) => {
        return app.pg.query(query.reports.find, [], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return handleSuccess(req, res, null, b.rows)
            }

            return handleSuccess(req, res, 'no reports')
        })
    })

    app.get('/reports/:report_id', isAuthenticated(options), isEqualAuthorized, (req, res) => {
        const { report_id } = req.params

        return app.pg.query(query.reports.findOne, [report_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return handleSuccess(req, res, null, b.rows[0])
            }

            return handleSuccess(req, res, 'report not found')
        })
    })

    app.delete('/reports/:report_id', isAuthenticated(options), isEqualAuthorized, (req, res) => {
        const { report_id } = req.params

        return app.pg.query(query.reports.deleteOne, [report_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return handleSuccess(req, res, null, b.rows[0])
            }

            return handleSuccess(req, res, 'report not found')
        })
    })

    app.get('/reports/projects/:project_id', isAuthenticated(options), isEqualAuthorized, (req, res) => {
        const { project_id } = req.params

        return app.pg.query(query.reports.findWithProject, [project_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return handleSuccess(req, res, null, b.rows)
            }

            return handleSuccess(req, res, 'project reports not found')
        })
    })

    app.post('/reports', isAuthenticated(options), isEqualAuthorized, (req, res) => {
        const { project_id, name, url, raw_text, version = 1 } = req.body

        return app.pg.query(query.reports.findWithProject, [project_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                for (const row of b.rows) {
                    if (row.report_name !== 'Progress Report' && name === row.report_name) {
                        return handleSuccess(req, res, 'report exist already')
                    }
                }
            }

            return app.pg.query(query.reports.create, [name, url, raw_text, version, project_id], (err, b) => {
                if (err) {
                    return handleError(err, req, res)
                }

                return handleSuccess(req, res, null, b.rows[0])
            })
        })
    })

    app.put('/reports/:report_id', isAuthenticated(options), isEqualAuthorized, (req, res) => {
        const { report_id } = req.params

        return app.pg.query(query.reports.findOneForUpdate, [report_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && !b.rows[0]) {
                return handleSuccess(req, res, 'report not found')
            }

            const [ row ] = b.rows;
            const { name, raw_text, url, comment } = {
                ...row,
                ...req.body
            }

            return app.pg.query(query.reports.update, [name, raw_text, comment, url, report_id], (err, b) => {
                if (err) {
                    return handleError(err, req, res)
                }

                return handleSuccess(req, res, 'report updated successfully')
            })
        })
    })
}
