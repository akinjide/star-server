const users = require('./users')
const groups = require('./groups')
const projects = require('./projects')
const rubrics = require('./rubrics')
const rbac = require('./rbac')

const services = (app, options) => {
    users(app, options)
    groups(app, options)
    projects(app, options)
    rubrics(app, options)
    rbac(app, options)

    app.get('/', (req, res) => {
        res.send('OK')
    })
}

module.exports = {
    services
}
