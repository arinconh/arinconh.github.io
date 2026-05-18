import type { PropsWithChildren, HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  width?: "default" | "narrow" | "wide";
}

const widthClass = {
  default: "max-w-6xl",
  narrow: "max-w-3xl",
  wide: "max-w-7xl",
} as const;

export function Container({
  children,
  width = "default",
  className = "",
  ...rest
}: PropsWithChildren<Props>) {
  return (
    <div
      className={`mx-auto px-6 md:px-10 ${widthClass[width]} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
