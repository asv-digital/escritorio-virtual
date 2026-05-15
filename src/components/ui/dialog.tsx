"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  closable?: boolean;
}

export function Dialog({ open, onClose, children, className, closable = true }: DialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && closable) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, closable]);

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => closable && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "relative w-full max-w-lg rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-2xl",
              className,
            )}
          >
            {closable && (
              <button
                onClick={onClose}
                className="absolute right-3 top-3 rounded-md p-1 text-[var(--fg-mute)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--fg)]"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="border-b border-[var(--border)] p-5">{children}</div>;
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-semibold text-[var(--fg)]">{children}</h2>;
}

export function DialogDescription({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-sm text-[var(--fg-dim)]">{children}</p>;
}

export function DialogContent({ children }: { children: React.ReactNode }) {
  return <div className="p-5">{children}</div>;
}

export function DialogFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-end gap-2 border-t border-[var(--border)] p-4">
      {children}
    </div>
  );
}
