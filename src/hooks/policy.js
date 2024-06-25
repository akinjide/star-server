const http = require('http')
const passport = require('passport')
const logger = require('../logger')

const roles = [
    'administrator',
    'supervisor',
    'committee_member',
    'student'
]

const isAuthorized = (req, res, next) => {
    const { role = 'student' } = req.user || {}

    if (roles.includes(String(role))) {
        return next()
    }

    next({
        errorCode: 401,
        errorMessage: http.STATUS_CODES[401],
    })
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
    isAuthenticated
}
