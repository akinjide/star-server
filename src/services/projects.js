module.exports = (app, options) => {
    app.get('/projects')
    app.get('/projects/:project_id')
    app.put('/projects/:project_id')
    app.delete('/projects/:project_id')
    app.post('/projects')
    app.post('/projects/:project_id/assign')

    app.get('/tasks')
    app.post('/tasks')
    app.get('/tasks/:task_id')
    app.get('/projects/:project_id/tasks')
    app.get('/projects/:project_id/:team_id')
}
