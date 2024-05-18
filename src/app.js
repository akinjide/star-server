const bodyParser = require('body-parser')
const compression = require('compression')
const express = require('express')
const app = express()

const pg = require('./pg')
const { services } = require('./services')

function configure(app) {
    app.pg = pg

    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(compression())
}

configure(app)
services(app)

module.exports = {
    app
}
