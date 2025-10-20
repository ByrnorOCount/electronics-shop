import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from '../../services/productService';

// Đây là một "thunk", một hàm đặc biệt để thực hiện các tác vụ bất đồng bộ (như gọi API)
// và cập nhật state của Redux.
export const fetchFeaturedProducts = createAsyncThunk(
    'products/fetchFeatured',
    async (_, thunkAPI) => {
        try {
            // Gọi hàm getFeaturedProducts từ service chúng ta đã tạo ở bước 1
            return await productService.getFeaturedProducts();
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

const initialState = {
    featuredProducts: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

export const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {}, // Chúng ta sẽ không cần reducer đồng bộ cho tác vụ này
    extraReducers: (builder) => {
        builder
            .addCase(fetchFeaturedProducts.pending, (state) => {
                state.status = 'loading'; // Khi bắt đầu gọi API, chuyển trạng thái sang loading
            })
            .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
                state.status = 'succeeded'; // Khi gọi API thành công, lưu dữ liệu vào state
                state.featuredProducts = action.payload;
            })
            .addCase(fetchFeaturedProducts.rejected, (state, action) => {
                state.status = 'failed'; // Khi gọi API thất bại, lưu lỗi
                state.error = action.payload;
            });
    },
});

export default productSlice.reducer;