import { configureStore } from '@reduxjs/toolkit';
import { storeSlice } from './store';

export const store = configureStore({
  reducer: storeSlice.reducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
