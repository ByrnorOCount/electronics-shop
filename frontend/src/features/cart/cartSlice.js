import { createSlice } from '@reduxjs/toolkit';

const loadCart = () => {
  try {
    const serialized = localStorage.getItem('cart');
    return serialized ? JSON.parse(serialized) : { items: [] };
  } catch {
    return { items: [] };
  }
};

const saveCart = (state) => {
  try {
    localStorage.setItem('cart', JSON.stringify(state));
  } catch {}
};

const initialState = loadCart();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const item = action.payload; // { id, name, price, qty, image }
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        existing.qty += item.qty || 1;
      } else {
        state.items.push({ ...item, qty: item.qty || 1 });
      }
      saveCart(state);
    },
    updateQuantity(state, action) {
      const { id, qty } = action.payload;
      const existing = state.items.find((i) => i.id === id);
      if (existing) existing.qty = qty;
      saveCart(state);
    },
    removeItem(state, action) {
      const id = action.payload;
      state.items = state.items.filter((i) => i.id !== id);
      saveCart(state);
    },
    clearCart(state) {
      state.items = [];
      saveCart(state);
    },
  },
});

export const { addItem, updateQuantity, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
