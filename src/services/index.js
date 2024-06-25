const users = require('./users')

const services = (app, options) => {
    users(app, options)

    app.get('/', (req, res) => {
        res.send('OK')
    })
}

module.exports = {
    services
}
