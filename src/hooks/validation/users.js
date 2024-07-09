const Joi = require('joi')
const validation = require('./validation')

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
        // TODO..
    }
}
