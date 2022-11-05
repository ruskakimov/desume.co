import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { DocumentComponent, PageMargins } from "./types";

export interface DocumentState {
  pageMargins: PageMargins;
  components: DocumentComponent[];
  selectedComponentIndex?: number;
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
    selectComponentWithIndex: (state, action: PayloadAction<number>) => {
      state.selectedComponentIndex = action.payload;
    },
    removeSelection: (state) => {
      state.selectedComponentIndex = undefined;
    },
    updateSelectedComponent: (
      state,
      action: PayloadAction<DocumentComponent>
    ) => {
      if (!state.selectedComponentIndex) return;
      state.components[state.selectedComponentIndex] = action.payload;
    },
  },
});

export const {
  setPageMargins,
  appendComponent,
  selectComponentWithIndex,
  removeSelection,
  updateSelectedComponent,
} = documentSlice.actions;

export default documentSlice.reducer;
