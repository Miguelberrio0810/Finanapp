"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { DiagnosticoIA, MetaAhorro } from "@/types/ahorro";
import { generarDiagnostico } from "@/lib/diagnostico";

interface DiagnosticCardProps {
  meta: MetaAhorro;
}

export default function DiagnosticCard({ meta }: DiagnosticCardProps) {
  const [cargando, setCargando] = useState(true);
  const [diagnostico, setDiagnostico] = useState<DiagnosticoIA | null>(null);

  useEffect(() => {
    setCargando(true);
    const timeout = setTimeout(() => {
      setDiagnostico(generarDiagnostico(meta));
      setCargando(false);
    }, 700);
    return () => clearTimeout(timeout);
  }, [meta]);

  const fecha =
    diagnostico?.fechaEstimadaCumplimiento
      ? new Date(diagnostico.fechaEstimadaCumplimiento).toLocaleDateString(
          "es-CO",
          { day: "numeric", month: "long", year: "numeric" }
        )
      : "Sin fecha estimada";

  return (
    <div className="ticket">
      <p className="mb-4 font-display text-xs font-semibold uppercase tracking-wider text-ink-soft dark:text-ink-soft-dark">
        Diagnóstico IA
      </p>

      {cargando || !diagnostico ? (
        <div className="flex items-center gap-2 py-8 font-mono text-sm text-ink-soft dark:text-ink-soft-dark">
          <Loader2 className="h-4 w-4 animate-spin" />
          calculando proyección...
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center gap-4">
            <div className="stamp h-20 w-20 shrink-0 border-ahorro text-ahorro dark:border-ahorro-dark dark:text-ahorro-dark">
              <span className="font-mono text-2xl font-bold leading-none">
                {diagnostico.mesesEstimados}
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-wide">
                {diagnostico.mesesEstimados === 1 ? "mes" : "meses"}
              </span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-soft dark:text-ink-soft-dark">
                Cumplimiento estimado
              </p>
              <p className="font-display text-lg font-bold text-ink dark:text-ink-dark">
                {fecha}
              </p>
              <p className="font-mono text-xs text-ink-soft dark:text-ink-soft-dark">
                {diagnostico.quincenasEstimadas} quincenas restantes
              </p>
            </div>
          </div>

          <p className="border-l-2 border-ahorro pl-3 text-sm italic text-ink-soft dark:border-ahorro-dark dark:text-ink-soft-dark">
            {diagnostico.recomendacion}
          </p>
        </>
      )}
    </div>
  );
}
