import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { ETIQUETAS_INGRESO, ETIQUETAS_GASTO } from "../src/types/finanzas";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Tope mensual inicial por categoría de gasto (0 = sin tope). Solo se aplica al crearla.
const PRESUPUESTO_GASTO: Record<string, number> = {};

const METAS = [
  { fase: 1, nombreMeta: "iPhone para mi novia", montoObjetivo: 4_200_000 },
  { fase: 1, nombreMeta: "Dos memorias RAM", montoObjetivo: 480_000 },
  { fase: 1, nombreMeta: "Teclado mecánico gamer", montoObjetivo: 380_000 },
  { fase: 1, nombreMeta: "Soporte doble laptop + monitor", montoObjetivo: 260_000 },
  { fase: 2, nombreMeta: "Actualizar la consola", montoObjetivo: 2_900_000 },
  { fase: 2, nombreMeta: "Viaje al extranjero", montoObjetivo: 8_000_000 },
];

const SUSCRIPCIONES = [
  { nombre: "Spotify", monto: 16_900, diaCobro: 5 },
  { nombre: "Netflix", monto: 26_900, diaCobro: 8 },
  { nombre: "Xbox Game Pass Ultimate", monto: 54_900, diaCobro: 15 },
  { nombre: "Google One", monto: 8_900, diaCobro: 28 },
];

async function main() {
  for (const nombre of ETIQUETAS_INGRESO) {
    await prisma.categoria.upsert({
      where: { tipo_nombre: { tipo: "INGRESO", nombre } },
      update: {},
      create: { tipo: "INGRESO", nombre },
    });
  }

  for (const nombre of ETIQUETAS_GASTO) {
    await prisma.categoria.upsert({
      where: { tipo_nombre: { tipo: "GASTO", nombre } },
      update: {},
      create: { tipo: "GASTO", nombre, presupuesto: PRESUPUESTO_GASTO[nombre] ?? 0 },
    });
  }

  // Las metas no tienen clave única: se crean solo si no existe una con el mismo nombre
  for (const meta of METAS) {
    const existe = await prisma.metaAhorro.findFirst({ where: { nombreMeta: meta.nombreMeta } });
    if (!existe) await prisma.metaAhorro.create({ data: meta });
  }

  const userId = process.env.AUTH_EMAIL;
  if (!userId) {
    console.warn("AUTH_EMAIL no está definido: se omiten las suscripciones.");
    return;
  }

  for (const s of SUSCRIPCIONES) {
    const existe = await prisma.suscripcion.findFirst({ where: { userId, nombre: s.nombre } });
    if (!existe) await prisma.suscripcion.create({ data: { ...s, userId } });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
