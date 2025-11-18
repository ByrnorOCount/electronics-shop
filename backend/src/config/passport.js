import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import db from "./db.js";
import logger from "./logger.js";

/**
 * A generic function to find or create a user from a social provider.
 * @param {string} provider - The name of the provider (e.g., 'google', 'facebook').
 * @param {object} profile - The profile object from Passport.
 * @param {function} done - The Passport done callback.
 */
const findOrCreateUser = async (provider, profile, done) => {
  let email =
    profile.emails && profile.emails[0] ? profile.emails[0].value : null;
  const providerId = profile.id;
  let isPlaceholderEmail = false;

  // If Facebook doesn't provide an email, create a unique placeholder email.
  if (provider === "facebook" && !email) {
    email = `${providerId}@facebook.placeholder.com`;
    isPlaceholderEmail = true;
  }

  if (!email) {
    return done(
      new Error(`'${provider}' did not return an email address.`),
      null
    );
  }

  try {
    // 1. Find a user by their provider ID.
    let user = await db("users")
      .where({ provider, provider_id: providerId })
      .first();
    if (user) {
      return done(null, user);
    }

    // 2. If not found, check if an account with this email already exists,
    // but ONLY if the email is real (not a placeholder).
    if (!isPlaceholderEmail) {
      let existingUser = await db("users").where({ email }).first();
      if (existingUser) {
        // If an account exists, link it to the new provider.
        const [linkedUser] = await db("users")
          .where({ id: existingUser.id })
          .update({
            provider: provider,
            provider_id: providerId,
            is_verified: true, // Social logins are considered verified.
          })
          .returning("*");
        return done(null, linkedUser);
      }
    }

    // 3. If no account matches, create a new user.
    const [newUser] = await db("users")
      .insert({
        first_name: profile.name.givenName || profile.displayName || "User",
        last_name: profile.name.familyName || ".",
        email: email,
        provider: provider,
        provider_id: providerId,
        is_verified: true,
      })
      .returning("*");

    return done(null, newUser);
  } catch (error) {
    logger.error(`Error in Passport ${provider} Strategy:`, error);
    return done(error, null);
  }
};

/**
 * Configures and registers the Google OAuth 2.0 strategy with Passport.
 * This function should be called only by the route that needs it.
 */
export const useGoogleStrategy = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
        proxy: true,
      },
      (accessToken, refreshToken, profile, done) => {
        findOrCreateUser("google", profile, done);
      }
    )
  );
};

/**
 * Configures and registers the Facebook strategy with Passport.
 * This function should be called only by the route that needs it.
 */
export const useFacebookStrategy = () => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "/api/auth/facebook/callback",
        proxy: true,
        profileFields: ["id", "emails", "name"],
      },
      (accessToken, refreshToken, profile, done) => {
        findOrCreateUser("facebook", profile, done);
      }
    )
  );
};
