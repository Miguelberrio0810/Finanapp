"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setCargando(false);

    if (!res.ok) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    const destino = searchParams.get("redirect") || "/resumen";
    router.push(destino);
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 dark:bg-paper-dark">
      <div className="w-full max-w-sm border-2 border-ink dark:border-ink-dark">
        <div className="border-b-2 border-ink px-6 py-5 dark:border-ink-dark">
          <p className="text-3xl font-extrabold tracking-titular text-ink dark:text-ink-dark">
            Finan<span className="text-accent">app</span>
          </p>
          <p className="mt-1 text-sm text-ink-soft dark:text-ink-soft-dark">
            Cuentas claras en pesos colombianos
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 dark:bg-card-dark">
          <div>
            <label htmlFor="email" className="etiqueta-campo">
              Correo
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="campo"
              placeholder="tu@correo.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="etiqueta-campo">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="campo"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm font-semibold text-accent-700 dark:text-accent-300">
              {error}
            </p>
          )}

          <button type="submit" disabled={cargando} className="boton-primario w-full">
            {cargando ? "Entrando..." : "Entrar"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
