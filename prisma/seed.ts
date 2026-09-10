import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { ETIQUETAS_INGRESO, ETIQUETAS_GASTO } from "../src/types/finanzas";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

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
      create: { tipo: "GASTO", nombre },
    });
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
