import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  etiqueta: string;
  valor: string;
  /** Solo el gasto se marca con el acento. */
  color: "ingreso" | "gasto" | "ahorro";
}

export default function StatCard({ icon: Icon, etiqueta, valor, color }: StatCardProps) {
  return (
    <div className="ticket ticket-interactive">
      <div
        className={`mb-3 flex items-center gap-2 ${
          color === "gasto"
            ? "text-accent-700 dark:text-accent-300"
            : "text-ink-soft dark:text-ink-soft-dark"
        }`}
      >
        <Icon className="h-4 w-4" />
        <p className="text-xs font-semibold uppercase tracking-wider">{etiqueta}</p>
      </div>
      <p className="whitespace-nowrap font-mono text-2xl font-extrabold tracking-titular text-ink dark:text-ink-dark">
        {valor}
      </p>
    </div>
  );
}
