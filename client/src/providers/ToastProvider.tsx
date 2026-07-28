"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,
        style: {
          fontFamily: "'Inter', 'Poppins', sans-serif",
          fontSize: "14px",
          fontWeight: 500,
          borderRadius: "12px",
          padding: "16px 24px",
          color: "#fff",
          background: "#1E1E1E",
          boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)",
          border: "1px solid #333",
        },
        success: {
          iconTheme: {
            primary: "#2ECC71",
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#FF3D57",
            secondary: "#fff",
          },
        },
      }}
    />
  );
}
