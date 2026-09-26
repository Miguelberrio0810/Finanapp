"use client";

import { useCallback, useEffect, useState } from "react";
import { Suscripcion } from "@/types/finanzas";

type DatosSuscripcion = Omit<Suscripcion, "id">;

export function useSuscripciones() {
  const [suscripciones, setSuscripciones] = useState<Suscripcion[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let cancelado = false;
    fetch("/api/suscripciones")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Suscripcion[]) => {
        if (!cancelado) setSuscripciones(data);
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });
    return () => {
      cancelado = true;
    };
  }, []);

  const ordenar = (lista: Suscripcion[]) =>
    [...lista].sort((a, b) => a.diaCobro - b.diaCobro);

  const crear = useCallback(async (datos: DatosSuscripcion) => {
    const res = await fetch("/api/suscripciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    if (!res.ok) return false;
    const creada: Suscripcion = await res.json();
    setSuscripciones((prev) => ordenar([...prev, creada]));
    return true;
  }, []);

  const actualizar = useCallback(async (id: string, datos: DatosSuscripcion) => {
    setSuscripciones((prev) => ordenar(prev.map((s) => (s.id === id ? { ...s, ...datos } : s))));
    await fetch(`/api/suscripciones/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
  }, []);

  const eliminar = useCallback(async (id: string) => {
    setSuscripciones((prev) => prev.filter((s) => s.id !== id));
    await fetch(`/api/suscripciones/${id}`, { method: "DELETE" });
  }, []);

  return { suscripciones, cargando, crear, actualizar, eliminar };
}
