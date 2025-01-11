const http = require('http')
const config = require('config')
const fs = require('node:fs');
const passport = require('passport')
const logger = require('../logger')
const {
    isAuthorized,
    isAuthenticated,
    isPermitted,
    isEqualAuthorized,
    roles
} = require('../hooks/policy')
const { handleError, handleSuccess } = require('../hooks/http')

module.exports = (app, options) => {
    app.post('/blob/upload', isAuthenticated(options), isEqualAuthorized, app.upload.single('blob'), (req, res) => {
        const { path, size, filename, mimetype } = req.file
        return handleSuccess(req, res, null, { path, size, filename, mimetype })
    })

    app.delete('/blob/delete', isAuthenticated(options), isEqualAuthorized, (req, res) => {
        const { path } = req.body

        fs.rm(path, { force: true }, (err) => {
            if (err) {
                return handleError(err, req, res)
            }

            return handleSuccess(req, res, 'file removed', { path })
        })
    })
}
