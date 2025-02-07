// // store.ts
// import { configureStore, combineReducers } from '@reduxjs/toolkit';
// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage'; // Sử dụng localStorage
// import userReducer from './features/authSlice';

// const persistConfig = {
//   key: 'root',
//   storage,
//   whitelist: ['user'], // Chỉ lưu trữ 'user'
// };

// // Kết hợp các reducers
// const rootReducer = combineReducers({
//   user: userReducer,
// });

// // Sử dụng `persistReducer` với cấu hình đã xác định
// const persistedReducer = persistReducer(persistConfig, rootReducer);

// // Tạo `store` với `persistedReducer`
// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
//       },
//     }),
// });

// // Tạo `persistor` cho `PersistGate` trong React
// export const persistor = persistStore(store);

// // Định nghĩa các kiểu `RootState` và `AppDispatch`
// export type RootState = ReturnType<typeof rootReducer>;
// export type AppDispatch = typeof store.dispatch;


// store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './features/authSlice';
import cartReducer from './features/cartSlice';

// Kết hợp các reducers
const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
});

// Tạo `store` mà không cần sử dụng `redux-persist`
export const store = configureStore({
  reducer: rootReducer,
});

// Định nghĩa các kiểu `RootState` và `AppDispatch`
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
