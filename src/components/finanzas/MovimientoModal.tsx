"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { X } from "lucide-react";
import { ETIQUETAS_GASTO, ETIQUETAS_INGRESO, TipoMovimiento } from "@/types/finanzas";
import MovimientoForm from "@/components/finanzas/MovimientoForm";
import { crearMovimiento } from "@/hooks/useMovimientos";
import { useCategorias } from "@/hooks/useCategorias";
import { useMetas } from "@/hooks/useMetas";

interface OpcionesApertura {
  tipo?: TipoMovimiento;
  metaId?: string;
}

const Contexto = createContext<(opciones?: OpcionesApertura) => void>(() => {});

export function useAbrirMovimiento() {
  return useContext(Contexto);
}

export function MovimientoModalProvider({ children }: { children: React.ReactNode }) {
  const [apertura, setApertura] = useState<OpcionesApertura | null>(null);
  const abrir = useCallback((opciones: OpcionesApertura = {}) => setApertura(opciones), []);
  const cerrar = useCallback(() => setApertura(null), []);

  return (
    <Contexto.Provider value={abrir}>
      {children}
      {apertura && <MovimientoModal inicial={apertura} onCerrar={cerrar} />}
    </Contexto.Provider>
  );
}

const TIPOS: { valor: TipoMovimiento; label: string }[] = [
  { valor: "gasto", label: "Gasto" },
  { valor: "ingreso", label: "Ingreso" },
  { valor: "ahorro", label: "Ahorro" },
];

function MovimientoModal({
  inicial,
  onCerrar,
}: {
  inicial: OpcionesApertura;
  onCerrar: () => void;
}) {
  const [tipo, setTipo] = useState<TipoMovimiento>(inicial.tipo ?? "gasto");
  const gastos = useCategorias("gasto", ETIQUETAS_GASTO);
  const ingresos = useCategorias("ingreso", ETIQUETAS_INGRESO);
  const { metas } = useMetas();

  useEffect(() => {
    const alPresionar = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCerrar();
    };
    window.addEventListener("keydown", alPresionar);
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", alPresionar);
      document.body.style.overflow = overflowPrevio;
    };
  }, [onCerrar]);

  const categorias = tipo === "gasto" ? gastos : ingresos;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/60 px-4 py-10 sm:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-nuevo-movimiento"
        className="w-full max-w-lg border-2 border-ink bg-paper dark:border-ink-dark dark:bg-paper-dark"
      >
        <div className="flex items-center justify-between border-b-2 border-ink px-6 py-4 dark:border-ink-dark">
          <h2 id="titulo-nuevo-movimiento" className="text-xl text-ink dark:text-ink-dark">
            Nuevo movimiento
          </h2>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="p-1 text-ink hover:text-accent dark:text-ink-dark"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div
            role="radiogroup"
            aria-label="Tipo de movimiento"
            className="segmentado mb-6 grid w-full grid-cols-3"
          >
            {TIPOS.map(({ valor, label }) => (
              <button
                key={valor}
                type="button"
                role="radio"
                aria-checked={tipo === valor}
                onClick={() => setTipo(valor)}
                className="segmento py-2"
              >
                {label}
              </button>
            ))}
          </div>

          <MovimientoForm
            key={tipo}
            tipo={tipo}
            variante="select"
            embebido
            categorias={categorias.categorias}
            metas={metas.map((m) => ({ id: m.id, nombre: m.nombreMeta }))}
            metaInicial={inicial.metaId}
            onAgregar={async (nuevo) => {
              const creado = await crearMovimiento(nuevo);
              if (!creado) return false;
              onCerrar();
              return true;
            }}
          />
        </div>
      </div>
    </div>
  );
}
