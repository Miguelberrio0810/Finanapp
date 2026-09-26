"use client";

import { usePrivacidad } from "@/components/layout/PrivacidadProvider";

interface ResumenMesProps {
  ingresos: number;
  gastos: number;
  ahorro: number;
  presupuestoTotal: number;
  categoriasExcedidas: number;
  diasRestantes: number;
}

export default function ResumenMes({
  ingresos,
  gastos,
  ahorro,
  presupuestoTotal,
  categoriasExcedidas,
  diasRestantes,
}: ResumenMesProps) {
  const { formato } = usePrivacidad();
  const disponible = ingresos - gastos - ahorro;
  const tasaAhorro = ingresos > 0 ? (ahorro / ingresos) * 100 : 0;
  const usoPresupuesto = presupuestoTotal > 0 ? (gastos / presupuestoTotal) * 100 : null;

  const celdas = [
    { label: "Ingresos", valor: formato(ingresos), nota: "Entradas del mes" },
    {
      label: "Gastos",
      valor: formato(gastos),
      nota:
        usoPresupuesto === null
          ? "Sin presupuesto definido"
          : `${usoPresupuesto.toFixed(0)}% del presupuesto`,
      alerta: usoPresupuesto !== null && usoPresupuesto > 100,
    },
    { label: "Ahorrado este mes", valor: formato(ahorro), nota: "Abonos a metas" },
    {
      label: "Tasa de ahorro",
      valor: `${tasaAhorro.toFixed(1)}%`,
      nota: "Ahorro sobre ingresos",
    },
  ];

  return (
    <>
      <div className="celda">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent-700 dark:text-accent-300">
              Hola, Migue · te queda disponible
            </p>
            <p
              className={`mt-2 whitespace-nowrap font-mono font-extrabold leading-none tracking-titular ${
                disponible < 0 ? "text-accent-700 dark:text-accent-300" : "text-ink dark:text-ink-dark"
              }`}
              style={{ fontSize: "clamp(44px, 8vw, 88px)" }}
            >
              {formato(disponible)}
            </p>
          </div>

          <p className="max-w-xs text-sm text-ink-soft dark:text-ink-soft-dark">
            Quedan <strong className="text-ink dark:text-ink-dark">{diasRestantes} días</strong> del
            mes.{" "}
            {categoriasExcedidas === 0 ? (
              "Ninguna categoría se ha pasado del presupuesto."
            ) : (
              <strong className="text-accent-700 dark:text-accent-300">
                {categoriasExcedidas}{" "}
                {categoriasExcedidas === 1 ? "categoría se pasó" : "categorías se pasaron"} del
                presupuesto.
              </strong>
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2 lg:grid-cols-4">
        {celdas.map((c) => (
          <div key={c.label} className="celda">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-ink-soft-dark">
              {c.label}
            </p>
            <p className="mt-2 whitespace-nowrap font-mono text-2xl font-extrabold tracking-titular text-ink dark:text-ink-dark xl:text-3xl">
              {c.valor}
            </p>
            <p
              className={`mt-1 text-sm ${
                c.alerta
                  ? "font-semibold text-accent-700 dark:text-accent-300"
                  : "text-ink-soft dark:text-ink-soft-dark"
              }`}
            >
              {c.nota}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
