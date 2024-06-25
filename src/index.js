const http = require('http')
const { app } = require('./app')
const logger = require('./logger')

process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection %O', reason)
})

// Handle 404
app.use((req, res, next) => {
    next({
        errorCode: 404,
        errorMessage: `${req.url}: Not Found`,
    })
});

// Handle 5XX
app.use((err, req, res, next) => {
    if (err) {
        logger.error(err, { req: req })

        if (err.errorCode) {
            return res.status(err.errorCode).json(err)
        }

        return res.status(500).json(err)
    }

    res.status(503).json({
        message: http.STATUS_CODES[503],
        error: 'service currently unavailable, try later.',
    })
});

app.listen('3000', () => {
    logger.info('app listening on http://127.0.0.1:3000')
})
