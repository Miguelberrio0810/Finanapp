"use client";

import { Plus, Trash2 } from "lucide-react";
import { MetaAhorro } from "@/types/ahorro";

interface MetaSelectorProps {
  metas: MetaAhorro[];
  metaActivaId: string | null;
  onSeleccionar: (id: string) => void;
  onCrear: () => void;
  onEliminar: (id: string) => void;
}

export default function MetaSelector({
  metas,
  metaActivaId,
  onSeleccionar,
  onCrear,
  onEliminar,
}: MetaSelectorProps) {
  return (
    <div className="flex flex-wrap items-end gap-1">
      {metas.map((m) => {
        const porcentaje =
          m.montoObjetivo > 0
            ? Math.min((m.montoActual / m.montoObjetivo) * 100, 100)
            : 0;
        const activa = m.id === metaActivaId;

        return (
          <div key={m.id} className="group relative">
            <button
              type="button"
              onClick={() => onSeleccionar(m.id)}
              className={`flex flex-col items-start gap-0.5 rounded-t-md border-b-[3px] px-4 py-2 pr-8 font-display text-sm font-semibold transition-colors ${
                activa
                  ? "border-ahorro bg-card text-ink dark:border-ahorro-dark dark:bg-card-dark dark:text-ink-dark"
                  : "border-transparent text-ink-soft hover:text-ink dark:text-ink-soft-dark dark:hover:text-ink-dark"
              }`}
            >
              {m.nombreMeta}
              <span className="font-mono text-xs font-normal text-ink-soft dark:text-ink-soft-dark">
                {porcentaje.toFixed(0)}%
              </span>
            </button>
            <button
              type="button"
              onClick={() => onEliminar(m.id)}
              aria-label={`Eliminar meta ${m.nombreMeta}`}
              className="absolute right-2 top-2 text-ink-soft opacity-0 transition-opacity hover:text-gasto group-hover:opacity-100 dark:text-ink-soft-dark dark:hover:text-gasto-dark"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}

      <button
        type="button"
        onClick={onCrear}
        className="flex items-center gap-1.5 rounded-t-md border-b-[3px] border-dashed border-rule px-4 py-2.5 font-display text-sm font-semibold text-ink-soft transition-colors hover:border-ink hover:text-ink dark:border-rule-dark dark:text-ink-soft-dark dark:hover:text-ink-dark"
      >
        <Plus className="h-4 w-4" />
        Nueva meta
      </button>
    </div>
  );
}
