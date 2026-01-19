import { Geist, Geist_Mono, Inter } from "next/font/google";
import "../globals.css";
import Providers from "../../providers/providers";
import { Toaster } from "sonner";

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

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} h-dvh *:mx-auto *:max-w-120!`}
    >
      <Providers>{children}</Providers>
      <Toaster position="top-right" closeButton />
    </div>
  );
}
