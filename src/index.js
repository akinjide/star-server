const { app } = require('app')
const logger = require('logger')

process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection %O', reason)
})

app.listen('3000', {
    logger.info('app listening on http://127.0.0.1:3000')
})
