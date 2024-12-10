import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

interface IButtonPrimaryProps {
  loading?: boolean;
  text: string;
  className?: string;
  onClick?: () => void;
}

export default function ButtonPrimary({
  loading,
  text,
  className,
  onClick,
}: IButtonPrimaryProps) {
  return (
    <Button
      className={cn(
        "z-50 text-white text-sm px-6 py-5 rounded-full",
        className
      )}
      variant={"default"}
      disabled={loading}
      onClick={onClick}
    >
      {loading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : text}
    </Button>
  );
}
