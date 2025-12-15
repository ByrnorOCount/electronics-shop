import httpStatus from "http-status";
import bcrypt from "bcrypt";
import * as authModel from "./auth.model.js";
import ApiError from "../../core/utils/ApiError.js";
import generateToken from "../../core/utils/generateToken.js";

/**
 * Generates a token and returns the user object without the password hash.
 * @param {object} user - The user object.
 * @returns {{user: object, token: string}}
 */
const generateAuthTokens = (user) => {
  const token = generateToken(user.id, user.role);
  // Omit password from the returned user object
  const { password_hash: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

/**
 * Register a new user
 * @param {object} userData
 * @returns {Promise<object>}
 */
const register = async (userData) => {
  if (await authModel.findByEmail(userData.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = await authModel.create({
    ...userData,
    password_hash: hashedPassword,
    role: "customer", // Assign default role
  });

  // In a real app, you would send a verification email here.

  return newUser;
};

/**
 * Login a user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user: object, token: string}>}
 */
const login = async (email, password) => {
  const user = await authModel.findByEmail(email);

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }

  // Explicitly check for password hash. If it doesn't exist, this is a social-only account.
  if (!user.password_hash) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }

  return generateAuthTokens(user);
};

/**
 * Handle social login/registration
 * @param {object} user - The user object provided by Passport.js after authentication.
 * @returns {Promise<{user: object, token: string}>}
 */
const handleSocialLogin = async (user) => {
  // Passport's `findOrCreateUser` has already found or created the user.
  // All we need to do here is generate the authentication tokens for that user.
  return generateAuthTokens(user);
};

export { register, login, handleSocialLogin };
