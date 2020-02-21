const Joi = require('@hapi/joi');

module.exports = {
    validateBody: (schema) => {
        return (req, res, next) => {
            const { error, value } = schema.validate(req.body);

            if(error) {
                return res.status(400).json(error);
            }

            if(!req.value) {
                req.value = {};
            }
            req.value['body'] = value;
            next();
        }
    },
    schemas: {
        authSchema: Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        })
    }
}