"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowDownCircle, ArrowUpCircle, PiggyBank } from "lucide-react";

const ENLACES = [
  { href: "/ingresos", label: "Ingresos", icon: ArrowUpCircle, accent: "ingreso" },
  { href: "/gastos", label: "Gastos", icon: ArrowDownCircle, accent: "gasto" },
  { href: "/ahorros", label: "Ahorros", icon: PiggyBank, accent: "ahorro" },
] as const;

const ACENTO_ACTIVO: Record<string, string> = {
  ingreso: "border-ingreso text-ingreso dark:border-ingreso-dark dark:text-ingreso-dark",
  gasto: "border-gasto text-gasto dark:border-gasto-dark dark:text-gasto-dark",
  ahorro: "border-ahorro text-ahorro dark:border-ahorro-dark dark:text-ahorro-dark",
};

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="border-b-2 border-ink/80 bg-paper dark:border-ink-dark/60 dark:bg-paper-dark">
      <div className="mx-auto flex max-w-5xl items-end justify-between px-4">
        <span className="pb-3 font-display text-lg font-bold tracking-tight text-ink dark:text-ink-dark">
          Finan<span className="text-ahorro dark:text-ahorro-dark">app</span>
        </span>

        <nav className="flex items-end gap-1">
          {ENLACES.map(({ href, label, icon: Icon, accent }) => {
            const activo = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 rounded-t-md border-b-[3px] px-4 py-2.5 font-display text-sm font-semibold uppercase tracking-wide transition-colors ${
                  activo
                    ? `bg-card dark:bg-card-dark ${ACENTO_ACTIVO[accent]}`
                    : "border-transparent text-ink-soft hover:text-ink dark:text-ink-soft-dark dark:hover:text-ink-dark"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
