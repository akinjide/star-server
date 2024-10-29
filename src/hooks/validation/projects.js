const Joi = require('joi')
const validation = require('./validation')

module.exports = {
    create: (req, res, next) => {
        const schema = Joi.object().keys({
            team_id: Joi.number().integer().positive().required(),
            topic_id: Joi.number().integer().positive().required(),
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

}
