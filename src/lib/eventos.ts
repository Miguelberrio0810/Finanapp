"use client";

import { useEffect, useRef } from "react";

const EVENTO_CAMBIO = "finanapp:datos-cambiaron";

/** Avisa a todos los hooks montados que los datos del servidor cambiaron. */
export function avisarCambio() {
  window.dispatchEvent(new Event(EVENTO_CAMBIO));
}

/** Ejecuta `alCambiar` cada vez que alguien llama a `avisarCambio()`. */
export function useAlCambiar(alCambiar: () => void) {
  const ref = useRef(alCambiar);

  useEffect(() => {
    ref.current = alCambiar;
  });

  useEffect(() => {
    const manejador = () => ref.current();
    window.addEventListener(EVENTO_CAMBIO, manejador);
    return () => window.removeEventListener(EVENTO_CAMBIO, manejador);
  }, []);
}
