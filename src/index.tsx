import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Toaster } from "react-hot-toast";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import ContentPage from "./pages/content/ContentPage";
import ExportPage from "./pages/export/ExportPage";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        loader: () => redirect("edit"),
      },
      {
        path: "edit",
        element: <ContentPage />,
      },
      {
        path: "export",
        element: <ExportPage />,
      },
    ],
  },
  {
    path: "sign-in",
    element: <LoginPage />,
  },
  {
    path: "sign-up",
    element: <LoginPage isSignup />,
  },
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{ duration: 5000 }}
    />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
