import { MetaAhorro as MetaAhorroDB } from "@prisma/client";
import { MetaAhorro } from "@/types/ahorro";

export type TipoMovimientoUI = "ingreso" | "gasto";

export function tipoPrisma(tipo: unknown): "INGRESO" | "GASTO" | null {
  if (tipo === "ingreso") return "INGRESO";
  if (tipo === "gasto") return "GASTO";
  return null;
}

export function mapMetaAhorro(m: MetaAhorroDB): MetaAhorro {
  return {
    id: m.id,
    nombreMeta: m.nombreMeta,
    montoObjetivo: m.montoObjetivo,
    montoActual: m.montoActual,
    planQuincenal: { monto15: m.monto15, monto30: m.monto30 },
  };
}
