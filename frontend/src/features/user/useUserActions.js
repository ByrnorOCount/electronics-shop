import { useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { userService } from "../../api";
import { setUser } from "../auth/authSlice";
import toast from "react-hot-toast";
import logger from "../../utils/logger";

/**
 * A custom hook to manage user-related actions like profile updates and password changes.
 *
 * @returns {{
 *  updateProfile: (data: object) => Promise<boolean>;
 *  changePassword: (data: object) => Promise<boolean>;
 *  isLoading: boolean;
 *  error: Error | null;
 * }}
 */
export const useUserActions = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProfile = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await userService.updateUserProfile(userData);
      dispatch(setUser(response.user));
      toast.success("Profile updated successfully!");
      return true;
    } catch (err) {
      logger.error("Failed to update profile:", err);
      const message =
        err.response?.data?.message || "Failed to update profile.";
      toast.error(message);
      setError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (passwordData) => {
    setIsLoading(true);
    setError(null);
    try {
      await userService.changePassword(passwordData);
      toast.success("Password changed successfully!");
      return true;
    } catch (err) {
      logger.error("Failed to change password:", err);
      const message =
        err.response?.data?.message || "Failed to change password.";
      toast.error(message);
      setError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Note: A single isLoading flag is used. For simultaneous actions,
  // you might use an object like { profile: false, password: false }.
  // For this page, sequential actions are more likely, so one flag is fine.
  return { updateProfile, changePassword, isLoading, error };
};
