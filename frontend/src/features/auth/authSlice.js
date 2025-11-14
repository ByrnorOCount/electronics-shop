import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../api';

const tokenFromStorage = localStorage.getItem('token') || null;
const userFromStorage = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null;

const initialState = {
    user: userFromStorage,
    token: tokenFromStorage,
    status: 'idle',
    error: null,
};

// Async thunk for user registration
export const registerUser = createAsyncThunk('auth/register', async (user, thunkAPI) => {
    try {
        return await authService.register(user);
    } catch (error) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Async thunk for user login
export const loginUser = createAsyncThunk('auth/login', async (user, thunkAPI) => {
    try {
        const data = await authService.login(user);
        // The service returns the data, the thunk passes it to the reducer
        return data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials(state, action) {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;
            localStorage.setItem('user', JSON.stringify(user));
            // Only store the token in localStorage if it's not from a social login
            // (where the token is in an httpOnly cookie).
            if (token && token !== 'social_login') {
                localStorage.setItem('token', token);
            }
            state.status = 'succeeded'; // Signal that login is complete
        },
        setUser(state, action) {
            const user = action.payload;
            state.user = user;
            localStorage.setItem('user', JSON.stringify(user));
        },
        logout(state) {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            state.status = 'idle'; // Reset status on logout
        },
    },
    extraReducers: (builder) => {
        builder
            // Login cases
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Use the setCredentials reducer to update state
                authSlice.caseReducers.setCredentials(state, action);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Register cases (we don't log in on register, just handle status)
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;

export const selectIsAdmin = (state) => state.auth.user?.role === 'admin';
export const selectIsStaff = (state) => state.auth.user?.role === 'staff' || state.auth.user?.role === 'admin';