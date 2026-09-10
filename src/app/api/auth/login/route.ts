import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { COOKIE_SESION, crearTokenSesion } from "@/lib/session";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = body?.email;
  const password = body?.password;

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const emailValido = process.env.AUTH_EMAIL;
  const hashValido = process.env.AUTH_PASSWORD_HASH;

  if (!emailValido || !hashValido) {
    return NextResponse.json(
      { error: "Autenticación no configurada" },
      { status: 500 }
    );
  }

  const emailCoincide = email.trim().toLowerCase() === emailValido.toLowerCase();
  const passwordCoincide = await bcrypt.compare(password, hashValido);

  if (!emailCoincide || !passwordCoincide) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  const token = await crearTokenSesion(emailValido);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_SESION.nombre, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_SESION.maxAge,
  });

  return res;
}
