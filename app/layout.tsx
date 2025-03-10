import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "Tsundere Coin | ERC-20 Token For Anime Enthusiasts",
  description:
    "Tsundere Coin is an ERC-20 token created by weebs for the anime community. Join our thriving community and invest in the future of weeb culture.",
  keywords: [
    "tsundere",
    "crypto",
    "erc20",
    "anime",
    "weeb",
    "token",
    "cryptocurrency",
    "blockchain",
    "ethereum",
  ],
  authors: [{ name: "Tsundere Coin Team" }],
  creator: "Tsundere Coin",
  publisher: "Tsundere Coin",
  robots: "index, follow",
  metadataBase: new URL("https://tsunderecoin.com"), // Replace with your actual domain
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://tsunderecoin.com", // Replace with your actual domain
    title: "Tsundere Coin | The Anime Enthusiast's Cryptocurrency",
    description:
      "ERC-20 Token Made By Weeb For the Weebs🎎. Join our community!",
    siteName: "Tsundere Coin",
    images: [
      {
        url: "/og-image.png", // Create and add this image to your public folder
        width: 1200,
        height: 630,
        alt: "Tsundere Coin logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tsundere Coin | The Anime Enthusiast's Cryptocurrency",
    description: "ERC-20 Token Made By Weeb For the Weebs🎎",
    creator: "@rudraksx", // Replace with your actual Twitter handle
    images: ["/og-image.png"], // Create and add this image to your public folder
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
