const Joi = require('joi')
const validation = require('./validation')

module.exports = {
    upload: (req, res, next) => {
        const schema = Joi.object().keys({
            content_type: Joi.string().trim().required(),
            upload_type: Joi.string().valid('image', 'document').trim().required()
        }).required()

        validation(req.query, schema, (err, ok) => {
            if (!ok) {
                const [{ message }] = err.details

                return next({
                    errorCode: 400,
                    errorMessage: message,
                })
            }

            next()
        })
    },
    delete: (req, res, next) => {
        const schema = Joi.object().keys({
            path: Joi.string().trim().required()
        }).required()

        validation(req.body, schema, (err, ok) => {
            if (!ok) {
                const [{ message }] = err.details

                return next({
                    errorCode: 400,
                    errorMessage: message,
                })
            }

            next()
        })
    }
}
