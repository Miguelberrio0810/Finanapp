interface TituloSeccionProps {
  titulo: string;
  nota?: React.ReactNode;
  accion?: React.ReactNode;
}

export default function TituloSeccion({ titulo, nota, accion }: TituloSeccionProps) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
      <div className="min-w-0">
        <h2 className="text-xl text-ink dark:text-ink-dark">{titulo}</h2>
        {nota && <p className="mt-0.5 text-sm text-ink-soft dark:text-ink-soft-dark">{nota}</p>}
      </div>
      {accion}
    </div>
  );
}
