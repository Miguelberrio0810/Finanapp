# Finanapp

Finanzas personales en pesos colombianos: ingresos, gastos con presupuesto por categoría, suscripciones y metas de ahorro con plan quincenal y Diagnóstico IA.

Next.js 16 (App Router) · React 19 · Tailwind 3 · Prisma 7 + Postgres (Supabase).

## Puesta en marcha

```bash
npm install
cp .env.example .env   # y completa los valores
npm run db:push        # sincroniza el schema con la base
npm run db:seed        # categorías, metas y suscripciones iniciales (idempotente)
npm run dev
```

## Variables de entorno

| Variable | Uso |
| --- | --- |
| `DATABASE_URL` | Conexión de Postgres por el pooler (puerto 6543) para las consultas de la app. |
| `DIRECT_URL` | Conexión directa (puerto 5432) para `db:push` y migraciones. |
| `AUTH_EMAIL` | Correo del único usuario autorizado. También es el dueño de las suscripciones del seed. |
| `AUTH_PASSWORD_HASH` | Hash bcrypt de la contraseña. |
| `AUTH_SECRET` | Secreto para firmar la cookie de sesión (JWT HS256). |
| `ANTHROPIC_API_KEY` | **Opcional.** Activa el consejo de Claude en el Diagnóstico IA. |

### Diagnóstico IA

`POST /api/diagnostico` (requiere sesión) siempre calcula la proyección local con `src/lib/diagnostico.ts`: quincenas, meses y fecha estimada.

- **Sin `ANTHROPIC_API_KEY`**, devuelve ese cálculo con su recomendación local.
- **Con `ANTHROPIC_API_KEY`**, reemplaza la recomendación por un consejo breve de Claude. Si la llamada falla o tarda más de 15 s, vuelve al cálculo local.

La clave solo se lee en el servidor. No la expongas con el prefijo `NEXT_PUBLIC_`. En Vercel, agrégala en *Project Settings → Environment Variables*.

## Scripts

- `npm run dev` / `npm run build` / `npm start`
- `npm run lint`: ESLint (flat config en `eslint.config.mjs`)
- `npm run db:push`, `npm run db:seed`, `npm run db:studio`
