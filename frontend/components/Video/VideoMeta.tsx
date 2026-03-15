interface VideoMetaProps {
  title: string;
  description?: string | null;
  sectionTitle: string;
}

export function VideoMeta({ title, description, sectionTitle }: VideoMetaProps) {
  return (
    <div className="mt-4">
      <p className="text-xs font-medium uppercase tracking-wider text-emerald-500">
        {sectionTitle}
      </p>
      <h1 className="mt-1 text-2xl font-bold text-white">{title}</h1>
      {description && (
        <p className="mt-2 text-slate-400 leading-relaxed">{description}</p>
      )}
    </div>
  );
}
