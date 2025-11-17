import Joi from "joi";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError.js";
import { pick } from "lodash-es";

/**
 * Creates a middleware function that validates the request against a Joi schema.
 * If validation fails, it throws an ApiError that will be caught by the global error handler.
 *
 * @param {object} schema - An object containing Joi schemas for 'body', 'query', or 'params'.
 * @returns {function} An Express middleware function.
 */
const validate = (schema) => (req, res, next) => {
  try {
    // 1. Pick only the 'body', 'query', 'params' keys from the provided schema object.
    const validSchema = pick(schema, ["params", "query", "body"]);
    // 2. Pick the corresponding properties from the 'req' object.
    const objectToValidate = pick(req, Object.keys(validSchema));

    // 3. Compile and validate.
    const { value, error } = Joi.compile(validSchema)
      .prefs({ errors: { label: "key" }, abortEarly: false })
      .validate(objectToValidate);

    if (error) {
      const errorMessage = error.details
        .map((details) => details.message)
        .join(", ");
      return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }

    // Assign the validated (and potentially sanitized) values back to the request object.
    Object.assign(req, value);

    return next();
  } catch (err) {
    // Catch any unexpected errors during validation and pass to the global error handler.
    return next(
      new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "An unexpected error occurred during input validation."
      )
    );
  }
};

export default validate;
