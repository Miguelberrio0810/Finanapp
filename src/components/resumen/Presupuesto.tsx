"use client";

import { useState } from "react";
import { Check, Pencil } from "lucide-react";
import { usePrivacidad } from "@/components/layout/PrivacidadProvider";
import TituloSeccion from "@/components/resumen/TituloSeccion";

export interface FilaPresupuesto {
  categoria: string;
  gastado: number;
  tope: number;
}

interface PresupuestoProps {
  filas: FilaPresupuesto[];
  onEditarTope: (categoria: string, tope: number) => void;
}

export default function Presupuesto({ filas, onEditarTope }: PresupuestoProps) {
  const { formato } = usePrivacidad();
  const [editando, setEditando] = useState<string | null>(null);
  const [borrador, setBorrador] = useState("");

  const guardar = (categoria: string) => {
    const tope = Math.max(0, Math.round(Number(borrador)));
    if (Number.isFinite(tope)) onEditarTope(categoria, tope);
    setEditando(null);
  };

  return (
    <div className="celda">
      <TituloSeccion
        titulo="Presupuesto · gastos por categoría"
        nota="Lo gastado este mes contra el tope de cada categoría"
      />

      <ul className="space-y-5">
        {filas.map(({ categoria, gastado, tope }) => {
          const excedido = tope > 0 && gastado > tope;
          const porcentaje = tope > 0 ? Math.min((gastado / tope) * 100, 100) : 0;

          return (
            <li key={categoria}>
              <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-3">
                <span className="font-semibold text-ink dark:text-ink-dark">{categoria}</span>
                <span className="whitespace-nowrap font-mono text-sm font-semibold text-ink dark:text-ink-dark">
                  {formato(gastado)}
                </span>
              </div>

              <div className="h-2.5 w-full bg-neutral-300 dark:bg-neutral-900">
                <div
                  className={`h-full ${excedido ? "bg-accent" : "bg-ink dark:bg-ink-dark"}`}
                  style={{ width: `${tope > 0 ? porcentaje : 0}%` }}
                />
              </div>

              <div className="mt-1.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm">
                {editando === categoria ? (
                  <form
                    className="flex items-center gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      guardar(categoria);
                    }}
                  >
                    <label htmlFor={`tope-${categoria}`} className="sr-only">
                      Tope mensual de {categoria}
                    </label>
                    <input
                      id={`tope-${categoria}`}
                      type="number"
                      min={0}
                      step={10000}
                      autoFocus
                      value={borrador}
                      onChange={(e) => setBorrador(e.target.value)}
                      onKeyDown={(e) => e.key === "Escape" && setEditando(null)}
                      className="campo w-36 px-2 py-1 font-mono"
                    />
                    <button type="submit" className="boton-ghost px-2 py-1" aria-label="Guardar tope">
                      <Check className="h-4 w-4" />
                    </button>
                  </form>
                ) : tope === 0 ? (
                  <span className="text-ink-soft dark:text-ink-soft-dark">Sin tope definido</span>
                ) : excedido ? (
                  <span className="font-semibold text-accent-700 dark:text-accent-300">
                    Te pasaste por <span className="whitespace-nowrap">{formato(gastado - tope)}</span>
                  </span>
                ) : (
                  <span className="text-ink-soft dark:text-ink-soft-dark">
                    Quedan <span className="whitespace-nowrap">{formato(tope - gastado)}</span> de{" "}
                    <span className="whitespace-nowrap">{formato(tope)}</span>
                  </span>
                )}

                {editando !== categoria && (
                  <button
                    type="button"
                    onClick={() => {
                      setBorrador(tope > 0 ? String(tope) : "");
                      setEditando(categoria);
                    }}
                    className="flex items-center gap-1 text-xs font-semibold text-ink-soft hover:text-accent dark:text-ink-soft-dark"
                  >
                    {tope > 0 ? "Editar tope" : "Definir tope"}
                    <Pencil className="h-3 w-3" />
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
