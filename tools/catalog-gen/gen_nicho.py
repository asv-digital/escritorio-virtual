#!/usr/bin/env python3
"""Gera src/data/catalogs/<nicho>.json a partir dos SKILL.md do nicho.

Uso:
    python3 tools/catalog-gen/gen_nicho.py <nicho>
"""

import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from configs import NICHOS  # noqa: E402

ROOT = Path(__file__).parent.parent.parent
DST_DIR = ROOT / "src" / "data" / "catalogs"

# Variação de cor em torno da base (luminância levemente diferente por categoria)
COR_OFFSETS = [
    (0, 0, 0),
    (8, -4, -8),
    (-12, 12, 4),
    (16, 8, -4),
    (-8, -8, 12),
    (12, -12, 8),
    (-16, 4, -8),
    (4, 16, -12),
    (-4, -16, 16),
    (20, 0, -16),
    (-20, 16, 8),
    (8, 20, 4),
    (-12, -20, -4),
    (16, -8, 20),
]


def hex_to_rgb(h: str):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def rgb_to_hex(r, g, b):
    r = max(0, min(255, r))
    g = max(0, min(255, g))
    b = max(0, min(255, b))
    return f"#{r:02X}{g:02X}{b:02X}"


def cor_categoria(base_hex: str, idx: int) -> str:
    r, g, b = hex_to_rgb(base_hex)
    dr, dg, db = COR_OFFSETS[idx % len(COR_OFFSETS)]
    return rgb_to_hex(r + dr, g + dg, b + db)


def parse_frontmatter(content: str) -> dict:
    m = re.match(r"^---\n(.*?)\n---", content, re.DOTALL)
    if not m:
        return {}
    data: dict = {}
    for line in m.group(1).split("\n"):
        if ":" in line:
            k, v = line.split(":", 1)
            data[k.strip()] = v.strip()
    return data


REPLACEMENTS_TECNICOS = {
    "Nbr": "NBR", "Art": "ART", "Lgpd": "LGPD", "Mei": "MEI", "Cnpj": "CNPJ",
    "Cpf": "CPF", "Clt": "CLT", "Pgdas": "PGDAS", "Das": "DAS", "Sped": "SPED",
    "Ecd": "ECD", "Ecf": "ECF", "Efd": "EFD", "Dctf": "DCTF", "Pis": "PIS",
    "Cofins": "COFINS", "Icms": "ICMS", "Ipi": "IPI", "Iss": "ISS", "Inss": "INSS",
    "Irpj": "IRPJ", "Csll": "CSLL", "Irpf": "IRPF", "Fgts": "FGTS", "Pj": "PJ",
    "Pf": "PF", "Cbs": "CBS", "Ibs": "IBS", "Cpc": "CPC", "Esocial": "eSocial",
    "Ads": "Ads", "Crm": "CRM", "Cs": "CS", "Seo": "SEO", "Vsl": "VSL",
    "Cpl": "CPL", "B2b": "B2B", "B2c": "B2C", "Ai": "AI", "Pmoc": "PMOC",
    "Ppci": "PPCI", "Spda": "SPDA", "Hvac": "HVAC", "Leed": "LEED",
    "Aqua": "AQUA", "Rfp": "RFP", "Rfi": "RFI", "Ux": "UX", "Ui": "UI",
    "Cta": "CTA", "Sla": "SLA", "Roas": "ROAS", "Cac": "CAC", "Ltv": "LTV",
    "Meddic": "MEDDIC", "Spin": "SPIN", "Bant": "BANT", "Pme": "PME",
    "Tt": "TT", "Mei": "MEI",
}


def humanize(slug: str) -> str:
    # remove o numero inicial
    slug_clean = re.sub(r"^\d+-", "", slug)
    # remove _-_ extra
    raw = slug_clean.replace("-", " ").replace("_", " ")
    # title case
    raw = " ".join(w if w.isupper() else w.capitalize() for w in raw.split())
    # aplica replacements técnicos
    for k, v in REPLACEMENTS_TECNICOS.items():
        raw = re.sub(rf"\b{k}\b", v, raw)
    # corta nomes muito longos pra caber no card
    if len(raw) > 55:
        raw = raw[:52] + "..."
    return raw


