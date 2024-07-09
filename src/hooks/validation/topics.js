const Joi = require('joi')
const validation = require('./validation')

module.exports = {
    create: (req, res, next) => {
        const schema = Joi.object().keys({
            supervisor_id: Joi.string().trim().required(),
            name: Joi.string().max(100).trim().required(),
            description: Joi.string().max(400).trim().optional(),
            raw_text: Joi.string().trim().optional(),
            url: Joi.string().uri().trim().optional(),
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
    },
    update: (req, res, next) => {
        const schema = Joi.object().keys({
            name: Joi.string().max(100).trim().optional(),
            description: Joi.string().max(400).trim().optional(),
            raw_text: Joi.string().trim().optional(),
            url: Joi.string().uri().trim().optional(),
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
    },
    delete: (req, res, next) => {
        const schema = Joi.object().keys({
            supervisor_id: Joi.string().trim().required(),
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
