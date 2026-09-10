"use client";

import { useEffect, useState } from "react";
import { formatCOP } from "@/lib/utils";

interface ProgressBarProps {
  montoActual: number;
  montoObjetivo: number;
}

export default function ProgressBar({
  montoActual,
  montoObjetivo,
}: ProgressBarProps) {
  const porcentaje =
    montoObjetivo > 0
      ? Math.min((montoActual / montoObjetivo) * 100, 100)
      : 0;

  const [anchoAnimado, setAnchoAnimado] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setAnchoAnimado(porcentaje), 100);
    return () => clearTimeout(timeout);
  }, [porcentaje]);

  const marcas = [10, 20, 30, 40, 50, 60, 70, 80, 90];

  return (
    <div className="w-full">
      <div className="mb-2 flex items-end justify-between">
        <span className="font-display text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-ink-soft-dark">
          Progreso de la meta
        </span>
        <span className="font-mono text-2xl font-semibold tabular-nums text-ahorro dark:text-ahorro-dark">
          {porcentaje.toFixed(1)}%
        </span>
      </div>

      <div className="relative h-5 w-full overflow-hidden rounded-sm border border-rule bg-paper dark:border-rule-dark dark:bg-paper-dark">
        <div
          className="h-full bg-ahorro transition-all duration-1000 ease-out dark:bg-ahorro-dark"
          style={{ width: `${anchoAnimado}%` }}
        />
        {marcas.map((m) => (
          <span
            key={m}
            className="absolute top-0 h-full w-px bg-paper/60 dark:bg-paper-dark/60"
            style={{ left: `${m}%` }}
          />
        ))}
      </div>

      <div className="mt-2 flex justify-between font-mono text-sm text-ink-soft dark:text-ink-soft-dark">
        <span>{formatCOP(montoActual)}</span>
        <span>{formatCOP(montoObjetivo)}</span>
      </div>
    </div>
  );
}
