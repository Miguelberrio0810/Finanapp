import { SignJWT, jwtVerify } from "jose";

const NOMBRE_COOKIE = "finanapp_session";
const DURACION_SEGUNDOS = 60 * 60 * 24 * 30; // 30 días

function obtenerClave(): Uint8Array {
  const secreto = process.env.AUTH_SECRET;
  if (!secreto) {
    throw new Error("Falta la variable de entorno AUTH_SECRET");
  }
  return new TextEncoder().encode(secreto);
}

export async function crearTokenSesion(email: string): Promise<string> {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${DURACION_SEGUNDOS}s`)
    .sign(obtenerClave());
}

export async function verificarTokenSesion(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, obtenerClave());
    return true;
  } catch {
    return false;
  }
}

export const COOKIE_SESION = {
  nombre: NOMBRE_COOKIE,
  maxAge: DURACION_SEGUNDOS,
};

export async function leerEmailSesion(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, obtenerClave());
    return typeof payload.email === "string" ? payload.email : null;
  } catch {
    return null;
  }
}
