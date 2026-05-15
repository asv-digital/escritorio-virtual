"""Configs por nicho — paleta, categorias, ícones, timing, pool de clientes fallback."""

# ════════════════════════════════════════════════════════════════════
# ADVOGADOS
# ════════════════════════════════════════════════════════════════════

ADVOGADOS = {
    "src_dir": "/tmp/agents-advogados-inspect/agents",
    "titulo_painel": "Escritório Jurídico 24h",
    "descricao": "57 agentes jurídicos trabalhando 24/7 — peças, prazos, contratos, recursos, direito civil/trabalhista/criminal/tributário.",
    "paleta": {
        "primary": "#8B7355",
        "secondary": "#2D2419",
        "accent": "#C9A876",
        "background": "#0A0A0A",
        "surface": "#1A1612",
    },
    "tom": "formal",
    "categorias": [
        (r"^(peticao|inicial|contestacao|replica)", "Petição"),
        (r"^(recurso|apelacao|agravo|embargos)", "Recurso"),
        (r"^(contrato|acordo)", "Contrato"),
        (r"^(audiencia|sustentacao)", "Audiência"),
        (r"^(parecer|opiniao)", "Parecer"),
        (r"^(divorcio|inventario|familia)", "Família"),
        (r"^(criminal|crime|defesa)", "Criminal"),
        (r"^(trabalhista|clt|rescisao)", "Trabalhista"),
        (r"^(tributario|imposto|defesa-fiscal)", "Tributário"),
        (r"^(civil|indenizacao|danos)", "Cível"),
        (r"^(empresarial|societario|m-a)", "Empresarial"),
        (r"^(prazo|protocolo|peticionamento)", "Procedimental"),
        (r"^(consumidor|pequenas-causas)", "Consumidor"),
        (r"^(lgpd|digital)", "LGPD/Digital"),
    ],
    "icones": {
        "Petição": "scroll-text", "Recurso": "file-up", "Contrato": "file-signature",
        "Audiência": "gavel", "Parecer": "lightbulb", "Família": "heart-handshake",
        "Criminal": "shield-alert", "Trabalhista": "briefcase", "Tributário": "calculator",
        "Cível": "scale", "Empresarial": "building", "Procedimental": "calendar-clock",
        "Consumidor": "shopping-bag", "LGPD/Digital": "shield-check",
    },
    "cores_base": "#8B7355", "cores_accent": "#C9A876",
    "horario_pico_default": [9, 17],
    "duracao_default": {"min": 600, "media": 1500, "max": 3600},
    "economia_default": 180,
    "tarefa_verbos": ["Redigindo", "Revisando", "Protocolando", "Analisando", "Elaborando"],
    "pool_clientes_fallback": [
        "Construtora Aliança", "Lopes Advocacia Cliente", "Silva & Cia LTDA",
        "Marcos R. (PF)", "Tech Solutions", "Padaria Central", "Maria Souza (PF)",
        "Boutique Style", "Restaurante Sabor", "Importadora Global",
        "João Pereira (PF)", "Construtora Norte", "Consultoria Beta",
    ],
}

# ════════════════════════════════════════════════════════════════════
# ENGENHEIROS
# ════════════════════════════════════════════════════════════════════

ENGENHEIROS = {
    "src_dir": "/tmp/agents-engenheiros-extracted",
    "titulo_painel": "Escritório de Engenharia 24h",
    "descricao": "57 agentes de engenharia trabalhando 24/7 — cálculo estrutural, projetos elétrico/hidráulico, NBR, ART, vistorias, laudos.",
    "paleta": {
        "primary": "#FFA94D",
        "secondary": "#1A1A1A",
        "accent": "#FFD700",
        "background": "#0A0A0A",
        "surface": "#181612",
    },
    "tom": "tecnico",
    "categorias": [
        (r"^calculo-estrutural", "Cálculo Estrutural"),
        (r"^(alvenaria|fundacao|conten)", "Fundação/Contenção"),
        (r"^(projeto-eletrico|spda)", "Elétrico"),
        (r"^(projeto-hidraulico|spi|esgoto|pluvial)", "Hidráulico"),
        (r"^(projeto-incendio|ppci|hidrante)", "Incêndio"),
        (r"^(projeto-climatizacao|ar-condicionado|hvac)", "Climatização"),
        (r"^(planejamento|cronograma|orcamento)", "Planejamento"),
        (r"^(vistoria|patologia|reforma)", "Vistoria"),
        (r"^(laudo|art|memorial)", "Laudo/ART"),
        (r"^(execucao|obra|inspeção)", "Execução"),
        (r"^(seguranca|nr-18|epi)", "Segurança"),
        (r"^(sustenta|eficiencia|leed)", "Sustentabilidade"),
        (r"^(geotecnia|sondagem)", "Geotecnia"),
        (r"^(licen|aprovacao|prefeitura)", "Aprovação"),
    ],
    "icones": {
        "Cálculo Estrutural": "ruler", "Fundação/Contenção": "mountain",
        "Elétrico": "zap", "Hidráulico": "droplets", "Incêndio": "flame",
        "Climatização": "wind", "Planejamento": "calendar", "Vistoria": "search",
        "Laudo/ART": "file-check", "Execução": "hammer", "Segurança": "hard-hat",
        "Sustentabilidade": "leaf", "Geotecnia": "layers", "Aprovação": "stamp",
    },
    "cores_base": "#FFA94D", "cores_accent": "#FFD700",
    "horario_pico_default": [8, 17],
    "duracao_default": {"min": 600, "media": 1800, "max": 5400},
    "economia_default": 220,
    "tarefa_verbos": ["Calculando", "Dimensionando", "Verificando", "Validando", "Gerando memória de"],
    "pool_clientes_fallback": [
        "Obra Residencial Vila Madá", "Galpão Industrial Pirituba",
        "Reforma Edifício Centro", "Sobrado Alphaville",
        "Loja Shopping Norte", "Hotel Beira-Mar",
        "Fábrica Têxtil", "Casa Riviera",
        "Edifício Comercial Faria Lima", "Posto de Combustível",
        "Escola Municipal", "Pavilhão Eventos",
    ],
}

