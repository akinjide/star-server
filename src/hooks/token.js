const jwt = require('jsonwebtoken')
const config = require('config')
const uuid = require('uuid')
const bcrypt = require('bcryptjs')
const logger = require('../logger')

const create = (user) => {
    const jwtcfg = config.get('jwt')
    const jwkscfg = config.get('jwks')
    const options = {
        algorithm: 'HS256',
        audience: jwtcfg.audience,
        issuer: jwtcfg.issuer,
        expiresIn: jwkscfg.ttl,
        jwtid: uuid.v4(),
        subject: user.id.toString(),
        keyid: jwkscfg.keyId,
    }

    return jwt.sign({ ...user, iat: Date.now() }, jwkscfg.keyValue, options)
}

const getActiveKey = (header, callback) => {
    const kid = config.get('jwks.keyId')

    if (header.kid && header.kid == kid) {
        return callback(null, config.get('jwks.keyValue'))
    }

    callback(new Error('token key ID not defined'))
}

const verify = (token, callback) => {
    const jwtcfg = config.get('jwt')
    const options = {
        algorithms: ['HS256'],
        audience: jwtcfg.audience,
        issuer: jwtcfg.issuer,
        complete: true,
    }

    jwt.verify(token, getActiveKey, options, callback)
}

const decode = (token) => {
    return jwt.decode(token, { complete: true })
}

const comparePassword = (p, hash, callback) => {
    bcrypt.compare(p, hash, callback)
}

const encryptPassword = (p, callback) => {
    bcrypt.genSalt(10, (error, salt) => {
        if (error) {
            return callback(error)
        }

        bcrypt.hash(p, salt, (hashError, hash) => {
            callback(hashError, {
                salt,
                hash
            })
        })
    })
}

module.exports = {
    getActiveKey,
    create,
    verify,
    decode,
    comparePassword,
    encryptPassword
}
