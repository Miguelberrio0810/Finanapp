import { Suscripcion } from "@/types/finanzas";

export function validarSuscripcion(
  body: unknown
): Omit<Suscripcion, "id"> | null {
  const { nombre, monto, diaCobro } = (body ?? {}) as Record<string, unknown>;
  if (
    typeof nombre !== "string" ||
    !nombre.trim() ||
    typeof monto !== "number" ||
    !Number.isInteger(monto) ||
    monto <= 0 ||
    typeof diaCobro !== "number" ||
    !Number.isInteger(diaCobro) ||
    diaCobro < 1 ||
    diaCobro > 31
  ) {
    return null;
  }
  return { nombre: nombre.trim(), monto, diaCobro };
}

/** Día efectivo de cobro en un mes dado (un cobro el 31 cae el último día en meses cortos). */
function diaEnMes(diaCobro: number, anio: number, mes: number): number {
  return Math.min(diaCobro, new Date(anio, mes + 1, 0).getDate());
}

export function estadoCobro(
  diaCobro: number,
  hoy: Date = new Date()
): { cobrado: boolean; diasRestantes: number } {
  const anio = hoy.getFullYear();
  const mes = hoy.getMonth();
  const inicioHoy = new Date(anio, mes, hoy.getDate());
  const diaEsteMes = diaEnMes(diaCobro, anio, mes);

  if (hoy.getDate() >= diaEsteMes) {
    const proximo = new Date(anio, mes + 1, diaEnMes(diaCobro, anio, mes + 1));
    const dias = Math.round((proximo.getTime() - inicioHoy.getTime()) / 86_400_000);
    return { cobrado: true, diasRestantes: dias };
  }

  const proximo = new Date(anio, mes, diaEsteMes);
  const dias = Math.round((proximo.getTime() - inicioHoy.getTime()) / 86_400_000);
  return { cobrado: false, diasRestantes: dias };
}
