import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";

const siteUrl = "https://ahsanburki.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ahsan Burki | AI Systems Architect",
    template: "%s | Ahsan Burki",
  },
  description:
    "Portfolio of Ahsan Burki — AI Engineer & Full-Stack Developer from Waziristan, Pakistan. Building intelligent agents and immersive web experiences.",
  keywords: [
    "AI Engineer",
    "Full-Stack Developer",
    "Ahsan Burki",
    "Portfolio",
    "SafarDost",
    "Machine Learning",
    "Next.js",
    "Waziristan",
    "Pakistan",
  ],
  authors: [{ name: "Ahsan Burki" }],
  creator: "Ahsan Burki",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Ahsan Burki — Portfolio",
    title: "Ahsan Burki | AI Systems Architect",
    description:
      "AI Engineer & Full-Stack Developer from Waziristan, Pakistan. Building intelligent agents and immersive web experiences.",
    images: [
      {
        url: "/log-image.jpeg",
        width: 800,
        height: 800,
        alt: "Ahsan Burki — AI Systems Architect",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahsan Burki | AI Systems Architect",
    description:
      "AI Engineer & Full-Stack Developer from Waziristan, Pakistan. Building intelligent agents and immersive web experiences.",
    images: ["/log-image.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
  },
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
