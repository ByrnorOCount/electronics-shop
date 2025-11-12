import { createSlice } from '@reduxjs/toolkit';

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
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;

export const selectIsAdmin = (state) => state.auth.user?.role === 'admin';
export const selectIsStaff = (state) => state.auth.user?.role === 'staff' || state.auth.user?.role === 'admin';