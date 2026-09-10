export interface Movimiento {
  id: string;
  descripcion: string;
  monto: number;
  etiqueta: string;
  fecha: string; // formato YYYY-MM-DD
}

export const ETIQUETAS_INGRESO = [
  "Salario",
  "Emprendimiento",
  "Regalo",
  "Rendimientos",
] as const;

export const ETIQUETAS_GASTO = [
  "Comida",
  "Ropa",
  "Cuidado Personal",
  "Higiene",
  "Servicios",
] as const;
