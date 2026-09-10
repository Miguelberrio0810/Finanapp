"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Movimiento } from "@/types/finanzas";
import { formatearFechaISO } from "@/lib/finanzas";

interface MovimientoFormProps {
  categorias: string[];
  color: "ingreso" | "gasto";
  onAgregar: (movimiento: Omit<Movimiento, "id">) => void;
  onCrearCategoria: (nombre: string) => void;
}

const ESTILOS_BOTON = {
  ingreso: "bg-ingreso hover:bg-ingreso/90 dark:bg-ingreso-dark dark:text-ink-dark dark:hover:bg-ingreso-dark/90",
  gasto: "bg-gasto hover:bg-gasto/90 dark:bg-gasto-dark dark:text-ink-dark dark:hover:bg-gasto-dark/90",
};

const ESTILOS_FOCO = {
  ingreso: "focus:border-ingreso focus:ring-ingreso/30 dark:focus:border-ingreso-dark dark:focus:ring-ingreso-dark/30",
  gasto: "focus:border-gasto focus:ring-gasto/30 dark:focus:border-gasto-dark dark:focus:ring-gasto-dark/30",
};

const ESTILOS_CHIP_ACTIVO = {
  ingreso: "border-ingreso bg-ingreso text-paper dark:border-ingreso-dark dark:bg-ingreso-dark dark:text-ink-dark",
  gasto: "border-gasto bg-gasto text-paper dark:border-gasto-dark dark:bg-gasto-dark dark:text-ink-dark",
};

export default function MovimientoForm({
  categorias,
  color,
  onAgregar,
  onCrearCategoria,
}: MovimientoFormProps) {
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");
  const [etiqueta, setEtiqueta] = useState("");
  const [fecha, setFecha] = useState(() => formatearFechaISO(new Date()));
  const [mostrandoNueva, setMostrandoNueva] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const montoNumerico = Number(monto);
    if (!descripcion.trim() || !etiqueta.trim() || montoNumerico <= 0) return;

    onAgregar({
      descripcion: descripcion.trim(),
      monto: montoNumerico,
      etiqueta: etiqueta.trim(),
      fecha,
    });

    setDescripcion("");
    setMonto("");
    setEtiqueta("");
  };

  const confirmarNuevaCategoria = () => {
    const nombre = nuevaCategoria.trim();
    if (!nombre) {
      setMostrandoNueva(false);
      return;
    }
    onCrearCategoria(nombre);
    setEtiqueta(nombre);
    setNuevaCategoria("");
    setMostrandoNueva(false);
  };

  const inputClase = `w-full rounded-sm border border-rule bg-paper px-3 py-2 font-mono text-sm text-ink focus:outline-none focus:ring-2 dark:border-rule-dark dark:bg-paper-dark dark:text-ink-dark ${ESTILOS_FOCO[color]}`;
  const labelClase =
    "mb-1 block font-display text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-ink-soft-dark";

  return (
    <form onSubmit={handleSubmit} className="ticket">
      <h3 className="mb-4 font-display text-base font-bold text-ink dark:text-ink-dark">
        Registrar movimiento
      </h3>

      <div className="space-y-4">
        <div>
          <label htmlFor="descripcion" className={labelClase}>
            Descripción
          </label>
          <input
            id="descripcion"
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className={`${inputClase} font-sans`}
            placeholder="Ej. Pago quincenal"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="monto" className={labelClase}>
              Monto
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-ink-soft dark:text-ink-soft-dark">
                $
              </span>
              <input
                id="monto"
                type="number"
                min={0}
                step={1000}
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                className={`${inputClase} pl-7`}
                placeholder="50000"
              />
            </div>
          </div>

          <div>
            <label htmlFor="fecha" className={labelClase}>
              Fecha
            </label>
            <input
              id="fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className={inputClase}
            />
          </div>
        </div>

        <div>
          <span className={labelClase}>Categoría</span>
          <div className="flex flex-wrap items-center gap-2">
            {categorias.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setEtiqueta(cat)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  etiqueta === cat
                    ? ESTILOS_CHIP_ACTIVO[color]
                    : "border-rule text-ink-soft hover:border-ink hover:text-ink dark:border-rule-dark dark:text-ink-soft-dark dark:hover:text-ink-dark"
                }`}
              >
                {cat}
              </button>
            ))}

            {mostrandoNueva ? (
              <span className="flex items-center gap-1">
                <input
                  autoFocus
                  type="text"
                  value={nuevaCategoria}
                  onChange={(e) => setNuevaCategoria(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      confirmarNuevaCategoria();
                    }
                    if (e.key === "Escape") {
                      setMostrandoNueva(false);
                      setNuevaCategoria("");
                    }
                  }}
                  placeholder="Nombre de la categoría"
                  className="w-36 rounded-full border border-rule bg-paper px-3 py-1 text-xs text-ink focus:outline-none focus:ring-1 dark:border-rule-dark dark:bg-paper-dark dark:text-ink-dark"
                />
                <button
                  type="button"
                  onClick={confirmarNuevaCategoria}
                  className="text-xs font-semibold uppercase tracking-wide text-ink-soft hover:text-ink dark:text-ink-soft-dark dark:hover:text-ink-dark"
                >
                  Añadir
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setMostrandoNueva(true)}
                className="flex items-center gap-1 rounded-full border border-dashed border-rule px-3 py-1 text-xs font-medium text-ink-soft transition-colors hover:border-ink hover:text-ink dark:border-rule-dark dark:text-ink-soft-dark dark:hover:text-ink-dark"
              >
                <Plus className="h-3 w-3" />
                Nueva categoría
              </button>
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-sm px-4 py-2.5 font-display text-sm font-semibold uppercase tracking-wide text-paper transition-colors ${ESTILOS_BOTON[color]}`}
      >
        <Plus className="h-4 w-4" />
        Agregar
      </button>
    </form>
  );
}
