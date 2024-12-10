import { ReactNode } from "react";

interface formErrorProps {
  children: ReactNode;
}

export default function FormError({ children }: formErrorProps) {
  return <label className="text-xs text-destructive">{children}</label>;
}
