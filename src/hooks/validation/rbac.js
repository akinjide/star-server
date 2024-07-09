const Joi = require('joi')
const validation = require('./validation')

module.exports = {
    replace: (req, res, next) => {
        const schema = Joi.object().keys({
            role_id: Joi.string().trim().required(),
            user_id: Joi.string().trim().required(),
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
            description: Joi.string().trim().required(),
            slug: Joi.string().trim().required(),
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
            description: Joi.string().trim().required(),
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
            role_id: Joi.string().trim().required(),
            permission_id: Joi.string().trim().required(),
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
