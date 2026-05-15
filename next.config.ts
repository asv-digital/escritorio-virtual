import type { NextConfig } from "next";

const NICHO = process.env.NICHO || "contadores";

const NICHOS_VALIDOS = [
  "contadores",
  "advogados",
  "engenheiros",
  "arquitetos",
  "marketing",
  "funcionarios",
] as const;

if (!NICHOS_VALIDOS.includes(NICHO as (typeof NICHOS_VALIDOS)[number])) {
  throw new Error(
    `NICHO inválido: ${NICHO}. Valores aceitos: ${NICHOS_VALIDOS.join(", ")}`,
  );
}

const nextConfig: NextConfig = {
  output: "export",
  distDir: `out/${NICHO}`,
  images: { unoptimized: true },
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_NICHO: NICHO,
    NEXT_PUBLIC_VERSAO: process.env.npm_package_version || "0.1.0",
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "date-fns"],
  },
};

export default nextConfig;
