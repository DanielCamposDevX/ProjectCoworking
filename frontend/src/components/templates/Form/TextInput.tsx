import { FormBase } from "@/components/base/Form";
import { cn } from "@/lib/utils";
import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface ITextInputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string;
  error?: string;
  register: UseFormRegisterReturn;
}

export default function TextInput({
  className,
  type,
  error,
  label,
  register,
  ...props
}: ITextInputProps) {
  return (
    <FormBase.Root>
      <FormBase.Label>{label}</FormBase.Label>
      <input
        type={type}
        className={cn(
          "h-6 w-full flex border rounded-full px-5 py-5 transition-colors disabled:cursor-not-allowed",
          "bg-transparent file:bg-transparent bg-white disabled:opacity-50",
          "text-xs text-muted-foreground file:text-sm file:font-medium placeholder:text-muted-foreground",
          "shadow-md shadow-[#00000010] border-[#00000025] file:border-0",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400",
          className
        )}
        {...register}
        {...props}
      />
      {error ? (
        <FormBase.Error>{error}</FormBase.Error>
      ) : (
        <div className="h-3"></div>
      )}
    </FormBase.Root>
  );
}
