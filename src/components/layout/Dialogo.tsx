"use client";

import { useEffect, useId } from "react";
import { X } from "lucide-react";

interface DialogoProps {
  titulo: string;
  onCerrar: () => void;
  children: React.ReactNode;
  ancho?: "md" | "lg";
}

/** Diálogo plano: marco de 2px, cabecera con regla y cierre con Escape o clic fuera. */
export default function Dialogo({ titulo, onCerrar, children, ancho = "md" }: DialogoProps) {
  const idTitulo = useId();

  useEffect(() => {
    const alPresionar = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCerrar();
    };
    window.addEventListener("keydown", alPresionar);
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", alPresionar);
      document.body.style.overflow = overflowPrevio;
    };
  }, [onCerrar]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/60 px-4 py-10 sm:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        className={`w-full border-2 border-ink bg-paper dark:border-ink-dark dark:bg-paper-dark ${
          ancho === "lg" ? "max-w-3xl" : "max-w-lg"
        }`}
      >
        <div className="flex items-center justify-between gap-4 border-b-2 border-ink px-6 py-4 dark:border-ink-dark">
          <h2 id={idTitulo} className="text-xl text-ink dark:text-ink-dark">
            {titulo}
          </h2>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="p-1 text-ink hover:text-accent dark:text-ink-dark"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
