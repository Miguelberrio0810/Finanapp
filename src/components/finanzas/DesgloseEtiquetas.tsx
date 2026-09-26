"use client";

import { usePrivacidad } from "@/components/layout/PrivacidadProvider";

interface DesgloseEtiquetasProps {
  datos: { etiqueta: string; total: number }[];
  titulo?: string;
  /** Sin tarjeta ni título. */
  embebido?: boolean;
}

export default function DesgloseEtiquetas({
  datos,
  titulo = "Desglose por etiqueta",
  embebido = false,
}: DesgloseEtiquetasProps) {
  const { formato } = usePrivacidad();
  const total = datos.reduce((acc, d) => acc + d.total, 0);

  const lista =
    datos.length === 0 ? (
      <p className="text-sm text-ink-soft dark:text-ink-soft-dark">
        Aún no hay movimientos para mostrar el desglose.
      </p>
    ) : (
      <ul className="space-y-4">
        {datos.map((d) => {
          const porcentaje = total > 0 ? (d.total / total) * 100 : 0;
          return (
            <li key={d.etiqueta}>
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-3 text-sm">
                <span className="font-semibold text-ink dark:text-ink-dark">{d.etiqueta}</span>
                <span className="whitespace-nowrap font-mono text-ink-soft dark:text-ink-soft-dark">
                  {formato(d.total)} · {porcentaje.toFixed(0)}%
                </span>
              </div>
              <div className="h-2 w-full bg-neutral-300 dark:bg-neutral-900">
                <div className="h-full bg-ink dark:bg-ink-dark" style={{ width: `${porcentaje}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    );

  if (embebido) return lista;

  return (
    <div className="ticket">
      <h3 className="mb-4 text-lg text-ink dark:text-ink-dark">{titulo}</h3>
      {lista}
    </div>
  );
}
