"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, PiggyBank } from "lucide-react";

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

    const destino = searchParams.get("redirect") || "/ingresos";
    router.push(destino);
    router.refresh();
  };

  const inputClase =
    "w-full rounded-sm border border-rule bg-paper px-3 py-2 font-sans text-sm text-ink focus:outline-none focus:border-ahorro focus:ring-2 focus:ring-ahorro/30 dark:border-rule-dark dark:bg-paper-dark dark:text-ink-dark dark:focus:border-ahorro-dark dark:focus:ring-ahorro-dark/30";
  const labelClase =
    "mb-1 block font-display text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-ink-soft-dark";

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 dark:bg-paper-dark">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2">
          <PiggyBank className="h-6 w-6 text-ahorro dark:text-ahorro-dark" />
          <span className="font-display text-lg font-bold tracking-tight text-ink dark:text-ink-dark">
            Finan<span className="text-ahorro dark:text-ahorro-dark">app</span>
          </span>
        </div>

        <form onSubmit={handleSubmit} className="ticket space-y-4">
          <div>
            <label htmlFor="email" className={labelClase}>
              Correo
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClase}
              placeholder="tu@correo.com"
            />
          </div>

          <div>
            <label htmlFor="password" className={labelClase}>
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClase}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-gasto dark:text-gasto-dark">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-ahorro px-4 py-2.5 font-display text-sm font-semibold uppercase tracking-wide text-paper transition-colors hover:bg-ahorro/90 disabled:opacity-60 dark:bg-ahorro-dark dark:text-ink-dark dark:hover:bg-ahorro-dark/90"
          >
            <LogIn className="h-4 w-4" />
            {cargando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
