"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Download, RefreshCw, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const STORAGE_KEY_DISMISSED = "ev_pwa_install_dismissed_at";
const DISMISS_AGAIN_AFTER_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias

export function PWAManager() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [updateReady, setUpdateReady] = useState(false);
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);

  // ── Registro do SW ───────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (window.location.protocol === "file:") return; // não roda em file://

    const onLoad = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((reg) => {
          registrationRef.current = reg;

          // novo SW esperando = update disponível
          if (reg.waiting) setUpdateReady(true);

          reg.addEventListener("updatefound", () => {
            const sw = reg.installing;
            if (!sw) return;
            sw.addEventListener("statechange", () => {
              if (sw.state === "installed" && navigator.serviceWorker.controller) {
                setUpdateReady(true);
              }
            });
          });
        })
        .catch(() => {
          /* ignora — fallback é o app funcionar online normal */
        });

      // recarrega quando novo SW assume
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });
    };

    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad);

    return () => window.removeEventListener("load", onLoad);
  }, []);

  // ── Install prompt ───────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;

    const dismissedAt = Number(localStorage.getItem(STORAGE_KEY_DISMISSED) || 0);
    const recentlyDismissed = Date.now() - dismissedAt < DISMISS_AGAIN_AFTER_MS;

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      const evt = e as BeforeInstallPromptEvent;
      setInstallEvent(evt);
      if (!recentlyDismissed) {
        // mostra após 30s pra não atrapalhar
        setTimeout(() => setShowInstall(true), 30_000);
      }
    };

    const onInstalled = () => {
      setShowInstall(false);
      setInstallEvent(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function instalar() {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    setShowInstall(false);
    setInstallEvent(null);
  }

  function dispensar() {
    setShowInstall(false);
    localStorage.setItem(STORAGE_KEY_DISMISSED, String(Date.now()));
  }

  function aplicarUpdate() {
    const reg = registrationRef.current;
    if (reg?.waiting) {
      reg.waiting.postMessage("SKIP_WAITING");
    } else {
      window.location.reload();
    }
  }

  return (
    <AnimatePresence>
      {showInstall && installEvent && (
        <motion.div
          key="install"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-md rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 shadow-xl"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--primary)]/15 text-[var(--primary)]">
              <Download className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-[var(--fg)]">
                Instalar como app?
              </div>
              <div className="mt-0.5 text-xs text-[var(--fg-dim)]">
                Acesso direto na tela inicial. Funciona offline.
              </div>
              <div className="mt-2.5 flex gap-2">
                <button
                  onClick={instalar}
                  className="inline-flex h-8 items-center rounded-md bg-[var(--primary)] px-3 text-xs font-medium text-white hover:opacity-90"
                >
                  Instalar
                </button>
                <button
                  onClick={dispensar}
                  className="inline-flex h-8 items-center rounded-md border border-[var(--border)] px-3 text-xs font-medium text-[var(--fg-dim)] hover:bg-[var(--surface-2)]"
                >
                  Agora não
                </button>
              </div>
            </div>
            <button
              onClick={dispensar}
              className="rounded-md p-1 text-[var(--fg-mute)] hover:bg-[var(--surface-2)]"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}

      {updateReady && (
        <motion.div
          key="update"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.2 }}
          className="fixed left-4 right-4 top-4 z-40 mx-auto max-w-md rounded-lg border border-[var(--accent)]/40 bg-[var(--surface)] p-3 shadow-xl"
        >
          <div className="flex items-center gap-3">
            <RefreshCw className="h-4 w-4 text-[var(--accent)]" />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-[var(--fg)]">
                Atualização disponível
              </div>
              <div className="text-xs text-[var(--fg-dim)]">
                Recarregue pra usar a nova versão.
              </div>
            </div>
            <button
              onClick={aplicarUpdate}
              className="inline-flex h-8 items-center rounded-md bg-[var(--accent)] px-3 text-xs font-semibold text-[var(--bg)] hover:opacity-90"
            >
              Atualizar
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
