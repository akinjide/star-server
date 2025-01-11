const bodyParser = require('body-parser')
const compression = require('compression')
const express = require('express')
const passport = require('passport')
const helmet = require('helmet')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const uuid = require('uuid')
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

const fileFormat = (file) => {
    let ext = 'jpg'

    if (file.originalname) {
        const parts = file.originalname.split('.')
        ext = parts[parts.length - 1]
    }

    return ext
}

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const { upload_type } = req.query

    callback(null, 'uploads/' + upload_type + '/')
  },
  filename: function (req, file, callback) {
    const { id } = req.user
    const uniqueSuffix = Date.now() + '-' + uuid.v4()
    const ext = fileFormat(file)

    callback(null, id + '-' + uniqueSuffix + '.' + ext)
  }
})

function configure(app, options) {
    app.pg = pg
    app.upload = multer({ storage: storage })

    app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(cors())
    app.use(compression())
    app.use(passport.initialize())
    app.use(helmet({
        crossOriginResourcePolicy: false,
        xPoweredBy: false,
    }))
}

strategy.local()
strategy.jwt()
configure(app, options)
services(app, options)

module.exports = {
    app
}
