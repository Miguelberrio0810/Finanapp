"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Eye,
  EyeOff,
  LayoutGrid,
  LogOut,
  PiggyBank,
  Plus,
} from "lucide-react";
import { usePrivacidad } from "@/components/layout/PrivacidadProvider";
import { useAbrirMovimiento } from "@/components/finanzas/MovimientoModal";

const ENLACES = [
  { href: "/resumen", label: "Resumen", icon: LayoutGrid },
  { href: "/ingresos", label: "Ingresos", icon: ArrowUpCircle },
  { href: "/gastos", label: "Gastos", icon: ArrowDownCircle },
  { href: "/ahorros", label: "Ahorros", icon: PiggyBank },
] as const;

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { oculto, alternar } = usePrivacidad();
  const abrirMovimiento = useAbrirMovimiento();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="border-b-2 border-ink bg-paper dark:border-ink-dark dark:bg-paper-dark">
      <div className="mx-auto flex max-w-reticula flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
        <Link
          href="/resumen"
          className="text-xl font-extrabold tracking-titular text-ink dark:text-ink-dark"
        >
          Finan<span className="text-accent">app</span>
        </Link>

        <nav aria-label="Secciones" className="flex flex-wrap items-center gap-1">
          {ENLACES.map(({ href, label, icon: Icon }) => {
            const activo = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={activo ? "page" : undefined}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold transition-colors ${
                  activo
                    ? "bg-accent text-paper"
                    : "text-ink hover:text-accent dark:text-ink-dark dark:hover:text-accent-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
          <button
            type="button"
            onClick={alternar}
            aria-pressed={oculto}
            className="boton-ghost"
          >
            {oculto ? "Mostrar" : "Ocultar"}
            {oculto ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>

          <button type="button" onClick={() => abrirMovimiento()} className="boton-primario">
            Agregar movimiento
            <Plus className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-2 py-2 text-sm font-semibold text-ink transition-colors hover:text-accent dark:text-ink-dark"
          >
            <LogOut className="h-4 w-4" />
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}
