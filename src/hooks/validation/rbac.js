const Joi = require('joi')
const validation = require('./validation')

module.exports = {
    replace: (req, res, next) => {
        const schema = Joi.object().keys({
            role_id: Joi.number().integer().positive().required(),
            user_id: Joi.number().integer().positive().required()
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
    create: (req, res, next) => {
        const schema = Joi.object().keys({
            description: Joi.string().max(400).trim().required(),
            slug: Joi.string().max(50).trim().required()
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
            description: Joi.string().max(400).trim().required()
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
    attachOrDetach: (req, res, next) => {
        const schema = Joi.object().keys({
            role_id: Joi.number().integer().positive().required(),
            permission_id: Joi.number().integer().positive().required()
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
}
