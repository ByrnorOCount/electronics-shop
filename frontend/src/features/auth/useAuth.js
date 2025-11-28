import { useAppSelector } from "../../store/hooks";
import { selectUser, selectToken } from "./authSlice";

/**
 * A custom hook that provides authentication state from the Redux store,
 * including the current user, token, and authentication status.
 */
export const useAuth = () => {
  const user = useAppSelector(selectUser);
  const token = useAppSelector(selectToken);
  const status = useAppSelector((state) => state.auth.status);

  return { user, token, status };
};
