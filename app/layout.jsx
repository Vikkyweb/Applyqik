import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "../libs/Providers";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://applyqik.com"),

  title:
    "Applyqik - Your AI career agent that finds the right jobs, matches your skills, and prepares your applications.",

  description:
    "Stop spending hours searching and applying. Applyqik continuously discovers opportunities, analyzes your fit, and helps you prepare stronger applications automatically — while you focus on your career.",

  icons: {
    icon: [
      { url: "/logos/favicon.png" },
      { url: "/logos/favicon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: "/logos/favicon.png",
    shortcut: "/logos/favicon.png",
  },

  manifest: "/manifest.json",

  openGraph: {
    title:
      "Applyqik - Your AI Career Agent",
    description:
      "Find the right jobs, match your skills, and prepare stronger applications automatically.",
    url: "https://applyqik.com",
    siteName: "Applyqik",
    images: [
      {
        url: "/logos/logo-white.png",
        width: 1200,
        height: 630,
        alt: "Applyqik",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Applyqik - Your AI Career Agent",
    description:
      "Find the right jobs, match your skills, and prepare stronger applications automatically.",
    images: ["/logos/logo-white.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh flex flex-col">
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
