import { NextRequest, NextResponse } from "next/server";
import {
  MetaAhorro as MetaAhorroDB,
  Movimiento as MovimientoDB,
  Suscripcion as SuscripcionDB,
} from "@prisma/client";
import { MetaAhorro } from "@/types/ahorro";
import { Movimiento, Suscripcion, TipoMovimiento } from "@/types/finanzas";
import { COOKIE_SESION, leerEmailSesion } from "@/lib/session";

export type TipoMovimientoUI = TipoMovimiento;
type TipoPrisma = "INGRESO" | "GASTO" | "AHORRO";

export function tipoPrisma(tipo: unknown): TipoPrisma | null {
  if (tipo === "ingreso") return "INGRESO";
  if (tipo === "gasto") return "GASTO";
  if (tipo === "ahorro") return "AHORRO";
  return null;
}

export function tipoUI(tipo: TipoPrisma): TipoMovimientoUI {
  return tipo.toLowerCase() as TipoMovimientoUI;
}

/**
 * El proxy ya bloquea las rutas sin sesión; esto es una segunda barrera
 * y además entrega el email del usuario para las tablas que lo guardan.
 */
export async function requerirSesion(
  req: NextRequest
): Promise<{ email: string } | NextResponse> {
  const token = req.cookies.get(COOKIE_SESION.nombre)?.value;
  const email = token ? await leerEmailSesion(token) : null;
  if (!email) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }
  return { email };
}

export function mapMetaAhorro(m: MetaAhorroDB): MetaAhorro {
  return {
    id: m.id,
    nombreMeta: m.nombreMeta,
    montoObjetivo: m.montoObjetivo,
    montoActual: m.montoActual,
    planQuincenal: { monto15: m.monto15, monto30: m.monto30 },
    fase: m.fase,
  };
}

export function mapMovimiento(m: MovimientoDB): Movimiento {
  return {
    id: m.id,
    descripcion: m.descripcion,
    monto: m.monto,
    etiqueta: m.etiqueta,
    fecha: m.fecha,
    tipo: tipoUI(m.tipo),
    metaId: m.metaId,
  };
}

export function mapSuscripcion(s: SuscripcionDB): Suscripcion {
  return { id: s.id, nombre: s.nombre, monto: s.monto, diaCobro: s.diaCobro };
}
