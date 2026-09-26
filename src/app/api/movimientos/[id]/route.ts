import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma
    .$transaction(async (tx) => {
      const eliminado = await tx.movimiento.delete({ where: { id } });
      // Revierte el abono en la meta, sin dejarla por debajo de 0
      if (eliminado.tipo === "AHORRO" && eliminado.metaId) {
        const meta = await tx.metaAhorro.findUnique({ where: { id: eliminado.metaId } });
        if (meta) {
          await tx.metaAhorro.update({
            where: { id: meta.id },
            data: { montoActual: Math.max(0, meta.montoActual - eliminado.monto) },
          });
        }
      }
    })
    .catch(() => null);

  return NextResponse.json({ ok: true });
}
