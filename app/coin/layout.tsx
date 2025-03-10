import type { Metadata } from "next";
import Header from "@/components/globals/Header";
import Footer from "@/components/globals/Footer";
import { UserStoreProvider } from "@/lib/store/user-provider";
import { ToastProvider } from "@/components/providers/ToastProvider";

export const metadata: Metadata = {
  title: "Tsundere Coin",
  description: "ERC-20 Token Made By Weeb For the Weebs🎎",
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
