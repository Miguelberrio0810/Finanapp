"use client";

import { useCallback, useEffect, useState } from "react";
import { Movimiento, TipoMovimiento } from "@/types/finanzas";
import { avisarCambio, useAlCambiar } from "@/lib/eventos";

export type NuevoMovimiento = Omit<Movimiento, "id">;

/** Sin `tipo` trae todos los movimientos (ingresos, gastos y abonos). */
export function useMovimientos(tipo?: TipoMovimiento) {
  const clave = tipo ?? "todos";
  const [estado, setEstado] = useState<{ clave: string; movimientos: Movimiento[] } | null>(
    null
  );
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelado = false;
    const url = tipo ? `/api/movimientos?tipo=${tipo}` : "/api/movimientos";

    fetch(url)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Movimiento[]) => {
        if (!cancelado) setEstado({ clave, movimientos: data });
      })
      .catch(() => {
        if (!cancelado) setEstado({ clave, movimientos: [] });
      });

    return () => {
      cancelado = true;
    };
  }, [tipo, clave, version]);

  useAlCambiar(() => setVersion((v) => v + 1));

  const cargando = estado?.clave !== clave;
  const movimientos = estado?.clave === clave ? estado.movimientos : [];

  const agregar = useCallback(
    async (nuevo: NuevoMovimiento): Promise<boolean> => {
      const res = await fetch("/api/movimientos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...nuevo, tipo: nuevo.tipo ?? tipo }),
      });
      if (!res.ok) return false;
      const creado: Movimiento = await res.json();
      setEstado((prev) =>
        prev && (!tipo || creado.tipo === tipo)
          ? { ...prev, movimientos: [creado, ...prev.movimientos] }
          : prev
      );
      avisarCambio();
      return true;
    },
    [tipo]
  );

  const eliminar = useCallback(async (id: string) => {
    setEstado((prev) =>
      prev ? { ...prev, movimientos: prev.movimientos.filter((m) => m.id !== id) } : prev
    );
    await fetch(`/api/movimientos/${id}`, { method: "DELETE" });
    avisarCambio();
  }, []);

  return { movimientos, cargando, agregar, eliminar };
}
