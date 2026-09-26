"use client";

import { useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { TipoMovimiento } from "@/types/finanzas";
import { formatearFechaISO } from "@/lib/finanzas";
import type { NuevoMovimiento } from "@/hooks/useMovimientos";

interface OpcionMeta {
  id: string;
  nombre: string;
}

interface MovimientoFormProps {
  tipo: TipoMovimiento;
  /** Categorías disponibles (ingreso / gasto). */
  categorias?: string[];
  /** Metas disponibles (ahorro). */
  metas?: OpcionMeta[];
  metaInicial?: string;
  /** "chips" en las páginas, "select" en el modal. */
  variante?: "chips" | "select";
  /** Sin tarjeta ni título: para incrustarlo en el modal. */
  embebido?: boolean;
  onAgregar: (movimiento: NuevoMovimiento) => Promise<boolean | void> | boolean | void;
  onCrearCategoria?: (nombre: string) => void;
}

export default function MovimientoForm({
  tipo,
  categorias = [],
  metas = [],
  metaInicial,
  variante = "chips",
  embebido = false,
  onAgregar,
  onCrearCategoria,
}: MovimientoFormProps) {
  const esAhorro = tipo === "ahorro";
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");
  const [seleccion, setSeleccion] = useState(esAhorro ? metaInicial ?? "" : "");
  const [fecha, setFecha] = useState(() => formatearFechaISO(new Date()));
  const [mostrandoNueva, setMostrandoNueva] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const metaElegida = metas.find((m) => m.id === seleccion);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const montoNumerico = Math.round(Number(monto));

    if (!Number.isFinite(montoNumerico) || montoNumerico <= 0) {
      setError("El monto debe ser mayor a $ 0.");
      return;
    }
    if (esAhorro ? !metaElegida : !seleccion.trim()) {
      setError(esAhorro ? "Elige la meta a la que vas a abonar." : "Elige una categoría.");
      return;
    }
    const texto = descripcion.trim() || (esAhorro && metaElegida ? `Abono a ${metaElegida.nombre}` : "");
    if (!texto) {
      setError("Escribe una descripción.");
      return;
    }

    setError("");
    setEnviando(true);
    const resultado = await onAgregar({
      tipo,
      descripcion: texto,
      monto: montoNumerico,
      etiqueta: esAhorro ? metaElegida!.nombre : seleccion.trim(),
      metaId: esAhorro ? seleccion : undefined,
      fecha,
    });
    setEnviando(false);

    if (resultado === false) {
      setError("No se pudo guardar el movimiento. Intenta de nuevo.");
      return;
    }

    setDescripcion("");
    setMonto("");
    if (!esAhorro) setSeleccion("");
  };

  const confirmarNuevaCategoria = () => {
    const nombre = nuevaCategoria.trim();
    if (nombre) {
      onCrearCategoria?.(nombre);
      setSeleccion(nombre);
    }
    setNuevaCategoria("");
    setMostrandoNueva(false);
  };

  const idBase = `mov-${tipo}-${variante}`;

  const selector =
    variante === "select" || esAhorro ? (
      <div>
        <label htmlFor={`${idBase}-seleccion`} className="etiqueta-campo">
          {esAhorro ? "Meta" : "Categoría"}
        </label>
        <select
          id={`${idBase}-seleccion`}
          value={seleccion}
          onChange={(e) => setSeleccion(e.target.value)}
          className="campo"
        >
          <option value="" disabled>
            {esAhorro ? "Elige una meta…" : "Elige una categoría…"}
          </option>
          {esAhorro
            ? metas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))
            : categorias.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
        </select>
        {esAhorro && metas.length === 0 && (
          <p className="mt-1 text-xs text-ink-soft dark:text-ink-soft-dark">
            Aún no tienes metas. Créalas en Ahorros.
          </p>
        )}
      </div>
    ) : (
      <div>
        <span className="etiqueta-campo">Categoría</span>
        <div className="flex flex-wrap items-center gap-2">
          {categorias.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSeleccion(cat)}
              aria-pressed={seleccion === cat}
              className={`border px-3 py-1 text-xs font-semibold transition-colors ${
                seleccion === cat
                  ? "border-ink bg-ink text-paper dark:border-ink-dark dark:bg-ink-dark dark:text-paper-dark"
                  : "border-rule text-ink hover:border-accent hover:text-accent dark:border-rule-dark dark:text-ink-dark"
              }`}
            >
              {cat}
            </button>
          ))}

          {onCrearCategoria &&
            (mostrandoNueva ? (
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
                  className="campo w-40 px-2 py-1 text-xs"
                />
                <button
                  type="button"
                  onClick={confirmarNuevaCategoria}
                  className="text-xs font-semibold uppercase tracking-wide text-ink hover:text-accent dark:text-ink-dark"
                >
                  Añadir
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setMostrandoNueva(true)}
                className="flex items-center gap-1 border border-dashed border-rule px-3 py-1 text-xs font-semibold text-ink-soft transition-colors hover:border-accent hover:text-accent dark:border-rule-dark dark:text-ink-soft-dark"
              >
                <Plus className="h-3 w-3" />
                Nueva categoría
              </button>
            ))}
        </div>
      </div>
    );

  const contenido = (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${idBase}-monto`} className="etiqueta-campo">
              Monto (COP)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-soft dark:text-ink-soft-dark">
                $
              </span>
              <input
                id={`${idBase}-monto`}
                type="number"
                inputMode="numeric"
                min={1}
                step={1000}
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                className="campo pl-7 font-mono"
                placeholder="50000"
                autoFocus={embebido}
              />
            </div>
          </div>

          <div>
            <label htmlFor={`${idBase}-fecha`} className="etiqueta-campo">
              Fecha
            </label>
            <input
              id={`${idBase}-fecha`}
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="campo font-mono"
            />
          </div>
        </div>

        <div>
          <label htmlFor={`${idBase}-descripcion`} className="etiqueta-campo">
            Descripción{esAhorro && " (opcional)"}
          </label>
          <input
            id={`${idBase}-descripcion`}
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="campo"
            placeholder={esAhorro ? "Abono quincenal" : "Ej. Pago quincenal"}
          />
        </div>

        {selector}
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm font-semibold text-accent-700 dark:text-accent-300">
          {error}
        </p>
      )}

      <button type="submit" disabled={enviando} className="boton-primario mt-5 w-full">
        {enviando ? "Guardando…" : esAhorro ? "Abonar a la meta" : "Agregar movimiento"}
        <ArrowRight className="h-4 w-4" />
      </button>
    </>
  );

  if (embebido) {
    return (
      <form onSubmit={handleSubmit} noValidate>
        {contenido}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="ticket">
      <h3 className="mb-4 text-lg text-ink dark:text-ink-dark">Registrar movimiento</h3>
      {contenido}
    </form>
  );
}
