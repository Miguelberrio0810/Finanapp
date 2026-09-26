"use client";

import { ArrowDownCircle, ShoppingBag } from "lucide-react";
import { ETIQUETAS_GASTO } from "@/types/finanzas";
import { agruparPorEtiqueta, esDelMesActual, sumarMontos } from "@/lib/finanzas";
import MovimientoForm from "@/components/finanzas/MovimientoForm";
import HistorialMovimientos from "@/components/finanzas/HistorialMovimientos";
import StatCard from "@/components/finanzas/StatCard";
import DesgloseEtiquetas from "@/components/finanzas/DesgloseEtiquetas";
import EncabezadoPagina from "@/components/layout/EncabezadoPagina";
import { usePrivacidad } from "@/components/layout/PrivacidadProvider";
import { useMovimientos } from "@/hooks/useMovimientos";
import { useCategorias } from "@/hooks/useCategorias";

export default function GastosPage() {
  const { formato } = usePrivacidad();
  const { movimientos: gastos, cargando, agregar, eliminar } = useMovimientos("gasto");
  const { categorias, crear: crearCategoria } = useCategorias("gasto", ETIQUETAS_GASTO);

  const gastadoMes = sumarMontos(gastos.filter((g) => esDelMesActual(g.fecha)));
  const totalHistorico = sumarMontos(gastos);
  const desglose = agruparPorEtiqueta(gastos);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <EncabezadoPagina
        icon={ArrowDownCircle}
        titulo="Gastos"
        descripcion="Registra tus egresos y su desglose por etiqueta"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <MovimientoForm
          tipo="gasto"
          categorias={categorias}
          onAgregar={agregar}
          onCrearCategoria={crearCategoria}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1">
          <StatCard icon={ShoppingBag} etiqueta="Gastado este mes" valor={formato(gastadoMes)} color="gasto" />
          <StatCard icon={ArrowDownCircle} etiqueta="Total registrado" valor={formato(totalHistorico)} color="ahorro" />
        </div>
      </div>

      {cargando ? (
        <div className="ticket text-sm text-ink-soft dark:text-ink-soft-dark">Cargando movimientos…</div>
      ) : (
        <>
          <DesgloseEtiquetas datos={desglose} />
          <HistorialMovimientos movimientos={gastos} tipo="gasto" onEliminar={eliminar} />
        </>
      )}
    </div>
  );
}
