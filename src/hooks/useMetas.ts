"use client";

import { useCallback, useEffect, useState } from "react";
import { MetaAhorro, PlanQuincenal } from "@/types/ahorro";
import { avisarCambio, useAlCambiar } from "@/lib/eventos";

type CambiosMeta = Partial<Pick<MetaAhorro, "nombreMeta" | "montoObjetivo" | "fase">> & {
  planQuincenal?: PlanQuincenal;
};

export function useMetas() {
  const [metas, setMetas] = useState<MetaAhorro[]>([]);
  const [cargando, setCargando] = useState(true);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelado = false;
    fetch("/api/metas")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: MetaAhorro[]) => {
        if (!cancelado) setMetas(data);
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });
    return () => {
      cancelado = true;
    };
  }, [version]);

  // Un abono o su eliminación cambian el monto actual de una meta
  useAlCambiar(() => setVersion((v) => v + 1));

  const crear = useCallback(async (datos: { fase?: number } = {}) => {
    const res = await fetch("/api/metas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    const nueva: MetaAhorro = await res.json();
    setMetas((prev) => [...prev, nueva]);
    return nueva.id;
  }, []);

  const eliminar = useCallback(async (id: string) => {
    setMetas((prev) => prev.filter((m) => m.id !== id));
    await fetch(`/api/metas/${id}`, { method: "DELETE" });
    avisarCambio();
  }, []);

  const actualizar = useCallback(async (id: string, cambios: CambiosMeta) => {
    setMetas((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              ...cambios,
              planQuincenal: cambios.planQuincenal ?? m.planQuincenal,
            }
          : m
      )
    );
    await fetch(`/api/metas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cambios),
    });
  }, []);

  return { metas, cargando, crear, eliminar, actualizar };
}
