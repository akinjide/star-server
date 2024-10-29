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

const isPermitted = (pg) => {
    return (req, res, next) => {
        const sql = `
            SELECT
                role_permissions.role_id,
                permissions.slug AS permission_slug
            FROM role_permissions
            LEFT JOIN permissions ON role_permissions.permission_id = permissions.id
            WHERE role_permissions.role_id = $1;
        `

        const { role_id = 0, permissions } = req.user || {}

        return pg.query(sql, [role_id], (err, b) => {
            if (err) {
                logger.error(err, { req: req })

                next({
                    errorCode: 403,
                    errorMessage: http.STATUS_CODES[403],
                })
            }

            for (const row of b.rows) {
                const { permission_slug } = row

                if (permissions.includes(permission_slug)) {
                    return next();
                }
            }

            next({
                errorCode: 403,
                errorMessage: http.STATUS_CODES[403],
            })
        })
    }
}

const isAuthorized = (guard = []) => {
    return (req, res, next) => {
        const { role_id = 0 } = req.user || {}

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

const isLessThanTwoAuthorized = isAuthorized([
    roles[1]
])

const isLessThanThreeAuthorized = isAuthorized([
    roles[1],
    roles[2]
])

const isLessThanFourAuthorized = isAuthorized([
    roles[1],
    roles[2],
    roles[3]
])

const isEqualAuthorized = isAuthorized([
    roles[1],
    roles[2],
    roles[3],
    roles[4]
])

module.exports = {
    isAuthorized,
    isAuthenticated,
    isPermitted,

    isLessThanTwoAuthorized,
    isLessThanThreeAuthorized,
    isLessThanFourAuthorized,
    isEqualAuthorized,
    roles
}
