import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { mapMetaAhorro } from "@/lib/api-utils";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const data: Prisma.MetaAhorroUpdateInput = {};

  if (typeof body?.nombreMeta === "string" && body.nombreMeta.trim()) {
    data.nombreMeta = body.nombreMeta.trim();
  }
  if (typeof body?.montoObjetivo === "number" && body.montoObjetivo >= 0) {
    data.montoObjetivo = body.montoObjetivo;
  }
  if (typeof body?.planQuincenal?.monto15 === "number" && body.planQuincenal.monto15 >= 0) {
    data.monto15 = body.planQuincenal.monto15;
  }
  if (typeof body?.planQuincenal?.monto30 === "number" && body.planQuincenal.monto30 >= 0) {
    data.monto30 = body.planQuincenal.monto30;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nada que actualizar" }, { status: 400 });
  }

  const actualizado = await prisma.metaAhorro
    .update({ where: { id }, data })
    .catch(() => null);

  if (!actualizado) {
    return NextResponse.json({ error: "Meta no encontrada" }, { status: 404 });
  }

  return NextResponse.json(mapMetaAhorro(actualizado));
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.metaAhorro.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
