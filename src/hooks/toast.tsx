import React from "react";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToastContainer
        position="top-right"
        theme="dark"
        hideProgressBar={false}
        newestOnTop={false}
        autoClose={4000}
        rtl={false}
        pauseOnFocusLoss
        closeOnClick
        pauseOnHover
        draggable
      />
      {children}
    </>
  );
}
