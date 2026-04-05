import js from "@eslint/js";
import nextConfig from "eslint-config-next/typescript";

export default [
  {
    ignores: [
      "node_modules",
      ".next",
      "dist",
      "build",
      "**/*.bak",
      "**/*.backup",
    ]
  },
  js.configs.recommended,
  ...nextConfig,
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
  },
  {
    files: ["jest.config.js", "jest.setup.js"],
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
];
