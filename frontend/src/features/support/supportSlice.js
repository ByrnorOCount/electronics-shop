import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supportService } from "../../api";

const initialState = {
  tickets: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Async thunk for submitting a new ticket
export const submitTicket = createAsyncThunk(
  "support/submitTicket",
  async (ticketData, thunkAPI) => {
    try {
      return await supportService.submitTicket(ticketData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async thunk for fetching user tickets
export const getUserTickets = createAsyncThunk(
  "support/getUserTickets",
  async (_, thunkAPI) => {
    try {
      return await supportService.getUserTickets();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const supportSlice = createSlice({
  name: "support",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserTickets.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserTickets.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tickets = action.payload;
      })
      .addCase(getUserTickets.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(submitTicket.fulfilled, (state, action) => {
        // Add the new ticket to the beginning of the list
        state.tickets.unshift(action.payload);
      });
  },
});

export default supportSlice.reducer;
