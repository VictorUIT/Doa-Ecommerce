// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { RouterProvider } from "react-router-dom";
import { MyThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import "react-toastify/dist/ReactToastify.css";
import router from "./routes";

ReactDOM.createRoot(document.getElementById("root")).render(
  <MyThemeProvider>
    <CartProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </CartProvider>
  </MyThemeProvider>,
);
