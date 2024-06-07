import type { Metadata } from "next";
import { Roboto_Condensed, Roboto_Flex, Roboto_Mono, Roboto_Serif, Roboto_Slab, Inter, Inter_Tight } from "next/font/google";
import "./globals.css";

const font = Inter_Tight({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NPM Downloads",
  description: "Track NPM downloads for your packages",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={font.className}>{children}</body>
    </html>
  );
}
