const users = require('./users')
const teams = require('./teams')
const projects = require('./projects')
const rubrics = require('./rubrics')
const rbac = require('./rbac')
const topics = require('./topics')
const ai = require('./ai')
const evaluations = require('./evaluations')
const reports = require('./reports')

const services = (app, options) => {
    users(app, options)
    rubrics(app, options)
    projects(app, options)
    rbac(app, options)
    topics(app, options)
    teams(app, options)
    ai(app, options)
    evaluations(app, options)
    reports(app, options)

    app.get('/', (req, res) => {
        res.send('OK')
    })
}

module.exports = {
    services
}
