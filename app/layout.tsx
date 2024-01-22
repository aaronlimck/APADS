import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "./Provider";
import { Toaster } from "@/components/ui/sonner";
import DesignerContextProvider from "@/components/context/DesignerContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "APADS",
  description: "Autonomous Performance Appraisal and Development System"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`min-h-screen w-full ${inter.className}`}>
        <DesignerContextProvider>
          <Provider>{children}</Provider>
          <Toaster position="bottom-right" />
        </DesignerContextProvider>
      </body>
    </html>
  );
}
