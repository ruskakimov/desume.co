import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface DocumentState {
  pageMargins: [number, number, number, number];
  components: any[];
}

const initialState: DocumentState = {
  pageMargins: [0, 0, 0, 0],
  components: [],
};

export const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    appendComponent: (state, action: PayloadAction<any>) => {
      state.components.push(action.payload);
    },
  },
});

export const { appendComponent } = documentSlice.actions;

export default documentSlice.reducer;
