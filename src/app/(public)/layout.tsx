import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Providers from "../../providers/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// NO metadata export - it's in root layout
// NO viewport export - it's in root layout

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable}`}>
      <Providers>
        {children}
      </Providers>
    </div>
  );
}