import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";

// Headline font — variable, exposed as a CSS variable for `.font-headline`.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

// Body font — variable Inter, applied as the default on <body>.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VanCup — World Cup 2026 in Canada",
  description:
    "Live scores and the schedule for all 13 FIFA World Cup 2026 matches on Canadian soil — 7 at BC Place in Vancouver and 6 at Toronto Stadium (BMO Field).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${inter.variable} h-full antialiased`}
    >
      <body className={`${inter.className} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
