"use client";

import { useMemo } from "react";
import { ETIQUETAS_GASTO, ETIQUETAS_INGRESO } from "@/types/finanzas";
import {
  agruparPorEtiqueta,
  agruparPorMes,
  diasRestantesDelMes,
  esDelMesActual,
  sumarMontos,
} from "@/lib/finanzas";
import { useMovimientos } from "@/hooks/useMovimientos";
import { useCategorias } from "@/hooks/useCategorias";
import { useMetas } from "@/hooks/useMetas";
import { useSuscripciones } from "@/hooks/useSuscripciones";
import { usePrivacidad } from "@/components/layout/PrivacidadProvider";
import DesgloseEtiquetas from "@/components/finanzas/DesgloseEtiquetas";
import HistorialMovimientos from "@/components/finanzas/HistorialMovimientos";
import ResumenMes from "@/components/resumen/ResumenMes";
import Tendencia from "@/components/resumen/Tendencia";
import Presupuesto, { FilaPresupuesto } from "@/components/resumen/Presupuesto";
import Suscripciones from "@/components/resumen/Suscripciones";
import Metas from "@/components/resumen/Metas";
import TituloSeccion from "@/components/resumen/TituloSeccion";

export default function ResumenPage() {
  const { formato } = usePrivacidad();
  const { movimientos, cargando: cargandoMovimientos, eliminar } = useMovimientos();
  const gastos = useCategorias("gasto", ETIQUETAS_GASTO);
  // Carga categorías de ingreso guardadas para que sigan disponibles en otras vistas
  useCategorias("ingreso", ETIQUETAS_INGRESO);
  const { metas, cargando: cargandoMetas } = useMetas();
  const suscripciones = useSuscripciones();

  const cargando = cargandoMovimientos || cargandoMetas;

  const datos = useMemo(() => {
    const delMes = movimientos.filter((m) => esDelMesActual(m.fecha));
    const porTipo = (tipo: string) => delMes.filter((m) => m.tipo === tipo);
    const ingresosMes = porTipo("ingreso");
    const gastosMes = porTipo("gasto");

    const gastadoPorCategoria = new Map(
      agruparPorEtiqueta(gastosMes).map((g) => [g.etiqueta, g.total])
    );
    const nombres = Array.from(new Set([...gastos.categorias, ...gastadoPorCategoria.keys()]));
    const filas: FilaPresupuesto[] = nombres
      .map((categoria) => ({
        categoria,
        gastado: gastadoPorCategoria.get(categoria) ?? 0,
        tope: gastos.presupuestos[categoria] ?? 0,
      }))
      .sort((a, b) => b.gastado - a.gastado || a.categoria.localeCompare(b.categoria));

    return {
      ingresos: sumarMontos(ingresosMes),
      gastos: sumarMontos(gastosMes),
      ahorro: sumarMontos(porTipo("ahorro")),
      fuentes: agruparPorEtiqueta(ingresosMes),
      filas,
      presupuestoTotal: filas.reduce((acc, f) => acc + f.tope, 0),
      excedidas: filas.filter((f) => f.tope > 0 && f.gastado > f.tope).length,
      meses: agruparPorMes(movimientos, 6),
    };
  }, [movimientos, gastos.categorias, gastos.presupuestos]);

  return (
    <main className="mx-auto max-w-reticula px-4 py-8">
      <h1 className="sr-only">Resumen</h1>

      {cargando ? (
        <div className="reticula">
          <div className="celda text-sm text-ink-soft dark:text-ink-soft-dark">Cargando resumen…</div>
        </div>
      ) : (
        <div className="reticula lg:grid-cols-3">
          {/* 1 · Resumen del mes */}
          <section aria-label="Resumen del mes" className="grid gap-0.5 lg:col-span-3">
            <ResumenMes
              ingresos={datos.ingresos}
              gastos={datos.gastos}
              ahorro={datos.ahorro}
              presupuestoTotal={datos.presupuestoTotal}
              categoriasExcedidas={datos.excedidas}
              diasRestantes={diasRestantesDelMes()}
            />
          </section>

          {/* 2 · Tendencia */}
          <section aria-label="Tendencia" className="grid lg:col-span-2">
            <Tendencia meses={datos.meses} />
          </section>

          {/* 3 · Ingresos */}
          <section aria-label="Ingresos" className="celda">
            <TituloSeccion titulo="Ingresos" nota="Por fuente, este mes" />
            <p className="mb-5 whitespace-nowrap font-mono text-3xl font-extrabold tracking-titular text-ink dark:text-ink-dark">
              {formato(datos.ingresos)}
            </p>
            <DesgloseEtiquetas datos={datos.fuentes} embebido />
          </section>

          {/* 4 · Presupuesto */}
          <section aria-label="Presupuesto" className="grid lg:col-span-2">
            <Presupuesto filas={datos.filas} onEditarTope={gastos.actualizarPresupuesto} />
          </section>

          {/* 5 · Suscripciones */}
          <section aria-label="Suscripciones" className="grid">
            <Suscripciones
              suscripciones={suscripciones.suscripciones}
              onCrear={suscripciones.crear}
              onEliminar={suscripciones.eliminar}
            />
          </section>

          {/* 6 · Metas de ahorro */}
          <div className="grid gap-0.5 lg:col-span-3">
            <Metas metas={metas} />
          </div>

          {/* 7 · Movimientos */}
          <section aria-label="Movimientos" className="celda lg:col-span-3">
            <TituloSeccion titulo="Movimientos" />
            <HistorialMovimientos movimientos={movimientos} onEliminar={eliminar} embebido />
          </section>
        </div>
      )}
    </main>
  );
}
