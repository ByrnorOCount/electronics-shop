import Joi from 'joi';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError.js';

/**
 * Creates a middleware function that validates the request against a Joi schema.
 * If validation fails, it throws an ApiError that will be caught by the global error handler.
 *
 * @param {Joi.ObjectSchema} schema - The Joi schema to validate against.
 * @returns {function} An Express middleware function.
 */
const validate = (schema) => (req, res, next) => {
    const validSchema = Joi.object(schema);
    const objectToValidate = {
        body: req.body,
        query: req.query,
        params: req.params,
    };

    const { error, value } = validSchema.validate(objectToValidate, {
        abortEarly: false, // Return all errors, not just the first one
        allowUnknown: true, // Allow properties in the object which are not defined in the schema
        stripUnknown: true, // Remove unknown properties from the validated object
    });

    if (error) {
        // Format the Joi error messages into a single string
        const errorMessage = error.details.map((details) => details.message).join(', ');
        return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }

    // Replace req.body, req.query, and req.params with the validated and sanitized values
    Object.assign(req, value);

    // If validation is successful, continue to the next middleware/controller
    return next();
};

export default validate;