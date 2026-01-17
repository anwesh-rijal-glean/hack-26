import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DatabaseStatus } from "@/components/DatabaseStatus";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Glean SE Hackathon 2026",
  description: "Track team progress in real-time during Glean SE Hackathon 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DatabaseStatus />
        {children}
      </body>
    </html>
  );
}

