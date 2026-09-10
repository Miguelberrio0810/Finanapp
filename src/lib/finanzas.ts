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
