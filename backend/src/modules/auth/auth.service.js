import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import * as authModel from './auth.model.js';
import ApiError from '../../core/utils/ApiError.js';
import generateToken from '../../core/utils/generateToken.js';

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
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = await authModel.create({
    ...userData,
    password_hash: hashedPassword,
    role: 'customer', // Assign default role
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
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }

  // Explicitly check for password hash. If it doesn't exist, this is a social-only account.
  if (!user.password_hash) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }

  return generateAuthTokens(user);
};

/**
 * Handle social login/registration
 * @param {object} profile - Profile information from OAuth provider
 * @returns {Promise<{user: object, token: string}>}
 */
const handleSocialLogin = async (profile) => {
  let user = await authModel.findByProvider(profile.provider, profile.id);

  if (!user) {
    // If user with this provider doesn't exist, check by email
    user = await authModel.findByEmail(profile.emails[0].value);

    if (!user) {
      // If no user found, create a new one
      user = await authModel.create({
        email: profile.emails[0].value,
        first_name: profile.name.givenName,
        last_name: profile.name.familyName,
        provider: profile.provider,
        provider_id: profile.id,
        is_verified: true, // Social logins are considered verified
        role: 'customer', // Assign default role
      });
    } else if (!user.provider || !user.provider_id) {
      // If user exists but is not linked to a social provider, update them
      user = await authModel.update(user.id, {
        provider: profile.provider,
        provider_id: profile.id,
        is_verified: true, // Mark as verified if they login via social
      });
    }
  }

  return generateAuthTokens(user);
};

export { register, login, handleSocialLogin };
