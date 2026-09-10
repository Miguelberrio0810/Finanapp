import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { tipoPrisma } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  const tipo = tipoPrisma(req.nextUrl.searchParams.get("tipo"));
  if (!tipo) {
    return NextResponse.json({ error: "Parámetro tipo inválido" }, { status: 400 });
  }

  const categorias = await prisma.categoria.findMany({
    where: { tipo },
    orderBy: { nombre: "asc" },
  });

  return NextResponse.json(categorias.map((c) => c.nombre));
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const tipo = tipoPrisma(body?.tipo);
  const nombre = body?.nombre;

  if (!tipo || typeof nombre !== "string" || !nombre.trim()) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const categoria = await prisma.categoria.upsert({
    where: { tipo_nombre: { tipo, nombre: nombre.trim() } },
    update: {},
    create: { tipo, nombre: nombre.trim() },
  });

  return NextResponse.json(categoria, { status: 201 });
}
