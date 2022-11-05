import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { DocumentComponent, PageMargins } from "./types";

export interface DocumentState {
  pageMargins: PageMargins;
  components: DocumentComponent[];
}

const initialState: DocumentState = {
  pageMargins: {
    top: 0.05,
    left: 0.1,
    right: 0.1,
    bottom: 0.05,
  },
  components: [],
};

export const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    setPageMargins: (state, action: PayloadAction<PageMargins>) => {
      state.pageMargins = action.payload;
    },
    appendComponent: (state, action: PayloadAction<DocumentComponent>) => {
      state.components.push(action.payload);
    },
  },
});

export const { setPageMargins, appendComponent } = documentSlice.actions;

export default documentSlice.reducer;
