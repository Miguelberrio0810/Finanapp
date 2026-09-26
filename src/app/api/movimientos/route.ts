import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapMovimiento, tipoPrisma } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  const parametro = req.nextUrl.searchParams.get("tipo");
  const tipo = tipoPrisma(parametro);
  // Sin parámetro devuelve todos los movimientos (usado por el resumen)
  if (parametro !== null && !tipo) {
    return NextResponse.json({ error: "Parámetro tipo inválido" }, { status: 400 });
  }

  const movimientos = await prisma.movimiento.findMany({
    where: tipo ? { tipo } : undefined,
    orderBy: [{ fecha: "desc" }, { creadoEn: "desc" }],
  });

  return NextResponse.json(movimientos.map(mapMovimiento));
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const tipo = tipoPrisma(body?.tipo);
  const { descripcion, monto, etiqueta, fecha, metaId } = body ?? {};

  if (
    !tipo ||
    typeof descripcion !== "string" ||
    !descripcion.trim() ||
    typeof monto !== "number" ||
    !Number.isInteger(monto) ||
    monto <= 0 ||
    typeof etiqueta !== "string" ||
    !etiqueta.trim() ||
    typeof fecha !== "string" ||
    !fecha
  ) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const datos = {
    tipo,
    descripcion: descripcion.trim(),
    monto,
    etiqueta: etiqueta.trim(),
    fecha,
  };

  if (tipo !== "AHORRO") {
    const creado = await prisma.movimiento.create({ data: datos });
    return NextResponse.json(mapMovimiento(creado), { status: 201 });
  }

  // Un abono siempre apunta a una meta y suma a su monto actual
  if (typeof metaId !== "string" || !metaId) {
    return NextResponse.json({ error: "Falta la meta del abono" }, { status: 400 });
  }

  const creado = await prisma
    .$transaction(async (tx) => {
      const meta = await tx.metaAhorro.update({
        where: { id: metaId },
        data: { montoActual: { increment: monto } },
      });
      return tx.movimiento.create({
        data: { ...datos, etiqueta: meta.nombreMeta, metaId },
      });
    })
    .catch(() => null);

  if (!creado) {
    return NextResponse.json({ error: "Meta no encontrada" }, { status: 404 });
  }

  return NextResponse.json(mapMovimiento(creado), { status: 201 });
}
