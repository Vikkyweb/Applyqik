import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Homepage/Header";
import Footer from "../components/Homepage/Footer";
import ThemeProvider from "../libs/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Applyqik - Your AI career agent that finds the right jobs, matches your skills, and prepares your applications.",
  description: "Stop spending hours searching and applying. Applyqik continuously discovers opportunities, analyzes your fit, and helps you prepare stronger applications automatically — while you focus on your career.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh flex flex-col">
        <ThemeProvider>
          <main>
            <Header />

            {children}
            
            <Footer />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
