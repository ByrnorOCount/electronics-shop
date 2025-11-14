import bcrypt from 'bcrypt';
import crypto from 'crypto';
import * as UserModel from './user.model.js';
import { sendPasswordResetEmail, sendVerificationEmail } from '../../core/integrations/email.service.js';
import generateToken from '../../core/utils/generateToken.js';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const registerUser = async (userData) => {
    const { first_name, last_name, email, password } = userData;

    if (!first_name || !last_name || !email || !password) {
        throw new Error('Please provide all required fields.'); // This can be a custom error class
    }

    if (!PASSWORD_REGEX.test(password)) {
        throw new Error('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.');
    }

    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
        throw new Error('Email already in use.');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const rawVerificationToken = crypto.randomBytes(32).toString('hex');
    const hashedVerificationToken = crypto.createHash('sha256').update(rawVerificationToken).digest('hex');

    const user = await UserModel.create({
        first_name,
        last_name,
        email,
        password_hash: hashedPassword,
        provider: 'local',
        role: 'customer',
        is_verified: false,
        email_verification_token: hashedVerificationToken,
    });

    if (process.env.NODE_ENV !== 'production') {
        console.log(`\n--- EMAIL VERIFICATION --- \nUser: ${user.email}\nToken: ${rawVerificationToken}\n--------------------------\n`);
    }

    await sendVerificationEmail(user, rawVerificationToken);

    return { message: 'Registration successful. Please check your email to verify your account.' };
};

export const loginUser = async (email, password) => {
    if (!email || !password) {
        throw new Error('Please provide email and password.');
    }

    const user = await UserModel.findByEmailAndProvider(email, 'local');

    const dummyHash = '$2b$12$invalidsaltandhashextralongtobevalidbcrypt';
    const passwordHash = user ? user.password_hash : dummyHash;

    const isMatch = await bcrypt.compare(password, passwordHash);

    if (!user || !isMatch) {
        throw new Error('Invalid credentials.');
    }

    if (!user.is_verified) {
        throw new Error('Please verify your email before logging in.');
    }

    const token = generateToken(user.id, user.role);
    delete user.password_hash;

    return { message: 'Login successful.', token, user };
};

export const updateUser = async (userId, updateData) => {
    if (Object.keys(updateData).length === 0) {
        throw new Error('No fields provided to update.');
    }
    const updatedUser = await UserModel.update(userId, updateData);
    return { message: 'Profile updated successfully', user: updatedUser };
};

export const changeUserPassword = async (userId, currentPassword, newPassword) => {
    if (!currentPassword || !newPassword) {
        throw new Error('Both current and new passwords are required.');
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
        throw new Error('New password does not meet complexity requirements.');
    }

    const user = await UserModel.findById(userId);
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);

    if (!isMatch) {
        throw new Error('The current password you entered is incorrect.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await UserModel.update(userId, { password_hash: hashedPassword });

    return { message: 'Password changed successfully.' };
};

export const requestPasswordReset = async (email) => {
    const user = await UserModel.findByEmail(email);

    if (user) {
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        if (process.env.NODE_ENV !== 'production') {
            console.log(`\n--- PASSWORD RESET --- \nUser: ${user.email}\nToken: ${resetToken}\n----------------------\n`);
        }

        await UserModel.setResetToken(user.id, hashedToken);
        await sendPasswordResetEmail(user, resetToken);
    }

    // Always return the same message to prevent email enumeration attacks
    return { message: 'If a user with that email exists, a reset link has been sent.' };
};

export const resetUserPassword = async (rawToken, newPassword) => {
    if (!newPassword) {
        throw new Error('Password is required.');
    }

    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const user = await UserModel.findByResetToken(hashedToken);

    if (!user) {
        throw new Error('Password reset token is invalid or has expired.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await UserModel.update(user.id, {
        password_hash: hashedPassword,
        password_reset_token: null,
        password_reset_expires: null,
    });

    return { message: 'Password has been reset successfully.' };
};

export const verifyUserEmail = async (rawToken) => {
    const token = crypto.createHash('sha256').update(rawToken).digest('hex');
    const user = await UserModel.findByVerificationToken(token);

    if (!user) {
        throw new Error('Invalid or expired verification token.');
    }

    await UserModel.verifyUser(user.id);

    return '<h1>Email verified successfully!</h1><p>You can now close this tab and log in.</p>';
};
