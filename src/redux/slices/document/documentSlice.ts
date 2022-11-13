import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { PageMargins } from "./types";

export interface DocumentState {
  pageMargins: PageMargins;
  content: string;
}

const initialState: DocumentState = {
  pageMargins: {
    top: 0.05,
    left: 0.1,
    right: 0.1,
    bottom: 0.05,
  },
  content: "",
};

export const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    setPageMargins: (state, action: PayloadAction<PageMargins>) => {
      state.pageMargins = action.payload;
    },
    setContent: (state, action: PayloadAction<string>) => {
      state.content = action.payload;
    },
  },
});

export const { setPageMargins, setContent } = documentSlice.actions;

export default documentSlice.reducer;
