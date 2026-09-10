import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { tipoPrisma } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  const tipo = tipoPrisma(req.nextUrl.searchParams.get("tipo"));
  if (!tipo) {
    return NextResponse.json({ error: "Parámetro tipo inválido" }, { status: 400 });
  }

  const movimientos = await prisma.movimiento.findMany({
    where: { tipo },
    orderBy: { fecha: "desc" },
  });

  return NextResponse.json(movimientos);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const tipo = tipoPrisma(body?.tipo);
  const { descripcion, monto, etiqueta, fecha } = body ?? {};

  if (
    !tipo ||
    typeof descripcion !== "string" ||
    !descripcion.trim() ||
    typeof monto !== "number" ||
    monto <= 0 ||
    typeof etiqueta !== "string" ||
    !etiqueta.trim() ||
    typeof fecha !== "string" ||
    !fecha
  ) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const creado = await prisma.movimiento.create({
    data: { tipo, descripcion: descripcion.trim(), monto, etiqueta: etiqueta.trim(), fecha },
  });

  return NextResponse.json(creado, { status: 201 });
}
