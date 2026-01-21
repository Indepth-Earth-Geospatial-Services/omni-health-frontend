import type { Metadata, Viewport } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { AuthProvider } from "@/features/auth/auth-provider";
import { Geist, Geist_Mono, Inter } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Omni Health",
  description: "Healthcare Management System",
  icons: {
    icon: [
      { url: "/favicons/favicon.ico", sizes: "any" },
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      {
        url: "/favicons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: "/favicons/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable}`}
      >
        <AuthProvider>{children}</AuthProvider>

        {/* Global Toast Notifications - Works everywhere */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 4000,
            style: {
              background: "white",
              color: "#334155", // slate-700
              border: "2px solid #e2e8f0", // slate-200
              borderRadius: "16px",
              padding: "16px 20px",
              fontSize: "14px",
              fontWeight: "500",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            },
            success: {
              duration: 3000,
              style: {
                border: "2px solid #10b981", // green
              },
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff",
              },
            },
            error: {
              duration: 4000,
              style: {
                border: "2px solid #ef4444", // red
              },
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
            loading: {
              style: {
                border: "2px solid #3b82f6", // blue
              },
              iconTheme: {
                primary: "#3b82f6",
                secondary: "#fff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
