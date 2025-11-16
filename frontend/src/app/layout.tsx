import "./globals.css";
import Header from "@/components/Header";

export const metadata = {
  title: "EndsMeet",
  description: "Jouw AI financiële vrijheid coach",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        <Header />
        <main className="max-w-5xl mx-auto px-4">
          {children}
        </main>
      </body>
    </html>
  );
}