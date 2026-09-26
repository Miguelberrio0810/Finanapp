"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Categoria } from "@/types/finanzas";

export function useCategorias(tipo: "ingreso" | "gasto", defaults: readonly string[]) {
  const [guardadas, setGuardadas] = useState<Categoria[]>([]);

  useEffect(() => {
    let cancelado = false;

    fetch(`/api/categorias?tipo=${tipo}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Categoria[]) => {
        if (!cancelado) setGuardadas(data);
      });

    return () => {
      cancelado = true;
    };
  }, [tipo]);

  const categorias = useMemo(
    () => Array.from(new Set([...defaults, ...guardadas.map((c) => c.nombre)])),
    [defaults, guardadas]
  );

  const presupuestos = useMemo(() => {
    const mapa: Record<string, number> = {};
    for (const c of guardadas) mapa[c.nombre] = c.presupuesto;
    return mapa;
  }, [guardadas]);

  const crear = useCallback(
    async (nombre: string) => {
      setGuardadas((prev) =>
        prev.some((c) => c.nombre === nombre) ? prev : [...prev, { nombre, presupuesto: 0 }]
      );
      await fetch("/api/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, nombre }),
      });
    },
    [tipo]
  );

  const actualizarPresupuesto = useCallback(
    async (nombre: string, presupuesto: number) => {
      setGuardadas((prev) =>
        prev.some((c) => c.nombre === nombre)
          ? prev.map((c) => (c.nombre === nombre ? { ...c, presupuesto } : c))
          : [...prev, { nombre, presupuesto }]
      );
      await fetch("/api/categorias", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, nombre, presupuesto }),
      });
    },
    [tipo]
  );

  return { categorias, presupuestos, crear, actualizarPresupuesto };
}
