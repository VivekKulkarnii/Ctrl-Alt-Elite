import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LexAI — AI Legal Document Agent",
  description:
    "Understand any legal document in seconds. Powered by AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
