const http = require('http')
const logger = require('../logger')

const handleError = (err, req, res, errMessage, errCode = 500) => {
    if (err) {
        logger.error(err, { req: req })
    }

    const message = http.STATUS_CODES[errCode]

    return res.status(errCode).json({
        errorCode: errCode,
        errorMessage: errMessage || message,
    })
}

const handleSuccess = (req, res, resMessage, data = null, resCode = 200) => {
    logger.info(resMessage, { req: req })

    return res.status(resCode).json({
        errorCode: -1,
        errorMessage: null,
        message: resMessage || http.STATUS_CODES[resCode],
        data: data
    })
}

module.exports = {
    handleError,
    handleSuccess
}
