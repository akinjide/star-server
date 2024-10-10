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

    app.post('/projects', (req, res) => {
        // check team exist
        // check topic exist and not assigned previously
        // check supervisor exist
        // create project
        const { team_id, topic_id, supervisor_id, name, course_code, presentation_at = null, description, started_at = new Date(), ends_at = null, submitted_at = null } = req.body

        app.pg.query(query.teams.findOne, [team_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && !b.rows[0]) {
                return handleSuccess(req, res, 'team not found')
            }

            const sql = `
                SELECT
                    topics.id AS topic_id,
                    topics.name AS topic_name,
                    topics.supervisor_id AS topic_supervisor_id,
                    projects.id AS project_id,
                    projects.team_id AS project_team_id,
                    projects.topic_id AS project_topic_id,
                    projects.supervisor_id AS project_supervisor_id,
                    projects.name AS project_name,
                    users.id AS supervisor_id
                FROM topics
                LEFT JOIN projects ON projects.topic_id = topics.id
                LEFT JOIN users ON users.id = topics.supervisor_id
                WHERE topics.id = $1
                AND topics.supervisor_id = $2;
            `

            app.pg.query(sql, [topic_id, supervisor_id], (err, b) => {
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
                    const sql = `
                        INSERT INTO projects (
                            team_id,
                            topic_id,
                            supervisor_id,
                            name,
                            course_code,
                            presentation_at,
                            description,
                            started_at,
                            ends_at,
                            submitted_at
                        ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                        RETURNING *;
                    `

                    return app.pg.query(sql, [team_id, topic_id, supervisor_id, name, course_code, presentation_at, description, started_at, ends_at, submitted_at], (err, b) => {
                        if (err) {
                            return handleError(err, req, res)
                        }

                        return res.status(200).json(b.rows[0])
                    })
                }
            })
        })
    })

    app.put('/projects/:project_id')
    app.delete('/projects/:project_id')
    app.post('/projects/:project_id/assign')

    app.get('/tasks', isAuthenticated(options), isEqualAuthorized, (req, res) => {
        return app.pg.query(query.tasks.find, [], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return res.status(200).json(b.rows[0])
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
                return res.status(200).json(b.rows[0])
            }

            return handleSuccess(req, res, 'task not found')
        })
    })

    app.post('/tasks')

    app.get('/projects/:project_id/tasks')
    app.get('/projects/:project_id/:team_id')
}
