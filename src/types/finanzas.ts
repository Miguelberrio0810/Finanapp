export type TipoMovimiento = "ingreso" | "gasto" | "ahorro";

export interface Movimiento {
  id: string;
  descripcion: string;
  monto: number;
  etiqueta: string;
  fecha: string; // formato YYYY-MM-DD
  tipo?: TipoMovimiento;
  metaId?: string | null;
}

export interface Categoria {
  nombre: string;
  presupuesto: number;
}

export interface Suscripcion {
  id: string;
  nombre: string;
  monto: number;
  diaCobro: number;
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
