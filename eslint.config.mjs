import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";

export default tseslint.config(
  // Arquivos e pastas ignorados
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "dist/**",
      "build/**",
      "src.backup.*/**",
      "playwright-report/**",
      "test-results/**",
    ],
  },

  // Configuração base JavaScript
  js.configs.recommended,

  // Configuração TypeScript (parse + regras)
  ...tseslint.configs.recommended,

  // React Hooks plugin (registra o plugin para que comentários eslint-disable funcionem)
  {
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      // exhaustive-deps como warn; rules-of-hooks desabilitado para evitar falsos positivos
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "off",
    },
  },

  // Overrides globais para TS/TSX
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // Permite uso de 'any' sem erro crítico (apenas warning)
      "@typescript-eslint/no-explicit-any": "warn",
      // Permite variáveis não usadas com prefixo _
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      // Permite requires dinâmicos em scripts Node
      "@typescript-eslint/no-require-imports": "warn",
    },
  },

  // Globals para arquivos JS puros (scripts, configs)
  {
    files: ["**/*.{js,cjs,mjs}"],
    languageOptions: {
      globals: {
        require: "readonly",
        module: "readonly",
        process: "readonly",
        __dirname: "readonly",
        console: "readonly",
        Buffer: "readonly",
      },
    },
    rules: {
      // JS puro: desabilita regras TypeScript
      "@typescript-eslint/no-require-imports": "off",
    },
  },

  // Globals específicos para testes
  {
    files: [
      "jest.config.js",
      "jest.setup.js",
      "**/*.test.{ts,tsx,js}",
      "**/*.spec.{ts,tsx,js}",
    ],
    languageOptions: {
      globals: {
        require: "readonly",
        module: "readonly",
        process: "readonly",
        __dirname: "readonly",
        console: "readonly",
        Buffer: "readonly",
        jest: "readonly",
        expect: "readonly",
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        global: "readonly",
        window: "readonly",
        URLSearchParams: "readonly",
      },
    },
  },
);
