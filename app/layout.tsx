import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "./Provider";

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
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
