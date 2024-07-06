module.exports = (app, options) => {
    app.get('/topics')
    app.get('/topics/:topic_id')
    app.put('/topics/:topic_id')
    app.delete('/topics/:topic_id')
    app.post('/topics')

}
