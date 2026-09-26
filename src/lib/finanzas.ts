import { Movimiento } from "@/types/finanzas";

export function formatearFechaISO(fecha: Date): string {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

function parsearFechaLocal(fechaISO: string): Date {
  return new Date(`${fechaISO}T00:00:00`);
}

export function formatearFechaCorta(fechaISO: string): string {
  return parsearFechaLocal(fechaISO).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function esDelMesActual(fechaISO: string, base: Date = new Date()): boolean {
  const fecha = parsearFechaLocal(fechaISO);
  return (
    fecha.getFullYear() === base.getFullYear() &&
    fecha.getMonth() === base.getMonth()
  );
}

export function sumarMontos(movimientos: Movimiento[]): number {
  return movimientos.reduce((acc, m) => acc + m.monto, 0);
}

export function agruparPorEtiqueta(
  movimientos: Movimiento[]
): { etiqueta: string; total: number }[] {
  const mapa = new Map<string, number>();
  for (const m of movimientos) {
    mapa.set(m.etiqueta, (mapa.get(m.etiqueta) ?? 0) + m.monto);
  }
  return Array.from(mapa.entries())
    .map(([etiqueta, total]) => ({ etiqueta, total }))
    .sort((a, b) => b.total - a.total);
}

export interface ResumenMes {
  clave: string; // YYYY-MM
  etiqueta: string; // "sep"
  ingresos: number;
  gastos: number;
  ahorro: number;
  neto: number; // ingresos − gastos
}

/** Totales de los últimos `meses` meses (incluido el actual), del más antiguo al más reciente. */
export function agruparPorMes(
  movimientos: Movimiento[],
  meses = 6,
  base: Date = new Date()
): ResumenMes[] {
  const resultado: ResumenMes[] = [];
  const indice = new Map<string, ResumenMes>();

  for (let i = meses - 1; i >= 0; i--) {
    const fecha = new Date(base.getFullYear(), base.getMonth() - i, 1);
    const clave = formatearFechaISO(fecha).slice(0, 7);
    const mes: ResumenMes = {
      clave,
      etiqueta: fecha.toLocaleDateString("es-CO", { month: "short" }).replace(".", ""),
      ingresos: 0,
      gastos: 0,
      ahorro: 0,
      neto: 0,
    };
    resultado.push(mes);
    indice.set(clave, mes);
  }

  for (const m of movimientos) {
    const mes = indice.get(m.fecha.slice(0, 7));
    if (!mes) continue;
    if (m.tipo === "ingreso") mes.ingresos += m.monto;
    else if (m.tipo === "gasto") mes.gastos += m.monto;
    else if (m.tipo === "ahorro") mes.ahorro += m.monto;
  }

  for (const mes of resultado) mes.neto = mes.ingresos - mes.gastos;
  return resultado;
}

export function diasRestantesDelMes(base: Date = new Date()): number {
  const ultimoDia = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
  return ultimoDia - base.getDate();
}
