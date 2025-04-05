import "./globals.css";
import { Pacifico } from "next/font/google";

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Eli's Coffee Shop",
  description: "Where every sip tells a story",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="rtl">
      <body className={pacifico.className}>{children}</body>
    </html>
  );
}
