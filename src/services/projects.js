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
    app.get('/projects', isAuthenticated(options), isEqualAuthorized, (req, res) => {
        return app.pg.query(query.projects.find, [], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return handleSuccess(req, res, null, b.rows[0])
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
                return handleSuccess(req, res, null, b.rows[0])
            }

            return handleSuccess(req, res, 'project not found')
        })
    })

    app.post('/projects', validation.projects.create, isAuthenticated(options), isEqualAuthorized, (req, res) => {
        const { team_id, topic_id = null, supervisor_id, name, course_code, presentation_at = null, description, started_at = new Date(), ends_at = null, submitted_at = null } = req.body

        return app.pg.query(query.teams.findOne, [team_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && !b.rows[0]) {
                return handleSuccess(req, res, 'team not found')
            }

            app.pg.query(query.projects.findTopicWithSupervisor, [topic_id, supervisor_id], (err, b) => {
                if (err) {
                    return handleError(err, req, res)
                }

                const [row] = b.rows;

                if (!row.topic_id) {
                    return handleSuccess(req, res, 'topic not found')
                }

                if (!row.supervisor_id) {
                    return handleSuccess(req, res, 'supervisor not found')
                }

                if (row.project_id) {
                    if (row.team_id == team_id) {
                        return handleSuccess(req, res, 'topic assigned to same team already')
                    }

                    if (row.team_id != team_id) {
                        return handleSuccess(req, res, 'topic assigned to different team already')
                    }
                }

                if (!row.project_id && row.topic_id) {
                    return app.pg.query(query.projects.create, [team_id, topic_id, supervisor_id, name, course_code, presentation_at, description, started_at, ends_at, submitted_at], (err, b) => {
                        if (err) {
                            return handleError(err, req, res)
                        }

                        return handleSuccess(req, res, null, b.rows[0])
                    })
                }
            })
        })
    })

    app.put('/projects/:project_id', validation.projects.update, isAuthenticated(options), isEqualAuthorized, (req, res) => {
        const { project_id } = req.params

        return app.pg.query(query.projects.findOneForUpdate, [project_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && !b.rows[0]) {
                return handleSuccess(req, res, 'project not found')
            }

            const [row] = b.rows;
            const { supervisor_id, name, course_code, presentation_at, description, started_at, ends_at, submitted_at } = {
                ...row,
                ...req.body
            }

            return app.pg.query(query.projects.update, [supervisor_id, name, course_code, presentation_at, description, started_at, ends_at, submitted_at, new Date(), project_id], (err, b) => {
                if (err) {
                    return handleError(err, req, res)
                }

                return handleSuccess(req, res, 'project updated successfully')
            })
        })
    })

    app.delete('/projects/:project_id', isAuthenticated(options), isEqualAuthorized, (req, res) => {
        const { project_id } = req.params

        return app.pg.query(query.projects.findOneForDelete, [project_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return app.pg.query(query.projects.delete, [project_id], (err, b) => {
                    if (err) {
                        return handleError(err, req, res)
                    }

                    return handleSuccess(req, res, 'project deleted successfully')
                })
            }

            return handleSuccess(req, res, 'project not found')
        })
    })

    app.post('/projects/:project_id/assign', isAuthenticated(options), isEqualAuthorized, (req, res) => {
        const { project_id } = req.params
        const { topic_id } = req.body

        return app.pg.query(query.projects.findOne, [project_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && !b.rows[0]) {
                return handleSuccess(req, res, 'project not found')
            }

            return app.pg.query(query.projects.findTopicWithProject, [topic_id], (err, b) => {
                if (err) {
                    return handleError(err, req, res)
                }

                if (b.rows && b.rows[0]) {
                    return handleSuccess(req, res, 'topic assigned already')
                }

                return app.pg.query(query.projects.assign, [topic_id, new Date(), project_id], (err, b) => {
                    if (err) {
                        return handleError(err, req, res)
                    }

                    return handleSuccess(req, res, 'topic assigned to team project successfully')
                })
            })
        })
    })

    app.get('/tasks', isAuthenticated(options), isEqualAuthorized, (req, res) => {
        return app.pg.query(query.tasks.find, [], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return handleSuccess(req, res, null, b.rows[0])
            }

            return handleSuccess(req, res, 'no tasks')
        })
    })

    app.get('/tasks/:task_id', isAuthenticated(options), isEqualAuthorized, (req, res) => {
        const { task_id } = req.params

        return app.pg.query(query.tasks.findOne, [task_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return handleSuccess(req, res, null, b.rows[0])
            }

            return handleSuccess(req, res, 'task not found')
        })
    })

    app.post('/tasks', isAuthenticated(options), isEqualAuthorized, (req, res) => {
        const { project_id, user_id, team_id, name, description, raw_text, grade, assigned_at, ends_at, submitted_at } = req.body

    })

    app.get('/projects/:project_id/tasks', isAuthenticated(options), isEqualAuthorized, (req, res) => {

    })

    app.get('/projects/:project_id/:team_id', isAuthenticated(options), isEqualAuthorized, (req, res) => {

    })
}
