const http = require('http')
const { app } = require('./app')
const logger = require('./logger')

process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection %O', reason)
})

// Handle 404
app.use((req, res, next) => {
    next({
        message: http.STATUS_CODES[404],
        error: `${req.url}: Not Found`,
    })
});

// Handle 5XX
app.use((err, req, res, next) => {
    if (err) {
        logger.debug(err, { req: req })
        return res.json(err)
    }

    res.status(503).json({
        message: http.STATUS_CODES[503],
        error: 'service currently unavailable, try later.',
    })
});

app.listen('3000', () => {
    logger.info('app listening on http://127.0.0.1:3000')
})
