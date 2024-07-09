const http = require('http')
const passport = require('passport')
const query = require('../query')
const logger = require('../logger')
const { isAuthorized, isAuthenticated, roles } = require('../hooks/policy')
const { encryptPassword, create } = require('../hooks/token')
const { handleError, handleSuccess } = require('../hooks/http')
const validation = require('../hooks/validation')

module.exports = (app, options) => {
    const isLessThanThreeAuthorized = isAuthorized([
        roles[1],
        roles[2]
    ])

    const isEqualAuthorized = isAuthorized([
        roles[1],
        roles[2],
        roles[3],
        roles[4]
    ])

    app.get('/projects', isAuthenticated(options), isEqualAuthorized, (req, res) => {
        return app.pg.query(query.projects.find, [], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return res.status(200).json(b.rows[0])
            }

            return handleSuccess(req, res, 'no projects')
        })
    })

    app.get('/projects/:project_id', isAuthenticated(options), isEqualAuthorized, (req, res) => {
        const { project_id } = req.params

        return app.pg.query(query.projects.findOne, [project_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return res.status(200).json(b.rows[0])
            }

            return handleSuccess(req, res, 'project not found')
        })
    })

    app.put('/projects/:project_id')
    app.delete('/projects/:project_id')
    app.post('/projects')
    app.post('/projects/:project_id/assign')

    app.get('/tasks')
    app.post('/tasks')
    app.get('/tasks/:task_id')
    app.get('/projects/:project_id/tasks')
    app.get('/projects/:project_id/:team_id')
}
