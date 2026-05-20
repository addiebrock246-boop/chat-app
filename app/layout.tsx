import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Private Chat",
  description: "1-on-1 chat, max 2 users",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
