const http = require('http')
const passport = require('passport')
const logger = require('../logger')

const ADMINISTRATOR = 'administrator'
const SUPERVISOR = 'supervisor'
const COMMITTEE_MEMBER = 'committee_member'
const STUDENT = 'student'

const roles = {
    1: ADMINISTRATOR,
    2: SUPERVISOR,
    3: COMMITTEE_MEMBER,
    4: STUDENT
}

const isAuthorized = (guard = []) => {
    return (req, res, next) => {
        const { role_id = 4 } = req.user || {}

        if (Object.keys(roles).includes(role_id.toString())) {
            if (guard.length == 0 || (guard.length > 0 && guard.includes(roles[role_id]))) {
                return next()
            }
        }

        next({
            errorCode: 401,
            errorMessage: http.STATUS_CODES[401],
        })
    }
}

const isAuthenticated = (options) => {
    return (req, res, next) => {
        passport.authenticate('jwt', options, (err, user, info) => {
            if (err || info) {
                if (info) {
                    logger.error(info, { req: req })

                    if (info.name == 'JsonWebTokenError') {
                        return next({
                            errorCode: 401,
                            errorMessage: 'invalid auth token',
                        })
                    }

                    return next({
                        errorCode: 401,
                        errorMessage: info.message
                    })
                }

                logger.error(err, { req: req })
                return next(err)
            }

            req.user = user
            next()
        })(req, res, next)
    }
}


module.exports = {
    isAuthorized,
    isAuthenticated,
    roles
}
