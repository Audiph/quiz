import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";
import onlyWarn from "eslint-plugin-only-warn";

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
    },
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector: "TSUnknownKeyword",
          message: "Use a more specific type instead of unknown",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
          args: "all",
          caughtErrors: "all",
        },
      ],
      "@typescript-eslint/no-unused-expressions": "error",
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/no-inferrable-types": [
        "error",
        {
          ignoreParameters: false,
          ignoreProperties: false,
        },
      ],
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "*.config.js",
      "*.config.ts",
      "*.config.mjs",
      ".next/**",
      ".turbo/**",
      "build/**",
      "coverage/**",
    ],
  },
];
