import { ReactNode } from "react";

interface formLabelProps {
  children: ReactNode;
}

export default function FormLabel({ children }: formLabelProps) {
  return <label className="text-xs text-slate-600">{children}</label>;
}
