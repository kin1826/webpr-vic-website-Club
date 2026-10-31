import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-[transform,background-color,color,box-shadow] duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-vic-blue/25 disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        primary: "bg-vic-ink !text-white shadow-[0_12px_30px_rgba(22,22,22,.18)] hover:bg-vic-blue hover:shadow-[0_14px_34px_rgba(36,87,245,.25)]",
        secondary: "border border-black/10 bg-white/70 text-vic-ink hover:bg-white",
        glass: "glass-surface text-vic-ink hover:bg-white/90",
        light: "bg-white text-vic-ink hover:bg-vic-blue hover:text-white",
        ghost: "text-vic-ink hover:bg-vic-blue-soft hover:text-vic-blue",
      },
      size: { default: "h-12", sm: "h-11 min-h-11 px-4", icon: "size-11 min-h-11 p-0" },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";
  return <Component className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
