"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { MetaAhorro } from "@/types/ahorro";
import { usePrivacidad } from "@/components/layout/PrivacidadProvider";
import { useAbrirMovimiento } from "@/components/finanzas/MovimientoModal";
import Dialogo from "@/components/layout/Dialogo";
import ProgressBar from "@/components/ahorros/ProgressBar";
import DiagnosticCard from "@/components/ahorros/DiagnosticCard";

const FASES = [
  { fase: 1, titulo: "Fase 1 · Ahora" },
  { fase: 2, titulo: "Fase 2 · Después" },
];

export default function Metas({ metas }: { metas: MetaAhorro[] }) {
  const { formato } = usePrivacidad();
  const abrirMovimiento = useAbrirMovimiento();
  const [detalleId, setDetalleId] = useState<string | null>(null);
  const detalle = metas.find((m) => m.id === detalleId) ?? null;

  if (metas.length === 0) {
    return (
      <div className="celda">
        <h2 className="text-xl text-ink dark:text-ink-dark">Metas de ahorro</h2>
        <p className="mt-2 text-sm text-ink-soft dark:text-ink-soft-dark">
          Aún no tienes metas.{" "}
          <Link href="/ahorros" className="font-semibold text-ink underline hover:text-accent dark:text-ink-dark">
            Crea la primera en Ahorros
          </Link>
          .
        </p>
      </div>
    );
  }

  // Numeración continua 01, 02… siguiendo el orden de las fases
  const numeros = new Map(
    FASES.flatMap(({ fase }) => metas.filter((m) => (m.fase ?? 1) === fase)).map((m, i) => [
      m.id,
      String(i + 1).padStart(2, "0"),
    ])
  );

  return (
    <>
      {FASES.map(({ fase, titulo }) => {
        const grupo = metas.filter((m) => (m.fase ?? 1) === fase);
        if (grupo.length === 0) return null;

        const ahorrado = grupo.reduce((acc, m) => acc + Math.min(m.montoActual, m.montoObjetivo), 0);
        const objetivo = grupo.reduce((acc, m) => acc + m.montoObjetivo, 0);
        const progreso = objetivo > 0 ? (ahorrado / objetivo) * 100 : 0;

        return (
          <section key={fase} aria-label={titulo} className="grid gap-0.5">
            <div className="celda flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
              <h2 className="text-xl text-ink dark:text-ink-dark">{titulo}</h2>
              <p className="text-sm text-ink-soft dark:text-ink-soft-dark">
                <span className="font-mono font-semibold text-ink dark:text-ink-dark">{progreso.toFixed(0)}%</span>
                {" · "}
                <span className="whitespace-nowrap">{formato(ahorrado)}</span> de{" "}
                <span className="whitespace-nowrap">{formato(objetivo)}</span>
              </p>
            </div>

            {/* flex-wrap con grow: la última fila se estira y nunca deja huecos */}
            <div className="flex flex-wrap gap-0.5">
              {grupo.map((m) => {
                const faltan = Math.max(0, m.montoObjetivo - m.montoActual);
                const completa = m.montoObjetivo > 0 && faltan === 0;
                const porcentaje =
                  m.montoObjetivo > 0 ? Math.min((m.montoActual / m.montoObjetivo) * 100, 100) : 0;

                return (
                  <div
                    key={m.id}
                    onClick={() => setDetalleId(m.id)}
                    className="celda flex min-w-[15rem] flex-1 basis-64 cursor-pointer flex-col transition-colors hover:bg-card dark:hover:bg-card-dark"
                  >
                    <span className="font-mono text-sm font-extrabold text-accent">
                      {numeros.get(m.id)}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetalleId(m.id);
                      }}
                      className="mt-1 text-left text-lg font-extrabold tracking-titular text-ink hover:text-accent dark:text-ink-dark"
                    >
                      {m.nombreMeta}
                    </button>
                    <p className="mt-1 text-sm text-ink-soft dark:text-ink-soft-dark">
                      <span className="whitespace-nowrap font-mono font-semibold text-ink dark:text-ink-dark">
                        {formato(m.montoActual)}
                      </span>{" "}
                      de <span className="whitespace-nowrap font-mono">{formato(m.montoObjetivo)}</span>
                    </p>

                    <div className="mt-3 h-2 w-full bg-neutral-300 dark:bg-neutral-900">
                      <div className="h-full bg-accent" style={{ width: `${porcentaje}%` }} />
                    </div>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
                      {completa ? (
                        <span className="border-2 border-accent px-2 py-0.5 text-xs font-extrabold uppercase tracking-wide text-accent">
                          Lista para comprar
                        </span>
                      ) : (
                        <>
                          <span className="text-sm text-ink-soft dark:text-ink-soft-dark">
                            Faltan <span className="whitespace-nowrap font-mono">{formato(faltan)}</span>
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              abrirMovimiento({ tipo: "ahorro", metaId: m.id });
                            }}
                            className="boton-ghost px-2.5 py-1"
                          >
                            Abonar
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {detalle && (
        <Dialogo titulo={detalle.nombreMeta} onCerrar={() => setDetalleId(null)} ancho="lg">
          <div className="space-y-6">
            <ProgressBar montoActual={detalle.montoActual} montoObjetivo={detalle.montoObjetivo} />
            <DiagnosticCard meta={detalle} />
            <Link href="/ahorros" className="boton-ghost">
              Editar meta y plan quincenal
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Dialogo>
      )}
    </>
  );
}
