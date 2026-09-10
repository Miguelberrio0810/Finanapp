import { formatCOP } from "@/lib/utils";

interface DesgloseEtiquetasProps {
  datos: { etiqueta: string; total: number }[];
}

const PALETA = [
  "bg-gasto dark:bg-gasto-dark",
  "bg-ahorro dark:bg-ahorro-dark",
  "bg-ingreso dark:bg-ingreso-dark",
  "bg-ink/70 dark:bg-ink-dark/70",
];

export default function DesgloseEtiquetas({ datos }: DesgloseEtiquetasProps) {
  const total = datos.reduce((acc, d) => acc + d.total, 0);

  if (datos.length === 0) {
    return (
      <div className="ticket text-sm text-ink-soft dark:text-ink-soft-dark">
        Aún no hay gastos registrados para mostrar el desglose.
      </div>
    );
  }

  return (
    <div className="ticket">
      <h3 className="mb-4 font-display text-base font-bold text-ink dark:text-ink-dark">
        Desglose por etiqueta
      </h3>
      <div className="space-y-4">
        {datos.map((d, i) => {
          const porcentaje = total > 0 ? (d.total / total) * 100 : 0;
          return (
            <div key={d.etiqueta}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-ink dark:text-ink-dark">
                  {d.etiqueta}
                </span>
                <span className="font-mono text-ink-soft dark:text-ink-soft-dark">
                  {formatCOP(d.total)} · {porcentaje.toFixed(0)}%
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-sm border border-rule bg-paper dark:border-rule-dark dark:bg-paper-dark">
                <div
                  className={`h-full ${PALETA[i % PALETA.length]} transition-all duration-700 ease-out`}
                  style={{ width: `${porcentaje}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
