"use client";

import { useEffect } from "react";
import { getCatalog } from "@/lib/catalog/loader";
import { useConfig } from "@/lib/stores/config-store";
import { useSimulator } from "@/lib/stores/simulator-store";

/**
 * Inicializa o simulador no mount.
 * - Liga catálogo no store
 * - Define lista de clientes (do user ou pool fallback)
 * - Starta o loop e cuida do pause/resume por visibilidade da aba
 */
export function SimulatorBoot() {
  const init = useSimulator((s) => s.init);
  const start = useSimulator((s) => s.start);
  const stop = useSimulator((s) => s.stop);
  const pause = useSimulator((s) => s.pause);
  const resume = useSimulator((s) => s.resume);
  const clientesUser = useConfig((s) => s.clientes);

  useEffect(() => {
    const catalog = getCatalog();
    init(catalog.agents);

    const clientes = (
      clientesUser.length > 0
        ? clientesUser.filter((c) => c.ativo !== false).map((c) => c.nome)
        : catalog.pool_clientes_fallback
    );

    start(clientes);

    const onVisibility = () => {
      if (document.hidden) pause();
      else resume();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientesUser.length]);

  return null;
}
