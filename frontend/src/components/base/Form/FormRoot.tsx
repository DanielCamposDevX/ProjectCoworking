import { ReactNode } from "react";

interface formRootProps {
  children: ReactNode;
}

export default function FormRoot({ children }: formRootProps) {
  return (
    <div className="flex flex-col gap-2 w-10/12 max-w-[300px] text-muted-foreground">
      {children}
    </div>
  );
}
