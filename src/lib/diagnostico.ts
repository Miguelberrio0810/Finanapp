import { DiagnosticoIA, MetaAhorro } from "@/types/ahorro";

const LIMITE_QUINCENAS = 240; // 10 años, tope de seguridad para evitar bucles infinitos

function obtenerUltimoDiaDelMes(anio: number, mes: number): number {
  return new Date(anio, mes + 1, 0).getDate();
}

function siguienteFechaQuincenal(desde: Date): Date {
  const dia = desde.getDate();
  const anio = desde.getFullYear();
  const mes = desde.getMonth();

  if (dia < 15) {
    return new Date(anio, mes, 15);
  }

  const ultimoDia = obtenerUltimoDiaDelMes(anio, mes);
  if (dia < ultimoDia) {
    return new Date(anio, mes, ultimoDia);
  }

  return new Date(anio, mes + 1, 15);
}

export function generarDiagnostico(
  meta: MetaAhorro,
  fechaBase: Date = new Date()
): DiagnosticoIA {
  const restante = meta.montoObjetivo - meta.montoActual;
  const { monto15, monto30 } = meta.planQuincenal;

  if (restante <= 0) {
    return {
      quincenasEstimadas: 0,
      mesesEstimados: 0,
      fechaEstimadaCumplimiento: fechaBase.toISOString(),
      recomendacion: "¡Meta cumplida! Ya alcanzaste el monto objetivo.",
    };
  }

  if (monto15 <= 0 && monto30 <= 0) {
    return {
      quincenasEstimadas: 0,
      mesesEstimados: 0,
      fechaEstimadaCumplimiento: "",
      recomendacion:
        "Define al menos un aporte quincenal mayor a $0 para poder calcular una fecha estimada.",
    };
  }

  let acumulado = 0;
  let quincenas = 0;
  let fechaActual = new Date(fechaBase);

  while (acumulado < restante && quincenas < LIMITE_QUINCENAS) {
    fechaActual = siguienteFechaQuincenal(fechaActual);
    const esDia15 = fechaActual.getDate() === 15;
    acumulado += esDia15 ? monto15 : monto30;
    quincenas++;
  }

  const mesesEstimados = Math.ceil(quincenas / 2);
  const promedioMensual = monto15 + monto30;
  const mesesTotalesMeta = restante / promedioMensual;

  let recomendacion: string;
  if (quincenas >= LIMITE_QUINCENAS) {
    recomendacion =
      "Con los aportes actuales, la meta tardaría más de 10 años. Considera aumentar tus aportes quincenales.";
  } else if (mesesTotalesMeta <= 3) {
    recomendacion =
      "Excelente ritmo: alcanzarás tu meta en menos de 3 meses. Mantén la disciplina en tus aportes.";
  } else if (mesesTotalesMeta <= 12) {
    recomendacion =
      "Vas por buen camino. A este ritmo cumplirás tu meta dentro del año. Evalúa si puedes aumentar el aporte del día 30 para acelerar el proceso.";
  } else {
    recomendacion =
      "El plazo estimado supera el año. Te recomendamos aumentar los montos quincenales o revisar si la meta total es realista para tu capacidad de ahorro actual.";
  }

  return {
    quincenasEstimadas: quincenas,
    mesesEstimados,
    fechaEstimadaCumplimiento: fechaActual.toISOString(),
    recomendacion,
  };
}
