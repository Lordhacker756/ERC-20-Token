"use client";
import React from "react";
import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: "#2D3748", // dark theme background
          color: "#E2E8F0", // light text for dark theme
          border: "1px solid #4A5568",
        },
      }}
    />
  );
}
