import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapSuscripcion, requerirSesion } from "@/lib/api-utils";
import { validarSuscripcion } from "@/lib/suscripciones";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const sesion = await requerirSesion(req);
  if (sesion instanceof NextResponse) return sesion;

  const { id } = await params;
  const datos = validarSuscripcion(await req.json().catch(() => null));
  if (!datos) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const { count } = await prisma.suscripcion.updateMany({
    where: { id, userId: sesion.email },
    data: datos,
  });
  if (count === 0) {
    return NextResponse.json({ error: "Suscripción no encontrada" }, { status: 404 });
  }

  const actualizada = await prisma.suscripcion.findUniqueOrThrow({ where: { id } });
  return NextResponse.json(mapSuscripcion(actualizada));
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const sesion = await requerirSesion(req);
  if (sesion instanceof NextResponse) return sesion;

  const { id } = await params;
  await prisma.suscripcion.deleteMany({ where: { id, userId: sesion.email } });
  return NextResponse.json({ ok: true });
}
