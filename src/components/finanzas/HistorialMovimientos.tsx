"use client";

import { Trash2 } from "lucide-react";
import { Movimiento } from "@/types/finanzas";
import { formatCOP } from "@/lib/utils";
import { formatearFechaCorta } from "@/lib/finanzas";

interface HistorialMovimientosProps {
  movimientos: Movimiento[];
  tipo: "ingreso" | "gasto";
  onEliminar: (id: string) => void;
}

export default function HistorialMovimientos({
  movimientos,
  tipo,
  onEliminar,
}: HistorialMovimientosProps) {
  const ordenados = [...movimientos].sort((a, b) =>
    b.fecha.localeCompare(a.fecha)
  );
  const signo = tipo === "ingreso" ? "+" : "-";
  const colorMonto =
    tipo === "ingreso"
      ? "text-ingreso dark:text-ingreso-dark"
      : "text-gasto dark:text-gasto-dark";

  return (
    <div className="ticket">
      <h3 className="mb-1 font-display text-base font-bold text-ink dark:text-ink-dark">
        Histórico de movimientos
      </h3>
      <p className="mb-4 text-xs uppercase tracking-wide text-ink-soft dark:text-ink-soft-dark">
        Libro de {tipo === "ingreso" ? "entradas" : "salidas"}
      </p>

      {ordenados.length === 0 ? (
        <p className="border-t border-dashed border-rule py-8 text-center text-sm text-ink-soft dark:border-rule-dark dark:text-ink-soft-dark">
          Aún no has registrado {tipo === "ingreso" ? "ingresos" : "gastos"}.
        </p>
      ) : (
        <ul className="divide-y divide-dashed divide-rule dark:divide-rule-dark">
          {ordenados.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between gap-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink dark:text-ink-dark">
                  {m.descripcion}
                </p>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-ink-soft dark:text-ink-soft-dark">
                  <span className="rounded-sm border border-rule px-1.5 py-0.5 uppercase tracking-wide dark:border-rule-dark">
                    {m.etiqueta}
                  </span>
                  <span className="font-mono">{formatearFechaCorta(m.fecha)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`whitespace-nowrap font-mono text-sm font-semibold ${colorMonto}`}>
                  {signo} {formatCOP(m.monto)}
                </span>
                <button
                  onClick={() => onEliminar(m.id)}
                  className="text-ink-soft transition-colors hover:text-gasto dark:text-ink-soft-dark dark:hover:text-gasto-dark"
                  aria-label="Eliminar movimiento"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
