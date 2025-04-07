import "./globals.css";
import { Pacifico, Inter } from "next/font/google";

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pacifico",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "Eli's Cake Cafe",
  description: "Life is the art of baking",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="rtl"
      className={`${pacifico.variable} ${inter.variable}`}
    >
      <body className={pacifico.className}>{children}</body>
    </html>
  );
}
