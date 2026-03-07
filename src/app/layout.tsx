import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";

export const metadata: Metadata = {
  title: "Ahsan Burki | AI Systems Architect",
  description:
    "Portfolio of Ahsan Burki — AI Engineer & Full-Stack Developer from Waziristan, Pakistan. Building intelligent agents and immersive web experiences.",
  keywords: [
    "AI Engineer",
    "Full-Stack Developer",
    "Ahsan Burki",
    "Portfolio",
    "SafarDost",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="grid-bg min-h-screen">
        <ScrollProgress />
        <Navbar />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
