import { NextRequest, NextResponse } from "next/server";
import { generarDiagnostico } from "@/lib/diagnostico";
import { requerirSesion } from "@/lib/api-utils";
import { MetaAhorro } from "@/types/ahorro";

function esMetaValida(meta: unknown): meta is MetaAhorro {
  const m = meta as MetaAhorro | null;
  return (
    !!m &&
    typeof m.nombreMeta === "string" &&
    typeof m.montoObjetivo === "number" &&
    typeof m.montoActual === "number" &&
    typeof m.planQuincenal?.monto15 === "number" &&
    typeof m.planQuincenal?.monto30 === "number"
  );
}

export async function POST(req: NextRequest) {
  const sesion = await requerirSesion(req);
  if (sesion instanceof NextResponse) return sesion;

  const meta = await req.json().catch(() => null);
  if (!esMetaValida(meta)) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  // El cálculo local es la base y el respaldo si la IA no está disponible
  const base = generarDiagnostico(meta);
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return Response.json(base);

  // Meta cumplida o sin aportes: el mensaje local ya es exacto
  if (base.quincenasEstimadas === 0) return Response.json(base);

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: `Eres asesor financiero personal en Colombia. Meta: ${meta.nombreMeta}. Objetivo: ${meta.montoObjetivo} COP. Ahorrado: ${meta.montoActual} COP. Aporte día 15: ${meta.planQuincenal.monto15}. Aporte día 30: ${meta.planQuincenal.monto30}. Proyección calculada: ${base.mesesEstimados} meses (${base.quincenasEstimadas} quincenas). Da un consejo breve (máx. 3 frases), concreto y en español, sin repetir los números tal cual.`,
          },
        ],
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!r.ok) return Response.json(base);

    const data = await r.json();
    const texto = Array.isArray(data.content)
      ? data.content.find((b: { type?: string }) => b.type === "text")?.text
      : undefined;
    return Response.json({
      ...base,
      recomendacion: typeof texto === "string" && texto.trim() ? texto.trim() : base.recomendacion,
    });
  } catch {
    return Response.json(base);
  }
}
