export function formatCOP(monto: number): string {
  const formateado = new Intl.NumberFormat("es-CO", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(Math.round(monto));

  return `$ ${formateado} COP`;
}
