const Joi = require('joi')
const validation = require('./validation')

module.exports = {
    create: (req, res, next) => {
        const schema = Joi.object().keys({
            project_id: Joi.number().integer().positive().required(),
            evaluator_id: Joi.number().integer().positive().required(),
            evaluation: Joi.array().items(
                Joi.object().keys({
                    rubric_id: Joi.number().integer().positive().required(),
                    name: Joi.string().trim().optional(),
                    score: Joi.number().integer().positive().required()
                }).required()
            ).min(1).required(),
            originality: Joi.number().integer().positive().optional()
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

    }
}
