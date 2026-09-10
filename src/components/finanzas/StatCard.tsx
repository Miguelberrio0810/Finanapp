import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  etiqueta: string;
  valor: string;
  color: "ingreso" | "gasto" | "ahorro";
}

const ESTILOS = {
  ingreso: "text-ingreso dark:text-ingreso-dark",
  gasto: "text-gasto dark:text-gasto-dark",
  ahorro: "text-ahorro dark:text-ahorro-dark",
};

export default function StatCard({ icon: Icon, etiqueta, valor, color }: StatCardProps) {
  return (
    <div className="ticket ticket-interactive">
      <div className={`mb-3 flex items-center gap-2 ${ESTILOS[color]}`}>
        <Icon className="h-4 w-4" />
        <p className="font-display text-xs font-semibold uppercase tracking-wider">
          {etiqueta}
        </p>
      </div>
      <p className="font-mono text-2xl font-semibold text-ink dark:text-ink-dark">
        {valor}
      </p>
    </div>
  );
}
