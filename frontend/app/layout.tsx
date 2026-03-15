import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LayoutPicker } from "@/components/Layout/LayoutPicker";

const inter = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "LMS - Learning Management System",
  description: "Professional video-based learning platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <LayoutPicker>{children}</LayoutPicker>
      </body>
    </html>
  );
}
