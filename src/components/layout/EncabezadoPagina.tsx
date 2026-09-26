import type { LucideIcon } from "lucide-react";

interface EncabezadoPaginaProps {
  icon: LucideIcon;
  titulo: string;
  descripcion: string;
}

export default function EncabezadoPagina({ icon: Icon, titulo, descripcion }: EncabezadoPaginaProps) {
  return (
    <header className="border-b-2 border-ink pb-4 dark:border-ink-dark">
      <div className="flex items-center gap-2.5">
        <Icon className="h-7 w-7 shrink-0 text-accent" strokeWidth={2.25} />
        <h1 className="text-3xl text-ink dark:text-ink-dark sm:text-4xl">{titulo}</h1>
      </div>
      <p className="mt-1 text-sm text-ink-soft dark:text-ink-soft-dark">{descripcion}</p>
    </header>
  );
}
