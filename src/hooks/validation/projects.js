const Joi = require('joi')
const validation = require('./validation')

module.exports = {
    create: (req, res, next) => {
        const schema = Joi.object().keys({
            team_id: Joi.number().integer().positive().required(),
            topic_id: Joi.number().integer().positive().optional(),
            supervisor_id: Joi.number().integer().positive().required(),
            name: Joi.string().max(100).trim().required(),
            course_code: Joi.string().max(8).trim().required(),
            presentation_at: Joi.date().iso().optional(),
            description: Joi.string().max(400).trim().required(),
            started_at: Joi.date().iso().optional(),
            ends_at: Joi.date().iso().optional(),
            submitted_at: Joi.date().iso().optional(),
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
            supervisor_id: Joi.number().integer().positive().optional(),
            name: Joi.string().max(100).trim().optional(),
            course_code: Joi.string().max(8).trim().optional(),
            presentation_at: Joi.date().iso().optional(),
            description: Joi.string().max(400).trim().optional(),
            started_at: Joi.date().iso().optional(),
            ends_at: Joi.date().iso().optional(),
            submitted_at: Joi.date().iso().optional(),
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
    assign: (req, res, next) => {
        const schema = Joi.object().keys({
            topic_id: Joi.number().integer().positive().required()
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
