import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../api";

const userJSON = localStorage.getItem("user");
const userFromStorage =
  userJSON && userJSON !== "undefined" ? JSON.parse(userJSON) : null;
const tokenFromStorage = localStorage.getItem("token") || null;

const initialState = {
  user: userFromStorage,
  token: tokenFromStorage,
  status: "idle",
  error: null,
};

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  "auth/register",
  async (user, thunkAPI) => {
    try {
      const response = await authService.register(user);
      return response.data; // Return the user object from the response
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (user, thunkAPI) => {
    try {
      const response = await authService.login(user);
      // Return only the nested data object which contains user and token
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async thunk for user logout
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      return await authService.logout();
      // The reducer will handle clearing local state regardless of API success.
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async thunk to check auth status via httpOnly cookie
export const checkAuthStatus = createAsyncThunk(
  "auth/checkStatus",
  async (_, { getState, rejectWithValue, fulfillWithValue }) => {
    // If a social login is being processed on the login page, it will set a temporary
    // token in localStorage. We check for this to avoid a race condition where
    // this thunk and the login page both try to fetch the user.
    if (localStorage.getItem("token") === "social_login_in_progress") {
      // By rejecting with a specific string, we can identify this case in the reducer
      // and prevent any state changes, avoiding the logout/login race condition.
      // We use `rejectWithValue` so it hits the 'rejected' case.
      return rejectWithValue("social_login_in_progress");
    }
    try {
      // This service relies on the httpOnly cookie being sent by the browser.
      const user = await authService.getMe();
      // If we get a user, the session is valid. We return the user object.
      // We also check if a token already exists in the state. If it does (from localStorage),
      // we preserve it. If not, it was a social login, and we can use a placeholder.
      // This prevents overwriting a valid JWT.
      const existingToken = getState().auth.token;
      return fulfillWithValue({ user, token: existingToken || "social_login" });
    } catch (error) {
      // This will happen if the cookie is invalid or not present (e.g., guest user).
      // It's not a "real" error, just a failed check, so we reject to prevent state changes.
      const message =
        error.response?.data?.message || "No active session found.";
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      localStorage.setItem("user", JSON.stringify(user));
      // Only store the token in localStorage if it's not from a social login
      // (where the token is in an httpOnly cookie).
      if (token && token !== "social_login") {
        localStorage.setItem("token", token);
      }
      state.status = "succeeded"; // Signal that login is complete
    },
    setUser(state, action) {
      const user = action.payload;
      state.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      state.status = "idle"; // Reset status on logout
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Use the setCredentials reducer to update state
        authSlice.caseReducers.setCredentials(state, action);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Register cases (we don't log in on register, just handle status)
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Logout case
      .addCase(logoutUser.fulfilled, (state) => {
        authSlice.caseReducers.logout(state);
      })
      // Session check cases
      .addCase(checkAuthStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        // Use the same logic as a successful login to set credentials
        authSlice.caseReducers.setCredentials(state, action);
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        // If the rejection is because a social login is already being handled,
        // do nothing to prevent state churn.
        if (action.payload === "social_login_in_progress") {
          return;
        }
        // Otherwise, the session is truly invalid, so log the user out.
        authSlice.caseReducers.logout(state);
      });
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;

export const selectIsAdmin = (state) => state.auth.user?.role === "admin";
export const selectIsStaff = (state) =>
  state.auth.user?.role === "staff" || state.auth.user?.role === "admin";