# ════════════════════════════════════════════════════════════════════
# ARQUITETOS
# ════════════════════════════════════════════════════════════════════

ARQUITETOS = {
    "src_dir": "/tmp/agents-arquitetos-extracted",
    "titulo_painel": "Estúdio de Arquitetura 24h",
    "descricao": "57 agentes de arquitetura trabalhando 24/7 — concept, projeto executivo, render, especificações, licenciamento, interiores.",
    "paleta": {
        "primary": "#B4A380",
        "secondary": "#2A2520",
        "accent": "#D4C4A0",
        "background": "#0F0E0C",
        "surface": "#1A1815",
    },
    "tom": "minimalista",
    "categorias": [
        (r"^(estudo|viabilidade|levantamento|programa)", "Concept"),
        (r"^(estudo-preliminar|anteprojeto)", "Anteprojeto"),
        (r"^(projeto-executivo|legal|aprovacao)", "Executivo"),
        (r"^(render|3d|imagem|maquete)", "Render"),
        (r"^(interiores|mobiliario|iluminacao)", "Interiores"),
        (r"^(paisagismo|jardim)", "Paisagismo"),
        (r"^(reforma|retrofit|requalifica)", "Reforma"),
        (r"^(comercial|loja|escritorio)", "Comercial"),
        (r"^(residencial|casa|apartamento)", "Residencial"),
        (r"^(corporativo|office)", "Corporativo"),
        (r"^(hoteleiro|hospital|escolar)", "Especial"),
        (r"^(detalhamento|caderno|especificacao)", "Detalhamento"),
        (r"^(visita|acompanhamento|obra)", "Acompanhamento"),
        (r"^(urbano|masterplan)", "Urbano"),
    ],
    "icones": {
        "Concept": "lightbulb", "Anteprojeto": "pencil-ruler", "Executivo": "file-text",
        "Render": "image", "Interiores": "sofa", "Paisagismo": "trees",
        "Reforma": "wrench", "Comercial": "store", "Residencial": "home",
        "Corporativo": "building-2", "Especial": "landmark", "Detalhamento": "scan-line",
        "Acompanhamento": "footprints", "Urbano": "map",
    },
    "cores_base": "#B4A380", "cores_accent": "#D4C4A0",
    "horario_pico_default": [10, 18],
    "duracao_default": {"min": 900, "media": 2400, "max": 7200},
    "economia_default": 280,
    "tarefa_verbos": ["Desenhando", "Detalhando", "Renderizando", "Especificando", "Aprovando"],
    "pool_clientes_fallback": [
        "Apto Higienópolis 180m²", "Casa Praia Cabo Frio",
        "Loft Vila Madá", "Restaurante Centro",
        "Casa Campo Tabuão", "Cobertura Itaim",
        "Loja Shopping JK", "Escritório Conceito",
        "Sobrado Alphaville", "Estúdio Pinheiros",
        "Showroom Berrini", "Casa Praia Maresias",
    ],
}

# ════════════════════════════════════════════════════════════════════
# MARKETING (agência)
# ════════════════════════════════════════════════════════════════════

