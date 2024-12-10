import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import { ReactNode } from "react";

interface IButtonSecondaryProps {
  loading?: boolean;
  text: string;
  onClick: () => void;
  className?: string;
  icon?: ReactNode;
}

export default function ButtonSecondary({
  loading,
  text,
  className,
  icon,
  onClick,
}: IButtonSecondaryProps) {
  return (
    <Button
      className={cn(
        "z-50 text-sm px-6 py-5 gap-2 rounded-full font-normal text-slate-700",
        className
      )}
      variant={"secondary"}
      disabled={loading}
      onClick={onClick}
    >
      {loading ? (
        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <>
          {text} {icon}
        </>
      )}
    </Button>
  );
}
