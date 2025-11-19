import jwt from "jsonwebtoken";
import env from "../../config/env.js";

/**
 * Generates a JSON Web Token (JWT) for a given user ID.
 * The token's expiration is controlled by the JWT_EXPIRES_IN environment variable.
 *
 * @param {number} id The user's ID to embed in the token.
 * @param {string} role The user's role to embed in the token.
 * @returns {string} The generated JWT.
 */
const generateToken = (id, role = "customer") => {
  return jwt.sign({ id, role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

export default generateToken;
