import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { ProgressBar } from "@/components/common/ProgressBar";
import { InstallPrompt } from "@/components/common/InstallPrompt";
import "./globals.css";

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-sans',
  display: 'swap',
  preload: true,
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#3b82f6",
};

export const metadata: Metadata = {
  title: {
    default: "Groaly - AI-Powered Personal Productivity Companion",
    template: "%s | Groaly",
  },
  description: "Transform chaotic notes into balanced, actionable task orchestration through conversational AI. Zero-friction planning with multi-goal orchestration and compassionate accountability.",
  keywords: ["productivity", "task management", "AI", "planning", "focus mode", "pomodoro", "weekly review", "goal tracking"],
  authors: [{ name: "Groaly Team" }],
  creator: "Groaly",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Groaly",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://groaly.com",
    title: "Groaly - AI-Powered Task Management",
    description: "Dump your notes, AI Agents handle the rest",
    siteName: "Groaly",
  },
  twitter: {
    card: "summary_large_image",
    title: "Groaly - AI-Powered Task Management",
    description: "Dump your notes, AI Agents handle the rest",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProgressBar />
        <AuthProvider>{children}</AuthProvider>
        <InstallPrompt />
        <Toaster
          position="bottom-right"
          duration={3000}
          closeButton
          richColors
          expand
        />
      </body>
    </html>
  );
}
