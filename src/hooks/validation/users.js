const Joi = require('joi')
const validation = require('./validation')
const { roles } = require('../policy')

module.exports = {
    login: (req, res, next) => {
        const schema = Joi.object().keys({
            email: Joi.string().email().trim().required(),
            passwd: Joi.string().trim().required(),
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
            full_name: Joi.string().trim().required(),
            title: Joi.string().trim().optional(),
            email: Joi.string().email().trim().required(),
            passwd: Joi.string().trim().required(),
            department: Joi.string().trim().optional(),
            graduation_year: Joi.number().integer().positive().optional(),
            student_number: Joi.number().integer().positive().optional(),
            role_id: Joi.number().integer().valid(...roles.keys()).optional(),
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
