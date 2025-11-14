import generateToken from '../../core/utils/generateToken.js';

/**
 * A shared callback handler for all social authentication strategies.
 * This function runs after Passport successfully authenticates a user. It sets
 * the JWT in a secure, httpOnly cookie and redirects the user to the frontend.
 */
export const socialAuthCallback = (req, res) => {
    // 'req.user' is now the user object that passport.js found or created
    if (!req.user) {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=social`);
    }

    // Create a JWT for this user (identical to the regular login logic)
    const token = generateToken(req.user.id, req.user.role);

    // Set the token in a secure, httpOnly cookie.
    res.cookie('jwt', token, {
        httpOnly: true, // Prevents client-side JS from accessing the cookie
        secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
        sameSite: 'lax', // Provides reasonable CSRF protection
        maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
    });

    // Redirect to a success page on the frontend. The frontend can then
    // make a request to /api/users/me to fetch user data.
    res.redirect(`${process.env.FRONTEND_URL}/login?status=success`);
};