MARKETING = {
    "src_dir": "/tmp/agents-agencia-marketing-extracted",
    "titulo_painel": "Agência de Marketing 24h",
    "descricao": "57 agentes de marketing trabalhando 24/7 — tráfego, criativos, copywriting, SEO, CRM, lançamentos, social media.",
    "paleta": {
        "primary": "#FF4D8D",
        "secondary": "#0F0F1A",
        "accent": "#FFD60A",
        "background": "#0A0A14",
        "surface": "#16161F",
    },
    "tom": "vibrante",
    "categorias": [
        (r"^(prospec|outbound|leadgen|isca)", "Prospecção"),
        (r"^(audit|discovery|RFP)", "Discovery"),
        (r"^(proposta|onboarding|kickoff)", "Onboarding"),
        (r"^(estrategia|planejamento|kpi)", "Estratégia"),
        (r"^(criativo|design|branding)", "Criativo"),
        (r"^(copy|writing|texto)", "Copy"),
        (r"^(meta-ads|facebook|instagram)", "Meta Ads"),
        (r"^(google-ads|sem|search)", "Google Ads"),
        (r"^(tiktok|tt)", "TikTok"),
        (r"^(seo|conteudo|blog)", "SEO/Conteúdo"),
        (r"^(email|crm|fluxo)", "Email/CRM"),
        (r"^(lancamento|cpl|webinar)", "Lançamento"),
        (r"^(relat|analise|dashboard)", "Análise"),
        (r"^(social|reels|stories)", "Social"),
    ],
    "icones": {
        "Prospecção": "user-plus", "Discovery": "search", "Onboarding": "rocket",
        "Estratégia": "target", "Criativo": "palette", "Copy": "pen-tool",
        "Meta Ads": "facebook", "Google Ads": "search", "TikTok": "music-2",
        "SEO/Conteúdo": "trending-up", "Email/CRM": "mail", "Lançamento": "rocket",
        "Análise": "bar-chart-3", "Social": "instagram",
    },
    "cores_base": "#FF4D8D", "cores_accent": "#FFD60A",
    "horario_pico_default": [9, 18],
    "duracao_default": {"min": 240, "media": 720, "max": 1800},
    "economia_default": 95,
    "tarefa_verbos": ["Criando", "Otimizando", "Analisando", "Publicando", "Testando"],
    "pool_clientes_fallback": [
        "E-commerce Moda Casual", "Clínica Estética Glow",
        "SaaS Beta Analytics", "Pizzaria Mama Mia",
        "Curso Online Tráfego", "Academia Power Fit",
        "Restaurante Sabor", "Loja Pet Shop Pro",
        "Mentoria Digital", "Curso Investimentos",
        "App Delivery Local", "Imobiliária Premium",
    ],
}

# ════════════════════════════════════════════════════════════════════
# FUNCIONÁRIOS (geral)
# ════════════════════════════════════════════════════════════════════

FUNCIONARIOS = {
    "src_dir": "/tmp/agents-funcionarios-inspect/agents",
    "titulo_painel": "Departamento Operacional 24h",
    "descricao": "57 agentes funcionários trabalhando 24/7 — tráfego, marketing, vendas, WhatsApp, lançamento, conteúdo, design, ops, financeiro, RH.",
    "paleta": {
        "primary": "#4D8BFF",
        "secondary": "#1A1F2E",
        "accent": "#06B6D4",
        "background": "#0A0E18",
        "surface": "#14181F",
    },
    "tom": "confiante",
    "categorias": [
        (r"^(meta-|trafego-meta|facebook)", "Tráfego Meta"),
        (r"^(google-|trafego-google)", "Tráfego Google"),
        (r"^(lancamento)", "Lançamento"),
        (r"^(instagram|conteudo|reels)", "Conteúdo"),
        (r"^(whatsapp|wpp)", "WhatsApp"),
        (r"^(comercial|venda|crm|proposta)", "Comercial"),
        (r"^(marketing|funil|persona|email)", "Marketing"),
        (r"^(design|brand|naming)", "Design"),
        (r"^(negocio|diagnostico|kpi|forecast|pitch)", "Negócios"),
        (r"^(ops|cs|automacao|financeiro|rh|dados|produto|documentacao|processo)", "Operações"),
    ],
    "icones": {
        "Tráfego Meta": "facebook", "Tráfego Google": "search", "Lançamento": "rocket",
        "Conteúdo": "video", "WhatsApp": "message-circle", "Comercial": "handshake",
        "Marketing": "megaphone", "Design": "palette", "Negócios": "briefcase",
        "Operações": "settings",
    },
    "cores_base": "#4D8BFF", "cores_accent": "#06B6D4",
    "horario_pico_default": [9, 18],
    "duracao_default": {"min": 300, "media": 900, "max": 2400},
    "economia_default": 120,
    "tarefa_verbos": ["Executando", "Otimizando", "Analisando", "Produzindo", "Validando"],
    "pool_clientes_fallback": [
        "E-commerce Moda Casual", "Clínica Estética Glow",
        "Mentoria Digital Pro", "Curso Investimentos",
        "SaaS Analytics", "Restaurante Sabor",
        "Loja Pet Shop", "Academia Power Fit",
        "Pizzaria Família", "Imobiliária Premium",
        "Curso de Idiomas", "Salão Vip",
    ],
}

# ════════════════════════════════════════════════════════════════════

NICHOS = {
    "advogados": ADVOGADOS,
    "engenheiros": ENGENHEIROS,
    "arquitetos": ARQUITETOS,
    "marketing": MARKETING,
    "funcionarios": FUNCIONARIOS,
}
