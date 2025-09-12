import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./transitions.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "SIADIL - Sistem Arsip Digital",
  description: "Clone of Demplon SIADIL system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="font-loading">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
            /* Prevent FOUC */
            html, body { 
              margin: 0; 
              padding: 0; 
              background-color: white; 
              font-family: system-ui, -apple-system, sans-serif;
            }
          `,
          }}
        />
      </head>
      <body className={`${poppins.variable} antialiased`}>{children}</body>
    </html>
  );
}
