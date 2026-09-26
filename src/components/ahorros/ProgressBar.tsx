"use client";

import { usePrivacidad } from "@/components/layout/PrivacidadProvider";

interface ProgressBarProps {
  montoActual: number;
  montoObjetivo: number;
}

export default function ProgressBar({ montoActual, montoObjetivo }: ProgressBarProps) {
  const { formato } = usePrivacidad();
  const porcentaje =
    montoObjetivo > 0 ? Math.min((montoActual / montoObjetivo) * 100, 100) : 0;
  const marcas = [25, 50, 75];

  return (
    <div className="w-full">
      <div className="mb-2 flex items-end justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-ink-soft-dark">
          Progreso de la meta
        </span>
        <span className="font-mono text-3xl font-extrabold tracking-titular text-accent">
          {porcentaje.toFixed(1)}%
        </span>
      </div>

      <div
        className="relative h-4 w-full bg-neutral-300 dark:bg-neutral-900"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(porcentaje)}
      >
        <div
          className="h-full bg-accent transition-[width] duration-700 ease-out"
          style={{ width: `${porcentaje}%` }}
        />
        {marcas.map((m) => (
          <span
            key={m}
            className="absolute top-0 h-full w-0.5 bg-paper dark:bg-paper-dark"
            style={{ left: `${m}%` }}
          />
        ))}
      </div>

      <div className="mt-2 flex flex-wrap justify-between gap-x-3 font-mono text-sm text-ink-soft dark:text-ink-soft-dark">
        <span className="whitespace-nowrap">{formato(montoActual)}</span>
        <span className="whitespace-nowrap">{formato(montoObjetivo)}</span>
      </div>
    </div>
  );
}
