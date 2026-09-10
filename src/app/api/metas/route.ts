import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapMetaAhorro } from "@/lib/api-utils";

export async function GET() {
  const metas = await prisma.metaAhorro.findMany({ orderBy: { creadoEn: "asc" } });
  return NextResponse.json(metas.map(mapMetaAhorro));
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  const nombreMeta =
    typeof body?.nombreMeta === "string" && body.nombreMeta.trim()
      ? body.nombreMeta.trim()
      : "Nueva meta";
  const montoObjetivo =
    typeof body?.montoObjetivo === "number" && body.montoObjetivo > 0
      ? body.montoObjetivo
      : 1000000;

  const meta = await prisma.metaAhorro.create({
    data: { nombreMeta, montoObjetivo, montoActual: 0, monto15: 0, monto30: 0 },
  });

  return NextResponse.json(mapMetaAhorro(meta), { status: 201 });
}
