import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import * as authModel from './auth.model.js';
import ApiError from '../../core/utils/ApiError.js';
import generateToken from '../../core/utils/generateToken.js';

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
  if (!user || !user.password_hash || !(await bcrypt.compare(password, user.password_hash))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }

  const token = generateToken(user.id, user.role);

  // Omit password from the returned user object
  const { password_hash: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
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
      });
    }
  }

  const token = generateToken(user.id, user.role);
  return { user, token };
};

export default { register, login, handleSocialLogin };
