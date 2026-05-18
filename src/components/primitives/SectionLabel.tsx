interface Props {
  index: string;
  label: string;
}

export function SectionLabel({ index, label }: Props) {
  return (
    <div className="flex items-baseline gap-3 text-label uppercase tracking-[0.18em] text-ink-soft text-tabular">
      <span className="text-accent">{index}</span>
      <span aria-hidden className="h-px w-6 bg-rule" />
      <span>{label}</span>
    </div>
  );
}
