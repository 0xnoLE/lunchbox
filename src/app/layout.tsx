import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Neighborhood Discovery - Find Your Perfect Place",
  description: "Discover restaurants, shops, attractions, jobs, and more in any neighborhood across the US.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-amber-50 font-sans">{children}</body>
    </html>
  );
}
