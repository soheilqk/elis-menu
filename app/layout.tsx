import "./globals.css";
import { Pacifico, Inter, Amiri } from "next/font/google";

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

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  style: "normal",
  display: "swap",
  variable: "--font-amiri",
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
    <html lang="en" dir="rtl">
      <body
        className={`${pacifico.variable} ${inter.variable} ${amiri.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
