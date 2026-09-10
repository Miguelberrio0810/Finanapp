"use client";

import { ArrowDownCircle, ShoppingBag } from "lucide-react";
import { ETIQUETAS_GASTO } from "@/types/finanzas";
import { formatCOP } from "@/lib/utils";
import { agruparPorEtiqueta, esDelMesActual, sumarMontos } from "@/lib/finanzas";
import MovimientoForm from "@/components/finanzas/MovimientoForm";
import HistorialMovimientos from "@/components/finanzas/HistorialMovimientos";
import StatCard from "@/components/finanzas/StatCard";
import DesgloseEtiquetas from "@/components/finanzas/DesgloseEtiquetas";
import { useMovimientos } from "@/hooks/useMovimientos";
import { useCategorias } from "@/hooks/useCategorias";

export default function GastosPage() {
  const { movimientos: gastos, cargando, agregar, eliminar } = useMovimientos("gasto");
  const { categorias, crear: crearCategoria } = useCategorias("gasto", ETIQUETAS_GASTO);

  const gastadoMes = sumarMontos(gastos.filter((g) => esDelMesActual(g.fecha)));
  const totalHistorico = sumarMontos(gastos);
  const desglose = agruparPorEtiqueta(gastos);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <header className="flex items-center gap-3">
        <div className="rounded-full border-2 border-gasto p-2.5 text-gasto dark:border-gasto-dark dark:text-gasto-dark">
          <ArrowDownCircle className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink dark:text-ink-dark">
            Gastos
          </h1>
          <p className="text-sm text-ink-soft dark:text-ink-soft-dark">
            Registra tus egresos y su desglose por etiqueta
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <MovimientoForm
          categorias={categorias}
          color="gasto"
          onAgregar={agregar}
          onCrearCategoria={crearCategoria}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1">
          <StatCard
            icon={ShoppingBag}
            etiqueta="Gastado este mes"
            valor={formatCOP(gastadoMes)}
            color="gasto"
          />
          <StatCard
            icon={ArrowDownCircle}
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
        <>
          <DesgloseEtiquetas datos={desglose} />

          <HistorialMovimientos
            movimientos={gastos}
            tipo="gasto"
            onEliminar={eliminar}
          />
        </>
      )}
    </div>
  );
}
