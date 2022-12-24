import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Resume, WorkExperience } from "../../common/interfaces/resume";

type ContentState = {
  resume: Resume | null;
};

const initialState: ContentState = { resume: null };

export const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    setResume: (state, action: PayloadAction<Resume>) => {
      state.resume = action.payload;
    },
    setWorkHistory: (state, action: PayloadAction<WorkExperience[]>) => {
      if (state.resume) {
        state.resume.workHistory = action.payload;
      }
    },
  },
});

export const { setResume, setWorkHistory } = contentSlice.actions;
export default contentSlice.reducer;
