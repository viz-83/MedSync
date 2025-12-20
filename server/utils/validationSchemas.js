const Joi = require('joi');

const schemas = {
    signup: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        role: Joi.string().valid('patient', 'doctor').default('patient')
    }),
    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),
    metric: Joi.object({
        metricType: Joi.string().valid('GLUCOSE', 'BLOOD_PRESSURE', 'WEIGHT', 'HEART_RATE').required(),
        value: Joi.alternatives().try(Joi.number(), Joi.object()).required(),
        note: Joi.string().allow('', null)
    })
};

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        next();
    };
};

module.exports = { schemas, validate };
