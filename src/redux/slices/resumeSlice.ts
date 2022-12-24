import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Resume } from "../../common/interfaces/resume";

type ResumeState = {
  resume: Resume | null;
};

const initialState: ResumeState = { resume: null };

export const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    setResume: (state, action: PayloadAction<Resume>) => {
      state.resume = action.payload;
    },
  },
});

export const { setResume } = resumeSlice.actions;
export default resumeSlice.reducer;
