const users = require('./users')
const topics = require('./topics')
const teams = require('./teams')
const rbac = require('./rbac')
const projects = require('./projects')
const evaluations = require('./evaluations')

module.exports = {
    users,
    rbac,
    teams,
    topics,
    projects,
    evaluations,
}
