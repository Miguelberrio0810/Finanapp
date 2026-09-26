"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { PlanQuincenal as PlanQuincenalType } from "@/types/ahorro";
import { usePrivacidad } from "@/components/layout/PrivacidadProvider";

interface PlanQuincenalProps {
  plan: PlanQuincenalType;
  onGuardar: (plan: PlanQuincenalType) => void;
}

export default function PlanQuincenal({ plan, onGuardar }: PlanQuincenalProps) {
  const { formato } = usePrivacidad();
  const [monto15, setMonto15] = useState(plan.monto15);
  const [monto30, setMonto30] = useState(plan.monto30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar({ monto15, monto30 });
  };

  const totalMensual = monto15 + monto30;

  return (
    <form onSubmit={handleSubmit} className="ticket">
      <h3 className="mb-1 text-lg text-ink dark:text-ink-dark">Plan de aportes quincenales</h3>
      <p className="mb-4 text-sm text-ink-soft dark:text-ink-soft-dark">
        Define cuánto vas a ahorrar el día 15 y el día 30 de cada mes.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {(
          [
            ["monto15", "Aporte día 15", monto15, setMonto15, "100000"],
            ["monto30", "Aporte día 30", monto30, setMonto30, "50000"],
          ] as const
        ).map(([id, label, valor, setValor, placeholder]) => (
          <div key={id}>
            <label htmlFor={id} className="etiqueta-campo">
              {label}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-soft dark:text-ink-soft-dark">
                $
              </span>
              <input
                id={id}
                type="number"
                min={0}
                step={1000}
                value={valor}
                onChange={(e) => setValor(Number(e.target.value))}
                className="campo pl-7 font-mono"
                placeholder={placeholder}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t-2 border-ink pt-4 dark:border-ink-dark">
        <span className="text-sm text-ink-soft dark:text-ink-soft-dark">
          Total mensual estimado:{" "}
          <strong className="whitespace-nowrap font-mono text-ink dark:text-ink-dark">
            {formato(totalMensual)}
          </strong>
        </span>
        <button type="submit" className="boton-primario">
          Guardar plan
          <Save className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
