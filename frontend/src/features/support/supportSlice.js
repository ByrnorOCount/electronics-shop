import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supportService } from "../../api";

const initialState = {
  tickets: [],
  faqs: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  faqStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  faqError: null,
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

// Async thunk for fetching FAQs
export const getFaqs = createAsyncThunk(
  "support/getFaqs",
  async (_, thunkAPI) => {
    try {
      return await supportService.getFaqs();
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
      })
      .addCase(getFaqs.pending, (state) => {
        state.faqStatus = "loading";
      })
      .addCase(getFaqs.fulfilled, (state, action) => {
        state.faqStatus = "succeeded";
        state.faqs = action.payload;
      })
      .addCase(getFaqs.rejected, (state, action) => {
        state.faqStatus = "failed";
        state.faqError = action.payload;
      });
  },
});

export default supportSlice.reducer;
