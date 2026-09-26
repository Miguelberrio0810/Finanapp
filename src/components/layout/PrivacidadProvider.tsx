"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { formatCOP } from "@/lib/utils";

const CLAVE = "finanapp:modo-privado";
const EVENTO = "finanapp:privacidad";
export const MONTO_OCULTO = "$ ••••••";

function suscribir(avisar: () => void) {
  window.addEventListener("storage", avisar);
  window.addEventListener(EVENTO, avisar);
  return () => {
    window.removeEventListener("storage", avisar);
    window.removeEventListener(EVENTO, avisar);
  };
}

function leerPreferencia(): boolean {
  try {
    return localStorage.getItem(CLAVE) === "1";
  } catch {
    return false;
  }
}

interface PrivacidadContexto {
  oculto: boolean;
  alternar: () => void;
  formato: (monto: number) => string;
}

const Contexto = createContext<PrivacidadContexto>({
  oculto: false,
  alternar: () => {},
  formato: formatCOP,
});

export function PrivacidadProvider({ children }: { children: React.ReactNode }) {
  const oculto = useSyncExternalStore(suscribir, leerPreferencia, () => false);

  const alternar = useCallback(() => {
    try {
      localStorage.setItem(CLAVE, leerPreferencia() ? "0" : "1");
    } catch {
      // Sin almacenamiento disponible: el modo privado no persiste.
    }
    window.dispatchEvent(new Event(EVENTO));
  }, []);

  const valor = useMemo<PrivacidadContexto>(
    () => ({
      oculto,
      alternar,
      formato: (monto: number) => (oculto ? MONTO_OCULTO : formatCOP(monto)),
    }),
    [oculto, alternar]
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function usePrivacidad() {
  return useContext(Contexto);
}
