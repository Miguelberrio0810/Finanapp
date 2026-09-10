"use client";

import { ArrowUpCircle, Wallet } from "lucide-react";
import { ETIQUETAS_INGRESO } from "@/types/finanzas";
import { formatCOP } from "@/lib/utils";
import { esDelMesActual, sumarMontos } from "@/lib/finanzas";
import MovimientoForm from "@/components/finanzas/MovimientoForm";
import HistorialMovimientos from "@/components/finanzas/HistorialMovimientos";
import StatCard from "@/components/finanzas/StatCard";
import { useMovimientos } from "@/hooks/useMovimientos";
import { useCategorias } from "@/hooks/useCategorias";

export default function IngresosPage() {
  const { movimientos: ingresos, cargando, agregar, eliminar } = useMovimientos("ingreso");
  const { categorias, crear: crearCategoria } = useCategorias("ingreso", ETIQUETAS_INGRESO);

  const acumuladoMes = sumarMontos(ingresos.filter((i) => esDelMesActual(i.fecha)));
  const totalHistorico = sumarMontos(ingresos);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <header className="flex items-center gap-3">
        <div className="rounded-full border-2 border-ingreso p-2.5 text-ingreso dark:border-ingreso-dark dark:text-ingreso-dark">
          <ArrowUpCircle className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink dark:text-ink-dark">
            Ingresos
          </h1>
          <p className="text-sm text-ink-soft dark:text-ink-soft-dark">
            Registra tus entradas de dinero y su acumulado mensual
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <MovimientoForm
          categorias={categorias}
          color="ingreso"
          onAgregar={agregar}
          onCrearCategoria={crearCategoria}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1">
          <StatCard
            icon={Wallet}
            etiqueta="Acumulado este mes"
            valor={formatCOP(acumuladoMes)}
            color="ingreso"
          />
          <StatCard
            icon={ArrowUpCircle}
            etiqueta="Total registrado"
            valor={formatCOP(totalHistorico)}
            color="ahorro"
          />
        </div>
      </div>

      {cargando ? (
        <div className="ticket text-center text-sm text-ink-soft dark:text-ink-soft-dark">
          Cargando movimientos…
        </div>
      ) : (
        <HistorialMovimientos
          movimientos={ingresos}
          tipo="ingreso"
          onEliminar={eliminar}
        />
      )}
    </div>
  );
}
