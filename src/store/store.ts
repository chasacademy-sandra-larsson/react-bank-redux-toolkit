import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './accountSlice'; 


export const store: any = configureStore({
  reducer: {
    account: accountReducer,
  },
});

// För typescript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
