"use client";

import { useCallback, useEffect, useState } from "react";
import { MetaAhorro, PlanQuincenal } from "@/types/ahorro";

type CambiosMeta = Partial<Pick<MetaAhorro, "nombreMeta" | "montoObjetivo">> & {
  planQuincenal?: PlanQuincenal;
};

export function useMetas() {
  const [metas, setMetas] = useState<MetaAhorro[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("/api/metas")
      .then((res) => res.json())
      .then((data: MetaAhorro[]) => setMetas(data))
      .finally(() => setCargando(false));
  }, []);

  const crear = useCallback(async () => {
    const res = await fetch("/api/metas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const nueva: MetaAhorro = await res.json();
    setMetas((prev) => [...prev, nueva]);
    return nueva.id;
  }, []);

  const eliminar = useCallback(async (id: string) => {
    setMetas((prev) => prev.filter((m) => m.id !== id));
    await fetch(`/api/metas/${id}`, { method: "DELETE" });
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
