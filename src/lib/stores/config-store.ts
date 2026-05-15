"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface ClienteAtendido {
  id: string;
  nome: string;
  segmento?: string;
  ativo: boolean;
}

export interface ConfigStore {
  versao: number;
  empresa: {
    nome: string;
    logo_base64?: string;
  };
  clientes: ClienteAtendido[];
  preferencias: {
    tema: "dark" | "light" | "auto";
    sons: boolean;
  };
  onboarding_completo: boolean;

  setEmpresa(empresa: Partial<ConfigStore["empresa"]>): void;
  addCliente(cliente: Omit<ClienteAtendido, "id">): void;
  removeCliente(id: string): void;
  setOnboardingCompleto(v: boolean): void;
  setTema(tema: "dark" | "light" | "auto"): void;
  reset(): void;
}

const CHAVE = "ev_config_v1";

export const useConfig = create<ConfigStore>()(
  persist(
    (set) => ({
      versao: 1,
      empresa: { nome: "" },
      clientes: [],
      preferencias: { tema: "dark", sons: false },
      onboarding_completo: false,

      setEmpresa: (empresa) =>
        set((s) => ({ empresa: { ...s.empresa, ...empresa } })),
      addCliente: (cliente) =>
        set((s) => ({
          clientes: [
            ...s.clientes,
            { ...cliente, id: Math.random().toString(36).slice(2) },
          ].slice(0, 20),
        })),
      removeCliente: (id) =>
        set((s) => ({ clientes: s.clientes.filter((c) => c.id !== id) })),
      setOnboardingCompleto: (v) => set({ onboarding_completo: v }),
      setTema: (tema) =>
        set((s) => ({ preferencias: { ...s.preferencias, tema } })),
      reset: () =>
        set({
          empresa: { nome: "" },
          clientes: [],
          preferencias: { tema: "dark", sons: false },
          onboarding_completo: false,
        }),
    }),
    {
      name: CHAVE,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
