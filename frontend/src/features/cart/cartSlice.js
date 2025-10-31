import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'syncing' | 'succeeded' | 'failed'
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCartSyncStatus(state, action) {
            state.status = action.payload;
        },
        addItem(state, action) {
            const item = action.payload; // { id, name, price, qty, image }
            const existing = state.items.find((i) => i.id === item.id);
            if (existing) {
                existing.qty += item.qty || 1;
                existing.modifiedAt = new Date().toISOString(); // Update timestamp
                // Ensure cartItemId from backend is preserved if it exists
                if (item.cartItemId) existing.cartItemId = item.cartItemId;
            } else {
                // Ensure qty is always a number
                const qty = Number.isInteger(item.qty) && item.qty > 0 ? item.qty : 1;
                // Add new item with timestamp
                state.items.push({ ...item, qty, modifiedAt: new Date().toISOString() });
            }
        },
        updateQuantity(state, action) {
            const { id, qty } = action.payload;
            const existing = state.items.find((i) => i.id === id);
            if (existing) {
                existing.qty = qty;
                existing.modifiedAt = new Date().toISOString(); // Update timestamp
            }
        },
        removeItem(state, action) {
            const id = action.payload;
            state.items = state.items.filter((i) => i.id !== id);
        },
        clearCart(state) {
            state.items = [];
            state.status = 'idle';
        },
        setCart(state, action) {
            state.items = action.payload;
            state.status = 'succeeded';
        },
    },
});

export const {
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    setCart,
    setCartSyncStatus
} = cartSlice.actions;
export default cartSlice.reducer;
