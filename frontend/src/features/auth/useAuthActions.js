import { useAppDispatch } from "../../store/hooks";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser, logoutUser } from "./authSlice";
import toast from "react-hot-toast";

/**
 * A custom hook to abstract authentication-related actions like login, register, and logout.
 * It centralizes logic for dispatching Redux actions, handling navigation, and showing user feedback.
 */
export const useAuthActions = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const login = async (credentials) => {
    return dispatch(loginUser(credentials))
      .unwrap()
      .then((data) => {
        toast.success(`Welcome back, ${data.user.first_name}!`);
        navigate("/profile");
        return data;
      })
      .catch((err) => {
        toast.error(err || "Login failed. Please check your credentials.");
        // Re-throw the error to allow for component-level error handling if needed
        throw err;
      });
  };

  const register = async (userData) => {
    return dispatch(registerUser(userData))
      .unwrap()
      .then(() => {
        navigate("/login?status=registered");
      })
      .catch((err) => {
        toast.error(err || "Registration failed. Please try again.");
        throw err;
      });
  };

  const logout = async () => {
    return dispatch(logoutUser())
      .unwrap()
      .then(() => {
        navigate("/");
        toast.success("You have been logged out.");
      });
  };

  return { login, register, logout };
};
