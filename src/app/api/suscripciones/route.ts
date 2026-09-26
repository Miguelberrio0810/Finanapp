import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapSuscripcion, requerirSesion } from "@/lib/api-utils";
import { validarSuscripcion } from "@/lib/suscripciones";

export async function GET(req: NextRequest) {
  const sesion = await requerirSesion(req);
  if (sesion instanceof NextResponse) return sesion;

  const suscripciones = await prisma.suscripcion.findMany({
    where: { userId: sesion.email },
    orderBy: { diaCobro: "asc" },
  });

  return NextResponse.json(suscripciones.map(mapSuscripcion));
}

export async function POST(req: NextRequest) {
  const sesion = await requerirSesion(req);
  if (sesion instanceof NextResponse) return sesion;

  const datos = validarSuscripcion(await req.json().catch(() => null));
  if (!datos) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const creada = await prisma.suscripcion.create({
    data: { ...datos, userId: sesion.email },
  });

  return NextResponse.json(mapSuscripcion(creada), { status: 201 });
}
