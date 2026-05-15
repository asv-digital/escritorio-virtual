"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "text", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      "flex h-10 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--fg)] placeholder:text-[var(--fg-mute)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Label = forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-xs font-medium uppercase tracking-[0.15em] text-[var(--fg-mute)]",
      className,
    )}
    {...props}
  />
));
Label.displayName = "Label";
