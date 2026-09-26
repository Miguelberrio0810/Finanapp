"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { DiagnosticoIA, MetaAhorro } from "@/types/ahorro";
import { generarDiagnostico } from "@/lib/diagnostico";

interface DiagnosticCardProps {
  meta: MetaAhorro;
}

// Solo estos campos afectan el diagnóstico: evita recalcular por cambios de nombre u orden
function claveDiagnostico(meta: MetaAhorro) {
  return JSON.stringify([
    meta.id,
    meta.nombreMeta,
    meta.montoObjetivo,
    meta.montoActual,
    meta.planQuincenal.monto15,
    meta.planQuincenal.monto30,
  ]);
}

export default function DiagnosticCard({ meta }: DiagnosticCardProps) {
  const clave = claveDiagnostico(meta);
  const [resultado, setResultado] = useState<{ clave: string; diagnostico: DiagnosticoIA } | null>(
    null
  );

  useEffect(() => {
    const controlador = new AbortController();
    const payload: MetaAhorro = JSON.parse(JSON.stringify(meta));

    fetch("/api/diagnostico", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controlador.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<DiagnosticoIA>;
      })
      .then((diagnostico) => setResultado({ clave, diagnostico }))
      .catch(() => {
        if (controlador.signal.aborted) return;
        setResultado({ clave, diagnostico: generarDiagnostico(payload) });
      });

    return () => controlador.abort();
    // `clave` resume los campos de `meta` que importan
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave]);

  const diagnostico = resultado?.clave === clave ? resultado.diagnostico : null;

  const fecha = diagnostico?.fechaEstimadaCumplimiento
    ? new Date(diagnostico.fechaEstimadaCumplimiento).toLocaleDateString("es-CO", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Sin fecha estimada";

  return (
    <div className="ticket">
      <p className="mb-5 text-xs font-semibold uppercase tracking-[0.12em] text-accent-700 dark:text-accent-300">
        Diagnóstico IA
      </p>

      {!diagnostico ? (
        <div className="flex items-center gap-2 py-8 text-sm text-ink-soft dark:text-ink-soft-dark">
          <Loader2 className="h-4 w-4 animate-spin" />
          calculando proyección…
        </div>
      ) : (
        <>
          <div className="mb-5 flex flex-wrap items-center gap-5">
            <div className="stamp h-24 w-24 shrink-0 border-accent text-accent dark:border-accent-300 dark:text-accent-300">
              <span className="font-mono text-4xl font-extrabold leading-none">
                {diagnostico.mesesEstimados}
              </span>
              <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide">
                {diagnostico.mesesEstimados === 1 ? "mes" : "meses"}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wide text-ink-soft dark:text-ink-soft-dark">
                Cumplimiento estimado
              </p>
              <p className="text-xl font-extrabold tracking-titular text-ink dark:text-ink-dark">
                {fecha}
              </p>
              <p className="font-mono text-sm text-ink-soft dark:text-ink-soft-dark">
                {diagnostico.quincenasEstimadas} quincenas restantes
              </p>
            </div>
          </div>

          <p className="border-l-2 border-accent pl-4 text-sm leading-relaxed text-ink dark:border-accent-300 dark:text-ink-dark">
            {diagnostico.recomendacion}
          </p>
        </>
      )}
    </div>
  );
}
