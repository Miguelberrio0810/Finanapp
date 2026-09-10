"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { PlanQuincenal as PlanQuincenalType } from "@/types/ahorro";
import { formatCOP } from "@/lib/utils";

interface PlanQuincenalProps {
  plan: PlanQuincenalType;
  onGuardar: (plan: PlanQuincenalType) => void;
}

export default function PlanQuincenal({
  plan,
  onGuardar,
}: PlanQuincenalProps) {
  const [monto15, setMonto15] = useState(plan.monto15);
  const [monto30, setMonto30] = useState(plan.monto30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar({ monto15, monto30 });
  };

  const totalMensual = monto15 + monto30;
  const inputClase =
    "w-full rounded-sm border border-rule bg-paper py-2 pl-7 pr-3 font-mono text-sm text-ink focus:outline-none focus:border-ahorro focus:ring-2 focus:ring-ahorro/30 dark:border-rule-dark dark:bg-paper-dark dark:text-ink-dark dark:focus:border-ahorro-dark dark:focus:ring-ahorro-dark/30";
  const labelClase =
    "mb-1 block font-display text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-ink-soft-dark";

  return (
    <form onSubmit={handleSubmit} className="ticket">
      <h3 className="mb-1 font-display text-base font-bold text-ink dark:text-ink-dark">
        Plan de aportes quincenales
      </h3>
      <p className="mb-4 text-sm text-ink-soft dark:text-ink-soft-dark">
        Define cuánto vas a ahorrar el día 15 y el día 30 de cada mes.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="monto15" className={labelClase}>
            Aporte día 15
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-ink-soft dark:text-ink-soft-dark">
              $
            </span>
            <input
              id="monto15"
              type="number"
              min={0}
              step={1000}
              value={monto15}
              onChange={(e) => setMonto15(Number(e.target.value))}
              className={inputClase}
              placeholder="100000"
            />
          </div>
        </div>

        <div>
          <label htmlFor="monto30" className={labelClase}>
            Aporte día 30
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-ink-soft dark:text-ink-soft-dark">
              $
            </span>
            <input
              id="monto30"
              type="number"
              min={0}
              step={1000}
              value={monto30}
              onChange={(e) => setMonto30(Number(e.target.value))}
              className={inputClase}
              placeholder="50000"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-rule pt-4 dark:border-rule-dark">
        <span className="text-sm text-ink-soft dark:text-ink-soft-dark">
          Total mensual estimado:{" "}
          <strong className="font-mono text-ink dark:text-ink-dark">
            {formatCOP(totalMensual)}
          </strong>
        </span>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-sm bg-ahorro px-4 py-2 font-display text-sm font-semibold uppercase tracking-wide text-paper transition-colors hover:bg-ahorro/90 dark:bg-ahorro-dark dark:text-ink-dark dark:hover:bg-ahorro-dark/90"
        >
          <Save className="h-4 w-4" />
          Guardar plan
        </button>
      </div>
    </form>
  );
}
