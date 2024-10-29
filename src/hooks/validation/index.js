const users = require('./users')
const topics = require('./topics')
const teams = require('./teams')
const rbac = require('./rbac')
const projects = require('./projects')
const evaluations = require('./evaluations')
const aws = require('./aws')

module.exports = {
    users,
    rbac,
    teams,
    topics,
    projects,
    evaluations,
    aws
}
