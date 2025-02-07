import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  totalQuantity: number;
}

const initialState: CartState = {
    totalQuantity: 0,
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setTotalQuantity: (state, action: PayloadAction<{ totalQuantity: number }>) => {
            state.totalQuantity = action.payload.totalQuantity;
        }
    },
});

export const { setTotalQuantity } = cartSlice.actions;
export default cartSlice.reducer;
