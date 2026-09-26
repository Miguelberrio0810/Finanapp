"use client";

import { ResumenMes } from "@/lib/finanzas";
import { usePrivacidad } from "@/components/layout/PrivacidadProvider";
import TituloSeccion from "@/components/resumen/TituloSeccion";

const COMPACTO = new Intl.NumberFormat("es-CO", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export default function Tendencia({ meses }: { meses: ResumenMes[] }) {
  const { oculto, formato } = usePrivacidad();
  const maximo = Math.max(1, ...meses.flatMap((m) => [m.ingresos, m.gastos]));

  const netoCorto = (neto: number) => {
    if (oculto) return "••••";
    const signo = neto > 0 ? "+" : neto < 0 ? "−" : "";
    return `${signo}${COMPACTO.format(Math.abs(neto))}`;
  };

  const leyenda = (
    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-wide text-ink dark:text-ink-dark">
      <span className="flex items-center gap-1.5">
        <span className="h-3 w-3 bg-ink dark:bg-ink-dark" /> Ingresos
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-3 w-3 bg-accent" /> Gastos
      </span>
    </div>
  );

  return (
    <div className="celda">
      <TituloSeccion titulo="Tendencia · 6 meses" accion={leyenda} />

      <div
        className="flex h-48 items-end gap-2 border-b-2 border-ink dark:border-ink-dark sm:gap-4"
        role="img"
        aria-label={
          oculto
            ? "Ingresos y gastos de los últimos 6 meses"
            : meses
                .map((m) => `${m.etiqueta}: ingresos ${formato(m.ingresos)}, gastos ${formato(m.gastos)}`)
                .join("; ")
        }
      >
        {meses.map((m) => (
          <div key={m.clave} className="flex h-full min-w-0 flex-1 items-end gap-0.5 sm:gap-1">
            {(
              [
                ["ingresos", m.ingresos, "bg-ink dark:bg-ink-dark"],
                ["gastos", m.gastos, "bg-accent"],
              ] as const
            ).map(([serie, valor, color]) => (
              <div
                key={serie}
                className={`flex-1 ${color}`}
                style={{
                  height: `${(valor / maximo) * 100}%`,
                  minHeight: valor > 0 ? 2 : 0,
                }}
                title={oculto ? undefined : `${serie}: ${formato(valor)}`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-2 flex gap-2 sm:gap-4">
        {meses.map((m) => (
          <div key={m.clave} className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase text-ink dark:text-ink-dark">{m.etiqueta}</p>
            <p
              className={`whitespace-nowrap font-mono text-[11px] sm:text-xs ${
                m.neto < 0 ? "text-accent-700 dark:text-accent-300" : "text-ink-soft dark:text-ink-soft-dark"
              }`}
              title={oculto ? undefined : `Neto: ${formato(m.neto)}`}
            >
              {netoCorto(m.neto)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
