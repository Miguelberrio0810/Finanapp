"use client";

import { ArrowUpCircle, Wallet } from "lucide-react";
import { ETIQUETAS_INGRESO } from "@/types/finanzas";
import { esDelMesActual, sumarMontos } from "@/lib/finanzas";
import MovimientoForm from "@/components/finanzas/MovimientoForm";
import HistorialMovimientos from "@/components/finanzas/HistorialMovimientos";
import StatCard from "@/components/finanzas/StatCard";
import EncabezadoPagina from "@/components/layout/EncabezadoPagina";
import { usePrivacidad } from "@/components/layout/PrivacidadProvider";
import { useMovimientos } from "@/hooks/useMovimientos";
import { useCategorias } from "@/hooks/useCategorias";

export default function IngresosPage() {
  const { formato } = usePrivacidad();
  const { movimientos: ingresos, cargando, agregar, eliminar } = useMovimientos("ingreso");
  const { categorias, crear: crearCategoria } = useCategorias("ingreso", ETIQUETAS_INGRESO);

  const acumuladoMes = sumarMontos(ingresos.filter((i) => esDelMesActual(i.fecha)));
  const totalHistorico = sumarMontos(ingresos);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <EncabezadoPagina
        icon={ArrowUpCircle}
        titulo="Ingresos"
        descripcion="Registra tus entradas de dinero y su acumulado mensual"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <MovimientoForm
          tipo="ingreso"
          categorias={categorias}
          onAgregar={agregar}
          onCrearCategoria={crearCategoria}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1">
          <StatCard icon={Wallet} etiqueta="Acumulado este mes" valor={formato(acumuladoMes)} color="ingreso" />
          <StatCard icon={ArrowUpCircle} etiqueta="Total registrado" valor={formato(totalHistorico)} color="ahorro" />
        </div>
      </div>

      {cargando ? (
        <div className="ticket text-sm text-ink-soft dark:text-ink-soft-dark">Cargando movimientos…</div>
      ) : (
        <HistorialMovimientos movimientos={ingresos} tipo="ingreso" onEliminar={eliminar} />
      )}
    </div>
  );
}
