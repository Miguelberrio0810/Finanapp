import type { Metadata } from "next";
import { Bitter, IBM_Plex_Mono, Work_Sans } from "next/font/google";
import "./globals.css";

const bitter = Bitter({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Finanapp",
  description: "Cuentas claras en pesos colombianos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${bitter.variable} ${workSans.variable} ${plexMono.variable} font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
