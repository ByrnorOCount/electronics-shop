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
