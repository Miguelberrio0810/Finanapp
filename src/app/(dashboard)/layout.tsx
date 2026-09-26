import NavBar from "@/components/layout/NavBar";
import { MovimientoModalProvider } from "@/components/finanzas/MovimientoModal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MovimientoModalProvider>
      <div className="min-h-screen">
        <NavBar />
        {children}
      </div>
    </MovimientoModalProvider>
  );
}
