interface SectionLabelProps {
  label: string;
  className?: string;
}

export function SectionLabel({ label, className = '' }: SectionLabelProps) {
  return (
    <div className={`text-xs font-bold uppercase tracking-widest text-accent-orange mb-4 ${className}`}>
      {label}
    </div>
  );
}
