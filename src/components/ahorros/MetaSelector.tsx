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
    <div className="flex flex-wrap items-stretch gap-1">
      {metas.map((m) => {
        const porcentaje =
          m.montoObjetivo > 0 ? Math.min((m.montoActual / m.montoObjetivo) * 100, 100) : 0;
        const activa = m.id === metaActivaId;

        return (
          <div key={m.id} className="group relative">
            <button
              type="button"
              onClick={() => onSeleccionar(m.id)}
              aria-pressed={activa}
              className={`flex h-full flex-col items-start gap-0.5 border-2 px-4 py-2 pr-9 text-left text-sm font-semibold transition-colors ${
                activa
                  ? "border-accent bg-accent text-paper"
                  : "border-ink text-ink hover:border-accent hover:text-accent dark:border-ink-dark dark:text-ink-dark"
              }`}
            >
              {m.nombreMeta}
              <span className="font-mono text-xs font-normal opacity-80">
                {porcentaje.toFixed(0)}%
              </span>
            </button>
            <button
              type="button"
              onClick={() => onEliminar(m.id)}
              aria-label={`Eliminar meta ${m.nombreMeta}`}
              className={`absolute right-2 top-2 opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100 ${
                activa ? "text-paper" : "text-ink-soft hover:text-accent dark:text-ink-soft-dark"
              }`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}

      <button
        type="button"
        onClick={onCrear}
        className="flex items-center gap-1.5 border-2 border-dashed border-rule px-4 py-2.5 text-left text-sm font-semibold text-ink-soft transition-colors hover:border-accent hover:text-accent dark:border-rule-dark dark:text-ink-soft-dark"
      >
        Nueva meta
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
