"use client";

import { useCallback, useEffect, useState } from "react";

export function useCategorias(tipo: "ingreso" | "gasto", defaults: readonly string[]) {
  const [categorias, setCategorias] = useState<string[]>([...defaults]);

  useEffect(() => {
    let cancelado = false;

    fetch(`/api/categorias?tipo=${tipo}`)
      .then((res) => res.json())
      .then((data: string[]) => {
        if (cancelado) return;
        setCategorias((prev) => Array.from(new Set([...prev, ...data])));
      });

    return () => {
      cancelado = true;
    };
  }, [tipo]);

  const crear = useCallback(
    async (nombre: string) => {
      setCategorias((prev) => (prev.includes(nombre) ? prev : [...prev, nombre]));
      await fetch("/api/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, nombre }),
      });
    },
    [tipo]
  );

  return { categorias, crear };
}
