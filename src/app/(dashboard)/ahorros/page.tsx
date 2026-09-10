"use client";

import { useEffect, useState } from "react";
import { PiggyBank, Target } from "lucide-react";
import { PlanQuincenal as PlanQuincenalType } from "@/types/ahorro";
import ProgressBar from "@/components/ahorros/ProgressBar";
import PlanQuincenalForm from "@/components/ahorros/PlanQuincenal";
import DiagnosticCard from "@/components/ahorros/DiagnosticCard";
import MetaSelector from "@/components/ahorros/MetaSelector";
import { useMetas } from "@/hooks/useMetas";

export default function AhorrosPage() {
  const { metas, cargando, crear, eliminar, actualizar } = useMetas();
  const [metaActivaId, setMetaActivaId] = useState<string | null>(null);
  const [nombreEdit, setNombreEdit] = useState("");
  const [objetivoEdit, setObjetivoEdit] = useState(0);

  const metaActiva = metas.find((m) => m.id === metaActivaId) ?? null;

  useEffect(() => {
    if (!cargando && metaActivaId === null && metas[0]) {
      setMetaActivaId(metas[0].id);
    }
  }, [cargando, metas, metaActivaId]);

  useEffect(() => {
    if (metaActiva) {
      setNombreEdit(metaActiva.nombreMeta);
      setObjetivoEdit(metaActiva.montoObjetivo);
    }
  }, [metaActiva]);

  const handleCrearMeta = async () => {
    const id = await crear();
    setMetaActivaId(id);
  };

  const handleEliminarMeta = async (id: string) => {
    await eliminar(id);
    setMetaActivaId((prevId) => {
      if (prevId !== id) return prevId;
      const restante = metas.find((m) => m.id !== id);
      return restante?.id ?? null;
    });
  };

  const handleGuardarMeta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!metaActivaId) return;
    actualizar(metaActivaId, { nombreMeta: nombreEdit, montoObjetivo: objetivoEdit });
  };

  const handleGuardarPlan = (plan: PlanQuincenalType) => {
    if (!metaActivaId) return;
    actualizar(metaActivaId, { planQuincenal: plan });
  };

  const inputClase =
    "w-full rounded-sm border border-rule bg-paper py-2 pl-9 pr-3 font-sans text-sm text-ink focus:outline-none focus:border-ahorro focus:ring-2 focus:ring-ahorro/30 dark:border-rule-dark dark:bg-paper-dark dark:text-ink-dark dark:focus:border-ahorro-dark dark:focus:ring-ahorro-dark/30";

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <header className="flex items-center gap-3">
        <div className="rounded-full border-2 border-ahorro p-2.5 text-ahorro dark:border-ahorro-dark dark:text-ahorro-dark">
          <PiggyBank className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink dark:text-ink-dark">
            Ahorros
          </h1>
          <p className="text-sm text-ink-soft dark:text-ink-soft-dark">
            Crea todas las metas que necesites y sigue su progreso con ayuda de IA
          </p>
        </div>
      </header>

      {cargando ? (
        <div className="ticket text-center text-sm text-ink-soft dark:text-ink-soft-dark">
          Cargando metas…
        </div>
      ) : (
        <>
          <MetaSelector
            metas={metas}
            metaActivaId={metaActivaId}
            onSeleccionar={setMetaActivaId}
            onCrear={handleCrearMeta}
            onEliminar={handleEliminarMeta}
          />

          {metaActiva ? (
            <>
              <section className="ticket space-y-6">
                <form
                  onSubmit={handleGuardarMeta}
                  className="grid grid-cols-1 items-end gap-4 border-b border-dashed border-rule pb-6 dark:border-rule-dark sm:grid-cols-[2fr_1fr_auto]"
                >
                  <div>
                    <label
                      htmlFor="nombreMeta"
                      className="mb-1 block font-display text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-ink-soft-dark"
                    >
                      Nombre de la meta
                    </label>
                    <div className="relative">
                      <Target className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft dark:text-ink-soft-dark" />
                      <input
                        id="nombreMeta"
                        type="text"
                        value={nombreEdit}
                        onChange={(e) => setNombreEdit(e.target.value)}
                        className={inputClase}
                        placeholder="Ej. Viaje a Cartagena"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="montoObjetivo"
                      className="mb-1 block font-display text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-ink-soft-dark"
                    >
                      Valor objetivo ($ Tope)
                    </label>
                    <input
                      id="montoObjetivo"
                      type="number"
                      min={0}
                      step={10000}
                      value={objetivoEdit}
                      onChange={(e) => setObjetivoEdit(Number(e.target.value))}
                      className={`${inputClase} pl-3 font-mono`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="rounded-sm bg-ink px-4 py-2 font-display text-sm font-semibold uppercase tracking-wide text-paper transition-opacity hover:opacity-90 dark:bg-ink-dark dark:text-paper-dark"
                  >
                    Guardar meta
                  </button>
                </form>

                <ProgressBar
                  montoActual={metaActiva.montoActual}
                  montoObjetivo={metaActiva.montoObjetivo}
                />
              </section>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <PlanQuincenalForm
                  key={`plan-${metaActiva.id}`}
                  plan={metaActiva.planQuincenal}
                  onGuardar={handleGuardarPlan}
                />
                <DiagnosticCard key={`diag-${metaActiva.id}`} meta={metaActiva} />
              </div>
            </>
          ) : (
            <div className="ticket text-center text-sm text-ink-soft dark:text-ink-soft-dark">
              Aún no tienes metas de ahorro. Crea la primera con &ldquo;Nueva
              meta&rdquo;.
            </div>
          )}
        </>
      )}
    </div>
  );
}
