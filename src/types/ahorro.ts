export interface PlanQuincenal {
  monto15: number;
  monto30: number;
}

export interface MetaAhorro {
  id: string;
  nombreMeta: string;
  montoObjetivo: number;
  montoActual: number;
  planQuincenal: PlanQuincenal;
  fase?: number;
}

export interface DiagnosticoIA {
  quincenasEstimadas: number;
  mesesEstimados: number;
  fechaEstimadaCumplimiento: string;
  recomendacion: string;
}
