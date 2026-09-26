"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Suscripcion } from "@/types/finanzas";
import { estadoCobro } from "@/lib/suscripciones";
import { usePrivacidad } from "@/components/layout/PrivacidadProvider";
import TituloSeccion from "@/components/resumen/TituloSeccion";

interface SuscripcionesProps {
  suscripciones: Suscripcion[];
  onCrear: (datos: Omit<Suscripcion, "id">) => Promise<boolean>;
  onEliminar: (id: string) => void;
}

export default function Suscripciones({ suscripciones, onCrear, onEliminar }: SuscripcionesProps) {
  const { formato } = usePrivacidad();
  const [agregando, setAgregando] = useState(false);
  const [nombre, setNombre] = useState("");
  const [monto, setMonto] = useState("");
  const [dia, setDia] = useState("");
  const [error, setError] = useState("");

  const totalMensual = suscripciones.reduce((acc, s) => acc + s.monto, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const montoNum = Math.round(Number(monto));
    const diaNum = Math.round(Number(dia));
    if (!nombre.trim() || !(montoNum > 0) || !(diaNum >= 1 && diaNum <= 31)) {
      setError("Completa nombre, un monto mayor a $ 0 y un día entre 1 y 31.");
      return;
    }
    const ok = await onCrear({ nombre: nombre.trim(), monto: montoNum, diaCobro: diaNum });
    if (!ok) {
      setError("No se pudo guardar la suscripción.");
      return;
    }
    setNombre("");
    setMonto("");
    setDia("");
    setError("");
    setAgregando(false);
  };

  return (
    <div className="celda flex flex-col">
      <TituloSeccion
        titulo="Suscripciones"
        accion={
          <button
            type="button"
            onClick={() => setAgregando((v) => !v)}
            aria-expanded={agregando}
            className="boton-ghost px-2 py-1 text-xs"
          >
            {agregando ? "Cancelar" : "Agregar"}
            {!agregando && <Plus className="h-3.5 w-3.5" />}
          </button>
        }
      />

      {agregando && (
        <form onSubmit={handleSubmit} noValidate className="mb-5 space-y-3 border-b-2 border-ink pb-5 dark:border-ink-dark">
          <div>
            <label htmlFor="sus-nombre" className="etiqueta-campo">Nombre</label>
            <input id="sus-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="campo" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="sus-monto" className="etiqueta-campo">Monto</label>
              <input id="sus-monto" type="number" min={1} step={100} value={monto} onChange={(e) => setMonto(e.target.value)} className="campo font-mono" />
            </div>
            <div>
              <label htmlFor="sus-dia" className="etiqueta-campo">Día de cobro</label>
              <input id="sus-dia" type="number" min={1} max={31} value={dia} onChange={(e) => setDia(e.target.value)} className="campo font-mono" />
            </div>
          </div>
          {error && <p role="alert" className="text-sm font-semibold text-accent-700 dark:text-accent-300">{error}</p>}
          <button type="submit" className="boton-primario w-full">
            Guardar suscripción
            <Plus className="h-4 w-4" />
          </button>
        </form>
      )}

      {suscripciones.length === 0 ? (
        <p className="text-sm text-ink-soft dark:text-ink-soft-dark">No tienes suscripciones registradas.</p>
      ) : (
        <ul className="divide-y divide-rule dark:divide-rule-dark">
          {suscripciones.map((s) => {
            const { cobrado, diasRestantes } = estadoCobro(s.diaCobro);
            return (
              <li key={s.id} className="group flex items-center gap-4 py-3">
                <span className="w-10 shrink-0 font-mono text-3xl font-extrabold leading-none tracking-titular text-ink dark:text-ink-dark">
                  {String(s.diaCobro).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink dark:text-ink-dark">{s.nombre}</p>
                  <p className="text-xs text-ink-soft dark:text-ink-soft-dark">
                    {cobrado
                      ? "Cobrado este mes"
                      : diasRestantes === 0
                        ? "Se cobra hoy"
                        : `Se cobra en ${diasRestantes} ${diasRestantes === 1 ? "día" : "días"}`}
                  </p>
                </div>
                <span className="whitespace-nowrap font-mono text-sm font-semibold text-ink dark:text-ink-dark">
                  {formato(s.monto)}
                </span>
                <button
                  type="button"
                  onClick={() => onEliminar(s.id)}
                  aria-label={`Eliminar suscripción ${s.nombre}`}
                  className="text-ink-soft opacity-60 transition-opacity hover:text-accent hover:opacity-100 focus-visible:opacity-100 dark:text-ink-soft-dark"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <dl className="mt-auto grid grid-cols-2 gap-0.5 border-t-2 border-ink pt-4 dark:border-ink-dark">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-ink-soft-dark">Mensual</dt>
          <dd className="whitespace-nowrap font-mono text-lg font-extrabold text-ink dark:text-ink-dark">{formato(totalMensual)}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-ink-soft-dark">Anual</dt>
          <dd className="whitespace-nowrap font-mono text-lg font-extrabold text-ink dark:text-ink-dark">{formato(totalMensual * 12)}</dd>
        </div>
      </dl>
    </div>
  );
}
