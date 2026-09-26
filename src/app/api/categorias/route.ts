import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { tipoPrisma } from "@/lib/api-utils";

function tipoCategoria(valor: unknown) {
  const tipo = tipoPrisma(valor);
  // Los abonos se etiquetan con el nombre de la meta, no con categorías
  return tipo === "AHORRO" ? null : tipo;
}

export async function GET(req: NextRequest) {
  const tipo = tipoCategoria(req.nextUrl.searchParams.get("tipo"));
  if (!tipo) {
    return NextResponse.json({ error: "Parámetro tipo inválido" }, { status: 400 });
  }

  const categorias = await prisma.categoria.findMany({
    where: { tipo },
    orderBy: { nombre: "asc" },
  });

  return NextResponse.json(
    categorias.map((c) => ({ nombre: c.nombre, presupuesto: c.presupuesto }))
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const tipo = tipoCategoria(body?.tipo);
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

export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const tipo = tipoCategoria(body?.tipo);
  const nombre = body?.nombre;
  const presupuesto = body?.presupuesto;

  if (
    !tipo ||
    typeof nombre !== "string" ||
    !nombre.trim() ||
    typeof presupuesto !== "number" ||
    !Number.isInteger(presupuesto) ||
    presupuesto < 0
  ) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  // Upsert: una categoría por defecto puede no existir todavía en la base
  const categoria = await prisma.categoria.upsert({
    where: { tipo_nombre: { tipo, nombre: nombre.trim() } },
    update: { presupuesto },
    create: { tipo, nombre: nombre.trim(), presupuesto },
  });

  return NextResponse.json({ nombre: categoria.nombre, presupuesto: categoria.presupuesto });
}
