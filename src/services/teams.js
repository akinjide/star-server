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

    app.get('/teams', isAuthenticated(options), isEqualAuthorized, (req, res) => {
        return app.pg.query(query.teams.find, [], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return res.status(200).json(b.rows[0])
            }

            return handleSuccess(req, res, 'no teams')
        })
    })

    app.get('/teams/:team_id', isAuthenticated(options), isEqualAuthorized, (req, res) => {
        const { team_id } = req.params

        return app.pg.query(query.teams.findOne, [team_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return res.status(200).json(b.rows[0])
            }

            return handleSuccess(req, res, 'team not found')
        })
    })

    app.post('/teams', validation.teams.create, isAuthenticated(options), isEqualAuthorized, (req, res) => {
        const { name, description, image } = req.body

        return app.pg.query(query.teams.findByName, [name], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return handleSuccess(req, res, 'team name already exist')
            }

            return app.pg.query(query.teams.create, [name, description, image], (err, b) => {
                if (err) {
                    return handleError(err, req, res)
                }

                return res.status(200).json(b.rows[0])
            })
        })
    })

    app.put('/teams/:team_id', (req, res) => {
        const { team_id } = req.params

        return app.pg.query(query.teams.findOne, [team_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                const { name, description, image } = {
                    ...b.rows[0],
                    ...req.body
                }

                return app.pg.query(query.teams.update, [name, description, image, Date.now(), team_id], (err, b) => {
                    if (err) {
                        return handleError(err, req, res)
                    }

                    return res.status(200).json(b.rows[0])
                })
            }

            return handleSuccess(req, res, 'team not found')
        })
    })

    app.delete('/teams/:team_id', isAuthenticated(options), isEqualAuthorized, (req, res) => {
        const { team_id } = req.params

        return app.pg.query(query.teams.findOne, [team_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return app.pg.query(query.teams.deleteOne, [team_id], (err) => {
                    if (err) {
                        return handleError(err, req, res)
                    }

                    return handleSuccess(req, res, 'team deleted')
                })
            }

            return handleSuccess(req, res, 'team not found')
        })
    })

    app.get('/teams/:team_id/members/:member_id', isAuthenticated(options), isEqualAuthorized, (req, res) => {
        const { team_id, member_id } = req.params

        return app.pg.query(query.teams.findMember, [team_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return handleSuccess(req, res, null, b.rows[0])
            }

            return handleSuccess(req, res, 'member not found')
        })
    })

    app.get('/teams/:team_id/members', isAuthenticated(options), isEqualAuthorized, (req, res) => {
        const { team_id } = req.params

        return app.pg.query(query.teams.findMembers, [team_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return res.status(200).json(b.rows[0])
            }

            return handleSuccess(req, res, 'team not found')
        })
    })

    app.put('/teams/:team_id/members', isAuthenticated(options), isEqualAuthorized, (req, res) => {
        const { team_id } = req.params

        return app.pg.query(query.teams.findOne, [team_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                const { member_id, is_lead = false } = req.body

                return app.pg.query(query.teams.findMember, [member_id, team_id], (err, b) => {
                    if (err) {
                        return handleError(err, req, res)
                    }

                    if (b.rows && b.rows[0]) {
                        return handleSuccess(req, res, 'member already associated with team')
                    }

                    return app.pg.query(query.teams.createMember, [team_id, member_id, is_lead], (err, b) => {
                        if (err) {
                            return handleError(err, req, res)
                        }

                        return res.status(200).json(b.rows[0])
                    })
                })
            }

            return handleSuccess(req, res, 'team not found')
        })
    })

    app.delete('/teams/:team_id/members/:member_id', isAuthenticated(options), isEqualAuthorized, (req, res) => {
        const { team_id, member_id } = req.params

        return app.pg.query(query.teams.findOne, [team_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return app.pg.query(query.teams.findMember, [member_id, team_id], (err, b) => {
                    if (err) {
                        return handleError(err, req, res)
                    }

                    if (b.rows && b.rows[0]) {
                        return app.pg.query(query.teams.removeMember, [team_id, member_id], (err) => {
                            if (err) {
                                return handleError(err, req, res)
                            }

                            return handleSuccess(req, res, 'team member deleted')
                        })
                    }

                    return handleSuccess(req, res, 'member not found')
                })
            }

            return handleSuccess(req, res, 'team not found')
        })
    })
}
