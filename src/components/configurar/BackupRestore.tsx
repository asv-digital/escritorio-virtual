"use client";

import { Download, RotateCcw, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useConfig } from "@/lib/stores/config-store";

export function BackupRestore() {
  const config = useConfig();
  const fileRef = useRef<HTMLInputElement>(null);
  const [resetOpen, setResetOpen] = useState(false);

  function exportar() {
    const data = {
      versao: config.versao,
      empresa: config.empresa,
      clientes: config.clientes,
      preferencias: config.preferencias,
      exportado_em: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const slug = (config.empresa.nome || "escritorio")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");
    a.download = `escritorio-virtual-${slug}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function importar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (typeof data !== "object" || data === null) throw new Error("formato inválido");
      if (data.empresa) config.setEmpresa(data.empresa);
      if (Array.isArray(data.clientes)) {
        // limpa atuais
        for (const c of config.clientes) config.removeCliente(c.id);
        for (const c of data.clientes) {
          if (c && c.nome) {
            config.addCliente({ nome: c.nome, segmento: c.segmento, ativo: c.ativo !== false });
          }
        }
      }
      alert("✓ Configurações importadas.");
    } catch {
      alert("Arquivo inválido. Use um JSON exportado deste painel.");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function reset() {
    config.reset();
    setResetOpen(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Backup & restauração</CardTitle>
        <CardDescription>
          Suas configurações ficam no navegador. Exporte pra mover de aparelho.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={exportar}>
            <Download className="h-4 w-4" />
            Exportar JSON
          </Button>
          <Button variant="outline" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4" />
            Importar JSON
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            hidden
            onChange={importar}
          />
          <Button variant="danger" onClick={() => setResetOpen(true)}>
            <RotateCcw className="h-4 w-4" />
            Resetar tudo
          </Button>
        </div>
      </CardContent>

      <Dialog open={resetOpen} onClose={() => setResetOpen(false)}>
        <DialogHeader>
          <DialogTitle>Resetar configurações?</DialogTitle>
          <DialogDescription>
            Isso vai apagar nome da empresa, logo, clientes cadastrados e preferências.
            Exporte antes se quiser guardar.
          </DialogDescription>
        </DialogHeader>
        <DialogContent>
          <p className="text-sm text-[var(--fg-dim)]">Essa ação não pode ser desfeita.</p>
        </DialogContent>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setResetOpen(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={reset}>
            Resetar tudo
          </Button>
        </DialogFooter>
      </Dialog>
    </Card>
  );
}
