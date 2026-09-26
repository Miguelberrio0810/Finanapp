import { NextRequest, NextResponse } from "next/server";
import { COOKIE_SESION, verificarTokenSesion } from "@/lib/session";

const RUTAS_PUBLICAS = ["/login", "/api/auth/login"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (RUTAS_PUBLICAS.some((ruta) => pathname.startsWith(ruta))) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_SESION.nombre)?.value;
  const sesionValida = token ? await verificarTokenSesion(token) : false;

  if (!sesionValida) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Los iconos de la app deben verse también sin sesión (p. ej. en /login)
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon).*)",
  ],
};
