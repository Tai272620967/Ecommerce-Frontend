import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WishlistState {
  totalCount: number;
  productIds: number[];
}

const initialState: WishlistState = {
  totalCount: 0,
  productIds: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlistCount: (state, action: PayloadAction<{ totalCount: number }>) => {
      state.totalCount = action.payload.totalCount;
    },
    addToWishlist: (state, action: PayloadAction<{ productId: number }>) => {
      if (!state.productIds.includes(action.payload.productId)) {
        state.productIds.push(action.payload.productId);
        state.totalCount = state.productIds.length;
      }
    },
    removeFromWishlist: (state, action: PayloadAction<{ productId: number }>) => {
      state.productIds = state.productIds.filter(
        (id) => id !== action.payload.productId
      );
      state.totalCount = state.productIds.length;
    },
    setWishlistProducts: (state, action: PayloadAction<{ productIds: number[] }>) => {
      state.productIds = action.payload.productIds;
      state.totalCount = action.payload.productIds.length;
    },
    clearWishlist: (state) => {
      state.productIds = [];
      state.totalCount = 0;
    },
  },
});

export const {
  setWishlistCount,
  addToWishlist,
  removeFromWishlist,
  setWishlistProducts,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;

