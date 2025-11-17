// src/app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";
import Header from "@/components/Header";

export const metadata = {
  title: "EndsMeet",
  description: "Je persoonlijke money coach",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="nl">
      <body className="bg-black text-white">
        {/* Globale navigatiebalk */}
        <Header />
        {/* Pagina-inhoud */}
        <main className="pt-6">{children}</main>
      </body>
    </html>
  );
}