const http = require('http')
const config = require('config')
const passport = require('passport')
const passportLocal = require('passport-local')
const passportJWT = require('passport-jwt')
const query = require('../query')
const logger = require('../logger')
const { comparePassword, decode, getActiveKey } = require('./token')

const local = () => {
    const LocalStrategy = passportLocal.Strategy
    const options = {
        usernameField: 'email',
        passwordField: 'passwd',
        passReqToCallback: true,
        session: false,
    }

    const strategy = new LocalStrategy(options, (req, email, passwd, done) => {
        return req.app.pg.query(query.auth.find, [email], (err, b) => {
            if (err) {
                logger.error(err, { req: req })
                return done({
                    errorCode: 500,
                    errorMessage: http.STATUS_CODES[500],
                }, false)
            }

            if (b.rows && b.rows[0]) {
                const [{
                    first_name,
                    last_name,
                    password,
                    id,
                    email
                }] = b.rows

                if (!password) {
                    return done({
                        errorCode: 400,
                        errorMessage: 'invalid email or password',
                    }, false)
                }

                return comparePassword(passwd, password, (err, ok) => {
                    if (err) {
                        logger.error(err, { req: req })
                        return done(httpErr.serverError(), false)
                    }

                    if (!ok) {
                        return done({
                            errorCode: 400,
                            errorMessage: 'invalid email or password',
                        }, false)
                    }

                    return done(null, {
                        first_name,
                        last_name,
                        id,
                        email
                    })
                })
            }

            return done({
                errorCode: 400,
                errorMessage: 'invalid email or password',
            }, false)
        })
    })

    passport.use(strategy)
}


const jwt = () => {
    const jwtcfg = config.get('jwt')
    const extractJWT = passportJWT.ExtractJwt
    const JWTStrategy = passportJWT.Strategy
    const jwtOptions = {
        jwtFromRequest: extractJWT.fromExtractors([
            extractJWT.fromHeader('token'),
            extractJWT.fromAuthHeaderAsBearerToken(),
            extractJWT.fromBodyField('accessToken'),
            extractJWT.fromUrlQueryParameter('accessToken'),
            // Unauthorized will respond with 401
            // If this extractor runs we can conclude no bearer token provider
            // Set header below for consumers.
            (req) => {
                req.res.set('WWW-Authenticate', 'Bearer')
                return null
            },
        ]),
        // secretOrKeyProvider is a callback in the format function secretOrKeyProvider(request, rawJwtToken, done)
        // which should call done with a secret or PEM-encoded public key (asymmetric) for the given key and request combination.
        // done accepts arguments in the format function done(err, secret).
        // Note it is up to the implementer to decode rawJwtToken. REQUIRED unless secretOrKey is provided.
        secretOrKeyProvider: (req, rawJwtToken, done) => {
            const p = decode(rawJwtToken)

            if (p) {
                const { header } = p
                return getActiveKey(header, done)
            }

            return done('invalid or expired token')
        },
        jsonWebTokenOptions: {
            issuer: jwtcfg.issuer,
            audience: jwtcfg.audience,
            algorithms: ['HS256'],
            complete: false,
        },
        passReqToCallback: true,
    }

    const strategy = new JWTStrategy(jwtOptions, (req, t, done) => {
        req.app.pg.query(query.auth.find, [t.email], (err, b) => {
            if (err) {
                logger.error(err, { req: req })
                return done({
                    errorCode: 500,
                    errorMessage: http.STATUS_CODES[500],
                }, false)
            }

            if (b.rows && b.rows[0]) {
                const [{
                    first_name,
                    last_name,
                    id,
                    email
                }] = b.rows

                return done(null, {
                    first_name,
                    last_name,
                    id,
                    email
                })
            }

            return done({
                errorCode: 401,
                errorMessage: 'invalid or expired token',
            }, false)
        })
    })

    passport.use(strategy)
}

module.exports = {
    local,
    jwt
}
