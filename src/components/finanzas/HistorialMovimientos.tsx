"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Movimiento, TipoMovimiento } from "@/types/finanzas";
import { formatearFechaCorta } from "@/lib/finanzas";
import { usePrivacidad } from "@/components/layout/PrivacidadProvider";

interface HistorialMovimientosProps {
  movimientos: Movimiento[];
  /** Si se omite, la lista es mixta y muestra el filtro por tipo. */
  tipo?: TipoMovimiento;
  onEliminar: (id: string) => void;
  /** Sin tarjeta ni título (cuando la sección ya los pone). */
  embebido?: boolean;
}

type Filtro = "todos" | TipoMovimiento;

const FILTROS: { valor: Filtro; label: string }[] = [
  { valor: "todos", label: "Todos" },
  { valor: "gasto", label: "Gastos" },
  { valor: "ingreso", label: "Ingresos" },
  { valor: "ahorro", label: "Ahorro" },
];

const SIGNO: Record<TipoMovimiento, string> = { ingreso: "+", gasto: "−", ahorro: "→" };

const VACIO: Record<Filtro, string> = {
  todos: "movimientos",
  ingreso: "ingresos",
  gasto: "gastos",
  ahorro: "abonos a metas",
};

export default function HistorialMovimientos({
  movimientos,
  tipo,
  onEliminar,
  embebido = false,
}: HistorialMovimientosProps) {
  const { formato } = usePrivacidad();
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const filtroActivo: Filtro = tipo ?? filtro;

  const visibles = movimientos
    .filter((m) => filtroActivo === "todos" || (m.tipo ?? tipo) === filtroActivo)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  const tabla =
    visibles.length === 0 ? (
      <p className="border-t-2 border-ink py-8 text-sm text-ink-soft dark:border-ink-dark dark:text-ink-soft-dark">
        Aún no has registrado {VACIO[filtroActivo]}.
      </p>
    ) : (
      <div className="overflow-x-auto border-t-2 border-ink dark:border-ink-dark">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-rule text-xs uppercase tracking-wide text-ink-soft dark:border-rule-dark dark:text-ink-soft-dark">
              <th scope="col" className="py-2 pr-4 font-semibold">Fecha</th>
              <th scope="col" className="py-2 pr-4 font-semibold">Descripción</th>
              <th scope="col" className="py-2 pr-4 font-semibold">Categoría</th>
              <th scope="col" className="py-2 pr-4 font-semibold">Monto</th>
              <th scope="col" className="w-10 py-2">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((m) => {
              const t = m.tipo ?? tipo ?? "gasto";
              return (
                <tr key={m.id} className="border-b border-rule last:border-b-0 dark:border-rule-dark">
                  <td className="whitespace-nowrap py-3 pr-4 font-mono text-ink-soft dark:text-ink-soft-dark">
                    {formatearFechaCorta(m.fecha)}
                  </td>
                  <td className="py-3 pr-4 font-semibold text-ink dark:text-ink-dark">
                    {m.descripcion}
                  </td>
                  <td className="py-3 pr-4">
                    <span className="inline-block whitespace-nowrap border border-ink px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-ink dark:border-ink-dark dark:text-ink-dark">
                      {m.etiqueta}
                    </span>
                  </td>
                  <td
                    className={`whitespace-nowrap py-3 pr-4 font-mono font-semibold ${
                      t === "gasto"
                        ? "text-accent-700 dark:text-accent-300"
                        : "text-ink dark:text-ink-dark"
                    }`}
                  >
                    {SIGNO[t]} {formato(m.monto)}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onEliminar(m.id)}
                      className="p-1 text-ink-soft transition-colors hover:text-accent dark:text-ink-soft-dark"
                      aria-label={`Eliminar movimiento ${m.descripcion}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );

  const filtroUI = !tipo && (
    <div
      role="radiogroup"
      aria-label="Filtrar movimientos"
      className="segmentado grid-cols-2 sm:grid-cols-4"
    >
      {FILTROS.map(({ valor, label }) => (
        <button
          key={valor}
          type="button"
          role="radio"
          aria-checked={filtro === valor}
          onClick={() => setFiltro(valor)}
          className="segmento"
        >
          {label}
        </button>
      ))}
    </div>
  );

  if (embebido) {
    return (
      <div className="space-y-4">
        {filtroUI}
        {tabla}
      </div>
    );
  }

  return (
    <div className="ticket space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-lg text-ink dark:text-ink-dark">Histórico de movimientos</h3>
          {tipo && (
            <p className="text-xs uppercase tracking-wide text-ink-soft dark:text-ink-soft-dark">
              Libro de {tipo === "ingreso" ? "entradas" : tipo === "gasto" ? "salidas" : "abonos"}
            </p>
          )}
        </div>
        {filtroUI}
      </div>
      {tabla}
    </div>
  );
}
