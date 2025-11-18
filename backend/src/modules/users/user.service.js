import bcrypt from "bcrypt";
import crypto from "crypto";
import httpStatus from "http-status";
import * as userModel from "./user.model.js";
import { sendPasswordResetEmail } from "../../core/integrations/email.service.js";
import ApiError from "../../core/utils/ApiError.js";
import logger from "../../config/logger.js";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const updateUser = async (userId, updateData) => {
  const updatedUser = await userModel.update(userId, updateData);
  if (!updatedUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
  }
  return updatedUser;
};

export const changeUserPassword = async (
  userId,
  currentPassword,
  newPassword
) => {
  if (!PASSWORD_REGEX.test(newPassword)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "New password does not meet complexity requirements."
    );
  }

  const user = await userModel.findById(userId);
  const isMatch = await bcrypt.compare(currentPassword, user.password_hash);

  if (!isMatch) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "The current password you entered is incorrect."
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await userModel.update(userId, {
    password_hash: hashedPassword,
    password_changed_at: new Date(),
  });
};

export const requestPasswordReset = async (email) => {
  const user = await userModel.findByEmail(email);

  if (user) {
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    if (process.env.NODE_ENV !== "production") {
      logger.info(
        `\n--- PASSWORD RESET --- \nUser: ${user.email}\nToken: ${resetToken}\n----------------------\n`
      );
    }

    await userModel.setResetToken(user.id, hashedToken);
    await sendPasswordResetEmail(user, resetToken);
  }
  // We don't throw an error if the user is not found to prevent email enumeration.
};

export const resetUserPassword = async (rawToken, newPassword) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");
  const user = await userModel.findByResetToken(hashedToken);

  if (!user) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Password reset token is invalid or has expired."
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await userModel.update(user.id, {
    password_hash: hashedPassword,
    password_reset_token: null,
    password_reset_expires: null,
    password_changed_at: new Date(),
  });
};

export const verifyUserEmail = async (rawToken) => {
  const token = crypto.createHash("sha256").update(rawToken).digest("hex");
  const user = await userModel.findByVerificationToken(token);

  if (!user) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Invalid or expired verification token."
    );
  }

  await userModel.verifyUser(user.id);
};
