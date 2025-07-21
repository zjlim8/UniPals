import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: ["tsconfig.json", "tsconfig.dev.json"],
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
    },
    rules: {
      quotes: ["error", "double"],
      indent: ["error", 2],
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    ignores: ["lib/**/*", "generated/**/*"],
  },
];