def categoria_de(slug: str, config: dict) -> str:
    slug_clean = re.sub(r"^\d+-", "", slug).lower()
    for pattern, cat in config["categorias"]:
        if re.match(pattern, slug_clean):
            return cat
    # fallback: usa a primeira categoria do nicho
    return config["categorias"][0][1]


def gerar_tarefas_template(slug: str, config: dict) -> list[str]:
    nome = humanize(slug)
    verbos = config["tarefa_verbos"]
    return [
        f"{verbos[0]} {nome} — {{cliente}}",
        f"{verbos[1]} {nome} — {{cliente}}",
        f"{verbos[2]} {nome} — {{cliente}}",
        f"Validando saída — {{cliente}}",
    ]


def build_agent(file: Path, config: dict, categoria_idx: dict) -> dict:
    raw = file.read_text(encoding="utf-8")
    fm = parse_frontmatter(raw)
    name = fm.get("name") or file.stem.split("-", 1)[-1]
    descr = re.sub(r"\s+", " ", fm.get("description", "Agente especialista.")).strip()
    if len(descr) > 180:
        descr = descr[:177] + "..."

    slug_clean = re.sub(r"^\d+-", "", file.stem)
    slug_id = slug_clean.lower().replace("_", "-")
    # remove caracteres não kebab
    slug_id = re.sub(r"[^a-z0-9-]+", "-", slug_id).strip("-")

    cat = categoria_de(file.stem, config)
    if cat not in categoria_idx:
        categoria_idx[cat] = len(categoria_idx)

    icone = config["icones"].get(cat, "box")
    cor = cor_categoria(config["cores_base"], categoria_idx[cat])

    # frequência baseada na duração default — quanto mais demorado, mais baixa
    dur = config["duracao_default"]
    if dur["media"] < 600:
        freq = "alta"
    elif dur["media"] < 1500:
        freq = "media"
    else:
        freq = "baixa"

    return {
        "id": slug_id,
        "nome": humanize(file.stem),
        "categoria": cat,
        "icone": icone,
        "cor": cor,
        "descricao": descr,
        "tarefas_template": gerar_tarefas_template(file.stem, config),
        "duracao_seg": dur,
        "frequencia": freq,
        "horario_pico": list(config["horario_pico_default"]),
        "economia_brl": config["economia_default"],
        "tags": [cat.lower().replace(" ", "-").replace("/", "-")],
    }


def main(nicho: str):
    if nicho not in NICHOS:
        sys.exit(f"nicho inválido: {nicho}. Aceitos: {list(NICHOS.keys())}")

    config = NICHOS[nicho]
    src_dir = Path(config["src_dir"])
    files = sorted(src_dir.glob("*.md"))

    if len(files) != 57:
        sys.exit(f"esperado 57 .md em {src_dir}, encontrados {len(files)}")

    categoria_idx: dict[str, int] = {}
    agents = [build_agent(f, config, categoria_idx) for f in files]

    # garante ids únicos (se algum colidir, adiciona sufixo)
    seen: dict[str, int] = {}
    for a in agents:
        if a["id"] in seen:
            seen[a["id"]] += 1
            a["id"] = f"{a['id']}-{seen[a['id']]}"
        else:
            seen[a["id"]] = 1

    catalog = {
        "nicho": nicho,
        "versao": "1.0.0",
        "metadata": {
            "titulo_painel": config["titulo_painel"],
            "descricao": config["descricao"],
            "paleta": config["paleta"],
            "tom": config["tom"],
        },
        "agents": agents,
        "pool_clientes_fallback": config["pool_clientes_fallback"],
    }

    DST_DIR.mkdir(parents=True, exist_ok=True)
    dst = DST_DIR / f"{nicho}.json"
    dst.write_text(json.dumps(catalog, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"✓ {dst.name} — {len(agents)} agents, {len(categoria_idx)} categorias, {dst.stat().st_size} bytes")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("uso: python3 gen_nicho.py <nicho>")
    main(sys.argv[1])
