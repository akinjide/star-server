const Joi = require('joi')
const validation = require('./validation')

module.exports = {
    create: (req, res, next) => {
        const schema = Joi.object().keys({
            name: Joi.string().max(100).trim().required(),
            description: Joi.string().max(400).trim().required(),
            image: Joi.string().uri().trim().optional()
        }).unknown(true).required()

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
            description: Joi.string().max(400).trim().optional()
        }).unknown(true)

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
    updateMember: (req, res, next) => {
        const schema = Joi.object().keys({
            member_id: Joi.number().integer().positive().min(1).required(),
            is_lead: Joi.boolean().optional()
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
