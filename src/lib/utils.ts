export function formatCOP(monto: number): string {
  const formateado = new Intl.NumberFormat("es-CO", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(Math.round(Math.abs(monto)));

  return `${monto < 0 ? "−" : ""}$ ${formateado}`;
}
