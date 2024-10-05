import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import prettier from "eslint-config-prettier";

export default [
  { files: ["**/*.{js,mjs,cjs,ts,vue}"] },
  { languageOptions: { globals: globals.browser, ecmaVersion: 2021, sourceType: "module" } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs["recommended-requiring-type-checking"],
  ...pluginVue.configs["flat/strongly-recommended"],
  prettier,  // 集成 Prettier 配置
  {
    files: ["**/*.vue"],
    languageOptions: { parserOptions: { parser: tseslint.parser, project: './tsconfig.json' } }
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["error"],
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn"
    }
  }
];
