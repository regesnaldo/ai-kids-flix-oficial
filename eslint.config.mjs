// ESLint Flat Config — MENTE.AI
// Next.js 16 + TypeScript (native flat config)

import js from "@eslint/js";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default [
  js.configs.recommended,
  ...nextCoreWebVitals,
  ...nextTypescript,

  // Regras customizadas do projeto
  {
    rules: {
      // Console permitido (logging server-side)
      "no-console": "off",

      // Regras que conflitam com o padrão Next.js no flat config
      "no-unused-vars": "off",
      "no-undef": "off",

      // Desligado — o padrão next/typescript já cobre com granularidade
      "@typescript-eslint/no-unused-vars": "off",

      // Padrões legítimos de inicialização em effects (localStorage, random particles)
      // Desligado porque o código usa intencionalmente padrões como setState em
      // effects sincronizados (contagem regressiva, particles, polling com interval)
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
      "react-hooks/immutability": "warn",

      // any é aceitável onde o tipo é dinâmico/desconhecido (cache, respostas API)
      // Mas manter como erro para incentivar tipagem gradual
    },
  },

  // Ignorar diretórios de build/test
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "dist/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      "public/**",
    ],
  },
];
