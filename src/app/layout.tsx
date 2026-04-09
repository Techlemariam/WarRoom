import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "War Room | Command Center",
  description: "Remote Agent Orchestrator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} ${jetbrains.variable} ${spaceGrotesk.variable} antialiased selection:bg-primary-container selection:text-on-primary-container`}>
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--sys-color-primary-container),_transparent_50%),_radial-gradient(ellipse_at_bottom_left,_var(--sys-color-secondary-container),_transparent_50%)] opacity-20 pointer-events-none" />
        {children}
      </body>
    </html>
  );
}
