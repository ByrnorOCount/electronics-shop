import jwt from "jsonwebtoken";

/**
 * Generates a JSON Web Token (JWT) for a given user ID.
 * The token's expiration is controlled by the JWT_EXPIRES_IN environment variable.
 *
 * @param {number} id The user's ID to embed in the token.
 * @param {string} role The user's role to embed in the token.
 * @returns {string} The generated JWT.
 */
const generateToken = (id, role = "customer") => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export default generateToken;
