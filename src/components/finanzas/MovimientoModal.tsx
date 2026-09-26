"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { ETIQUETAS_GASTO, ETIQUETAS_INGRESO, TipoMovimiento } from "@/types/finanzas";
import MovimientoForm from "@/components/finanzas/MovimientoForm";
import Dialogo from "@/components/layout/Dialogo";
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

  const categorias = tipo === "gasto" ? gastos : ingresos;

  return (
    <Dialogo titulo="Nuevo movimiento" onCerrar={onCerrar}>
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
    </Dialogo>
  );
}
