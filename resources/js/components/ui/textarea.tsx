import { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  ref?: React.Ref<HTMLTextAreaElement>;
}

export function Textarea({
  placeholder = "Enter text...",
  className = "",
  rows = 4,
  ref,
  ...props
}: TextareaProps) {
  return (
    <textarea
      ref={ref}
      placeholder={placeholder}
      rows={rows}
      className={cn(
        "px-4 py-2 w-full border-2 bg-input rounded shadow-md transition focus:outline-hidden focus:shadow-xs placeholder:text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}