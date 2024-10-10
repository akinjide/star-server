const Joi = require('joi')
const validation = require('./validation')

module.exports = {
    create: (req, res, next) => {
        const schema = Joi.object().keys({
            name: Joi.string().trim().required(),
            description: Joi.string().trim().required(),
            image: Joi.string().trim().required()
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
