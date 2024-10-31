const bodyParser = require('body-parser')
const compression = require('compression')
const express = require('express')
const passport = require('passport')
const helmet = require('helmet')
const cors = require('cors')
const app = express()

const pg = require('./pg')
const strategy = require('./hooks/passport')
const { services } = require('./services')
const options = {
    passport: {
        session: false,
        failWithError: true,
    },
}

function configure(app, options) {
    app.pg = pg

    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(cors())
    app.use(compression())
    app.use(passport.initialize())
    app.use(helmet())
}

strategy.local()
strategy.jwt()
configure(app, options)
services(app, options)

module.exports = {
    app
}
