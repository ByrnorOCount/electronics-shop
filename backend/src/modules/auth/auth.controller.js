import * as authService from './auth.service.js';
import httpStatus from 'http-status';
import ApiResponse from '../../core/utils/ApiResponse.js';

/**
 * @route POST /api/auth/register
 */
export const register = async (req, res, next) => {
    try {
        const user = await authService.register(req.body);
        // In a real app, you would now trigger an email verification flow.
        const { password_hash, ...userWithoutPassword } = user;
        res
            .status(httpStatus.CREATED)
            .json(new ApiResponse(httpStatus.CREATED, userWithoutPassword, 'Registration successful. Please check your email to verify your account.'));
    } catch (error) {
        next(error);
    }
};

/**
 * @route POST /api/auth/login
 */
export const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const { user, token } = await authService.login(email, password);
        res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, { user, token }, 'Login successful'));
    } catch (error) {
        next(error);
    }
};

/**
 * Handles the redirect from social login providers.
 * This controller is hit after the passport middleware has successfully authenticated the user.
 */
export const socialAuthCallback = async (req, res, next) => {
    try {
        // The passport middleware attaches the provider's profile to req.user
        const { user, token } = await authService.handleSocialLogin(req.user);

        // Set the token in a secure, httpOnly cookie for the browser.
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        // Redirect to the frontend.
        res.redirect(process.env.FRONTEND_URL);
    } catch (error) {
        // If anything goes wrong, redirect to the login page with an error.
        console.error('Social login error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=social_login_failed`);
    }
};

/**
 * @route POST /api/auth/logout
 */
export const logout = (req, res, next) => {
    // For JWT, logout is typically handled client-side by deleting the token.
    // However, since we use cookies for social auth, we should clear it.
    res.clearCookie('jwt');

    // If using passport sessions, this would be the way to log out.
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, null, 'Logged out successfully'));
    });
};
