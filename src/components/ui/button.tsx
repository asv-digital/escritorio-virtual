"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--primary)] text-white hover:opacity-90 active:opacity-80",
        secondary:
          "bg-[var(--surface-2)] text-[var(--fg)] hover:bg-[var(--border)] border border-[var(--border)]",
        ghost: "text-[var(--fg-dim)] hover:bg-[var(--surface-2)] hover:text-[var(--fg)]",
        danger: "bg-[var(--danger)] text-white hover:opacity-90",
        outline:
          "border border-[var(--border)] bg-transparent text-[var(--fg)] hover:bg-[var(--surface-2)]",
      },
      size: {
        sm: "h-8 px-3",
        md: "h-10 px-4",
        lg: "h-11 px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";
