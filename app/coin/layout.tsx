import type { Metadata } from "next";
import Header from "@/components/globals/Header";
import Footer from "@/components/globals/Footer";
import { UserStoreProvider } from "@/lib/store/user-provider";
import { ToastProvider } from "@/components/providers/ToastProvider";

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
  metadataBase: new URL("https://tsundere.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://tsundere.vercel.app",
    title: "Tsundere Coin | The Anime Enthusiast's Cryptocurrency",
    description:
      "ERC-20 Token Made By Weeb For the Weebs🎎. Join our community!",
    siteName: "Tsundere Coin",
    images: [
      {
        url: "https://tsundere.vercel.app",
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
    images: ["https://tsundere.vercel.app"], // Create and add this image to your public folder
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <UserStoreProvider>
          <Header />
          {children}
          <Footer />
          <ToastProvider />
        </UserStoreProvider>
      </body>
    </html>
  );
}
