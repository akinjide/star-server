const users = require('./users')
const teams = require('./teams')
const projects = require('./projects')
const rubrics = require('./rubrics')
const rbac = require('./rbac')
const topics = require('./topics')

const services = (app, options) => {
    users(app, options)
    groups(app, options)
    projects(app, options)
    rubrics(app, options)
    rbac(app, options)
    topics(app, options)

    app.get('/', (req, res) => {
        res.send('OK')
    })
}

module.exports = {
    services
}
