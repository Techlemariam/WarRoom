import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Oversight Dashboard | Systems Console",
  description: "Enterprise Operations Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${jetbrains.variable} antialiased selection:bg-primary-container selection:text-on-primary-container`}>
        {/* All stylized gradients removed for stealth mode */}
        <div className="relative min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
