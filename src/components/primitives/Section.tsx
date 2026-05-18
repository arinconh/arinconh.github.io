import type { PropsWithChildren } from "react";
import { Container } from "./Container";
import { SectionLabel } from "./SectionLabel";

interface Props {
  id: string;
  index: string;
  label: string;
  title?: string;
  width?: "default" | "narrow" | "wide";
  alt?: boolean;
}

export function Section({
  id,
  index,
  label,
  title,
  width = "default",
  alt = false,
  children,
}: PropsWithChildren<Props>) {
  return (
    <section
      id={id}
      className={`py-section ${alt ? "bg-paper" : "bg-paper-pure"}`}
    >
      <Container width={width}>
        <div className="mb-12 md:mb-16 space-y-6">
          <SectionLabel index={index} label={label} />
          {title && (
            <h2 className="font-serif text-h2 leading-[1.05] tracking-[-0.01em]">
              {title}
            </h2>
          )}
        </div>
        {children}
      </Container>
    </section>
  );
}
