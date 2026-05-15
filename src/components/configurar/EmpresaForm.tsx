"use client";

import { Upload, X } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { useConfig } from "@/lib/stores/config-store";

const MAX_LOGO_BYTES = 200 * 1024;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export function EmpresaForm() {
  const empresa = useConfig((s) => s.empresa);
  const setEmpresa = useConfig((s) => s.setEmpresa);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      alert("Use PNG, JPG ou WEBP.");
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      alert(`Logo precisa ser menor que ${Math.round(MAX_LOGO_BYTES / 1024)}KB.`);
      return;
    }
    const base64 = await fileToBase64(file);
    setEmpresa({ logo_base64: base64 });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sua empresa</CardTitle>
        <CardDescription>
          O nome aparece no header do painel. O logo é opcional.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="empresa-nome">Nome da empresa</Label>
          <Input
            id="empresa-nome"
            placeholder="Ex: Contabilidade Silva & Associados"
            value={empresa.nome}
            onChange={(e) => setEmpresa({ nome: e.target.value })}
            maxLength={60}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Logo (opcional)</Label>
          <div className="flex items-center gap-3">
            {empresa.logo_base64 ? (
              <div className="flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={empresa.logo_base64}
                  alt="logo"
                  className="h-10 w-10 rounded object-contain"
                />
                <button
                  onClick={() => setEmpresa({ logo_base64: undefined })}
                  className="text-[var(--fg-mute)] hover:text-[var(--danger)]"
                  aria-label="Remover logo"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : null}
            <Button variant="outline" onClick={() => fileRef.current?.click()}>
              <Upload className="h-4 w-4" /> Carregar logo
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              hidden
              onChange={onUpload}
            />
            <span className="text-xs text-[var(--fg-mute)]">PNG/JPG/WEBP até 200KB</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
