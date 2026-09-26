"use client";

import { useState } from "react";
import { PiggyBank, Target } from "lucide-react";
import { MetaAhorro, PlanQuincenal as PlanQuincenalType } from "@/types/ahorro";
import ProgressBar from "@/components/ahorros/ProgressBar";
import PlanQuincenalForm from "@/components/ahorros/PlanQuincenal";
import DiagnosticCard from "@/components/ahorros/DiagnosticCard";
import MetaSelector from "@/components/ahorros/MetaSelector";
import EncabezadoPagina from "@/components/layout/EncabezadoPagina";
import { useAbrirMovimiento } from "@/components/finanzas/MovimientoModal";
import { useMetas } from "@/hooks/useMetas";

export default function AhorrosPage() {
  const { metas, cargando, crear, eliminar, actualizar } = useMetas();
  const [seleccionada, setSeleccionada] = useState<string | null>(null);
  const abrirMovimiento = useAbrirMovimiento();

  // Sin selección válida se muestra la primera meta
  const metaActiva = metas.find((m) => m.id === seleccionada) ?? metas[0] ?? null;

  const handleCrearMeta = async () => {
    const id = await crear();
    setSeleccionada(id);
  };

  const handleEliminarMeta = async (id: string) => {
    if (seleccionada === id) setSeleccionada(null);
    await eliminar(id);
  };

  const handleGuardarPlan = (plan: PlanQuincenalType) => {
    if (!metaActiva) return;
    actualizar(metaActiva.id, { planQuincenal: plan });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <EncabezadoPagina
        icon={PiggyBank}
        titulo="Ahorros"
        descripcion="Crea todas las metas que necesites y sigue su progreso con ayuda de IA"
      />

      {cargando ? (
        <div className="ticket text-sm text-ink-soft dark:text-ink-soft-dark">Cargando metas…</div>
      ) : (
        <>
          <MetaSelector
            metas={metas}
            metaActivaId={metaActiva?.id ?? null}
            onSeleccionar={setSeleccionada}
            onCrear={handleCrearMeta}
            onEliminar={handleEliminarMeta}
          />

          {metaActiva ? (
            <>
              <section className="ticket space-y-6">
                <EditorMeta
                  key={metaActiva.id}
                  meta={metaActiva}
                  onGuardar={(cambios) => actualizar(metaActiva.id, cambios)}
                />

                <ProgressBar
                  montoActual={metaActiva.montoActual}
                  montoObjetivo={metaActiva.montoObjetivo}
                />

                <button
                  type="button"
                  onClick={() => abrirMovimiento({ tipo: "ahorro", metaId: metaActiva.id })}
                  className="boton-ghost"
                >
                  Abonar a esta meta
                </button>
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
            <div className="ticket text-sm text-ink-soft dark:text-ink-soft-dark">
              Aún no tienes metas de ahorro. Crea la primera con &ldquo;Nueva meta&rdquo;.
            </div>
          )}
        </>
      )}
    </div>
  );
}

function EditorMeta({
  meta,
  onGuardar,
}: {
  meta: MetaAhorro;
  onGuardar: (cambios: { nombreMeta: string; montoObjetivo: number; fase: number }) => void;
}) {
  const [nombre, setNombre] = useState(meta.nombreMeta);
  const [objetivo, setObjetivo] = useState(meta.montoObjetivo);
  const [fase, setFase] = useState(meta.fase ?? 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar({ nombreMeta: nombre, montoObjetivo: objetivo, fase });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 items-end gap-4 border-b-2 border-ink pb-6 dark:border-ink-dark sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_auto]"
    >
      <div>
        <label htmlFor="nombreMeta" className="etiqueta-campo">
          Nombre de la meta
        </label>
        <div className="relative">
          <Target className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft dark:text-ink-soft-dark" />
          <input
            id="nombreMeta"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="campo pl-9"
            placeholder="Ej. Viaje a Cartagena"
          />
        </div>
      </div>

      <div>
        <label htmlFor="montoObjetivo" className="etiqueta-campo">
          Valor objetivo
        </label>
        <input
          id="montoObjetivo"
          type="number"
          min={0}
          step={10000}
          value={objetivo}
          onChange={(e) => setObjetivo(Number(e.target.value))}
          className="campo font-mono"
        />
      </div>

      <div>
        <label htmlFor="faseMeta" className="etiqueta-campo">
          Fase
        </label>
        <select
          id="faseMeta"
          value={fase}
          onChange={(e) => setFase(Number(e.target.value))}
          className="campo"
        >
          <option value={1}>Fase 1 · Ahora</option>
          <option value={2}>Fase 2 · Después</option>
        </select>
      </div>

      <button type="submit" className="boton-primario">
        Guardar meta
      </button>
    </form>
  );
}
