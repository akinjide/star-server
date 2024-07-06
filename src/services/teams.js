module.exports = (app, options) => {
    app.get('/teams')
    app.get('/teams/:team_id')
    app.put('/teams/:team_id')
    app.delete('/teams/:team_id')
    app.post('/teams')

    app.get('/teams/:team_id/members')
    app.post('/teams/:team_id/members')
    app.delete('/teams/:team_id/members')
}
