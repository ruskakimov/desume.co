import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders save button", () => {
  render(<App />);
  const saveElement = screen.getByText(/save/i);
  expect(saveElement).toBeInTheDocument();
});
