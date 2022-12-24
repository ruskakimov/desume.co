import { configureStore } from "@reduxjs/toolkit";
import resumeReducer from "./slices/resumeSlice";

export const store = configureStore({
  reducer: {
    resume: resumeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
