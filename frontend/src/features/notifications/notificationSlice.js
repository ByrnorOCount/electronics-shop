import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import notificationService from './notificationService';

const initialState = {
    unreadCount: 0,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

// Async thunk to fetch the unread count
export const fetchUnreadCount = createAsyncThunk(
    'notifications/fetchUnreadCount',
    async (_, { rejectWithValue }) => {
        try {
            const response = await notificationService.getUnreadCount();
            // The API returns { data: { count: X } }
            return response.data.count;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        setUnreadCount: (state, action) => {
            state.unreadCount = action.payload;
        },
        decrementUnreadCount: (state) => {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUnreadCount.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUnreadCount.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.unreadCount = action.payload;
            });
    },
});

export const { setUnreadCount, decrementUnreadCount } = notificationSlice.actions;
export default notificationSlice.reducer;
