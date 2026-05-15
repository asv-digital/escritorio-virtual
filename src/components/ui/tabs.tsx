"use client";

import { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  value: string;
  onChange: (v: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (v: string) => void;
  className?: string;
  children: React.ReactNode;
}

export function Tabs({
  defaultValue,
  value: controlled,
  onValueChange,
  className,
  children,
}: TabsProps) {
  const [internal, setInternal] = useState(defaultValue);
  const value = controlled ?? internal;
  const onChange = (v: string) => {
    if (controlled === undefined) setInternal(v);
    onValueChange?.(v);
  };

  return (
    <TabsContext.Provider value={{ value, onChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex h-10 items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--surface)] p-1",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("TabsTrigger fora de <Tabs>");
  const active = ctx.value === value;
  return (
    <button
      onClick={() => ctx.onChange(value)}
      className={cn(
        "inline-flex h-8 items-center justify-center rounded px-3 text-xs font-medium transition-colors",
        active
          ? "bg-[var(--primary)] text-white"
          : "text-[var(--fg-dim)] hover:bg-[var(--surface-2)] hover:text-[var(--fg)]",
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("TabsContent fora de <Tabs>");
  if (ctx.value !== value) return null;
  return <div className={cn("mt-4", className)}>{children}</div>;
}
