import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/movie/Sidebar";
import { BottomNav } from "@/components/movie/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CINE STREAM - Movies & Series",
  description: "Watch your favorite movies and TV series in high quality. Myanmar subtitle included.",
  keywords: ["Movies", "Series", "Streaming", "4K", "Myanmar Subtitle"],
  authors: [{ name: "CINE STREAM" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "CINE STREAM",
    description: "Watch your favorite movies and TV series in high quality",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Sidebar />
        <main className="min-h-screen pb-16">
          {children}
        </main>
        <BottomNav />
        <Toaster />
      </body>
    </html>
  );
}
