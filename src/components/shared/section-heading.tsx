import type { ReactNode } from "react";

type SectionHeadingProps = { label: string; title: ReactNode; description?: string; id?: string };

export function SectionHeading({ label, title, description, id }: SectionHeadingProps) {
  return <><p className="section-label">{label}</p><h2 className="section-title" id={id}>{title}</h2>{description && <p className="section-intro">{description}</p>}</>;
}
