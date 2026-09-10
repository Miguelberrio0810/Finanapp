"use client";

import { useCallback, useEffect, useState } from "react";
import { Movimiento } from "@/types/finanzas";

export function useMovimientos(tipo: "ingreso" | "gasto") {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let cancelado = false;
    setCargando(true);

    fetch(`/api/movimientos?tipo=${tipo}`)
      .then((res) => res.json())
      .then((data: Movimiento[]) => {
        if (!cancelado) setMovimientos(data);
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [tipo]);

  const agregar = useCallback(
    async (nuevo: Omit<Movimiento, "id">) => {
      const res = await fetch("/api/movimientos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...nuevo, tipo }),
      });
      if (!res.ok) return;
      const creado: Movimiento = await res.json();
      setMovimientos((prev) => [creado, ...prev]);
    },
    [tipo]
  );

  const eliminar = useCallback(async (id: string) => {
    setMovimientos((prev) => prev.filter((m) => m.id !== id));
    await fetch(`/api/movimientos/${id}`, { method: "DELETE" });
  }, []);

  return { movimientos, cargando, agregar, eliminar };
}
