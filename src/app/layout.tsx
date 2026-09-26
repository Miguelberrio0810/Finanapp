import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { PrivacidadProvider } from "@/components/layout/PrivacidadProvider";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  variable: "--font-display",
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
      <body className={`${archivo.variable} font-sans`}>
        <PrivacidadProvider>{children}</PrivacidadProvider>
      </body>
    </html>
  );
}
