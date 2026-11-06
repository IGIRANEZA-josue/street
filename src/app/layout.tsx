import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import QuickAddModal from "@/components/QuickAddModal";
import { CartProvider } from "@/store/cart";
import { officialImage } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "INKOTANYISINCE90 | Premium Streetwear",
  description: "Minimalist luxury fashion from Rwanda. Premium streetwear since 1990.",
  keywords: ["streetwear", "fashion", "Rwanda", "minimalist", "luxury", "clothing"],
  openGraph: {
    title: "INKOTANYISINCE90 | Premium Streetwear",
    description: "Minimalist luxury fashion from Rwanda. Premium streetwear since 1990.",
    images: [officialImage("ink.front-removebg-preview.model.png")],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-neutral-900 antialiased">
        <CartProvider>
          <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-black focus:px-4 focus:py-2 focus:text-white">
            Skip to content
          </a>
          <Header />
          <main id="main" className="pt-[76px] sm:pt-[88px]">{children}</main>
          <Footer />
          <CartDrawer />
          <QuickAddModal />
        </CartProvider>
      </body>
    </html>
  );
}
