import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import prettierPlugin from "eslint-plugin-prettier";
import babelParser from "@babel/eslint-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); // eslint-disable-line no-underscore-dangle
const __dirname = path.dirname(__filename); // eslint-disable-line no-underscore-dangle

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  ...compat.extends("airbnb-base", "prettier"),
  {
    plugins: {
      prettier: prettierPlugin,
    },
    languageOptions: {
      parser: babelParser,
      ecmaVersion: 2024,
      sourceType: "module",
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          parserOpts: {
            plugins: ["importAssertions"],
          },
        },
      },
    },
    rules: {
      "prettier/prettier": "error",
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          js: "always",
        },
      ],
      camelcase: [
        "error",
        {
          properties: "never",
          ignoreDestructuring: true,
          allow: [
            "article_img_url",
            "password_hash",
            "created_at",
            "article_id",
            "comment_id",
            "user_id",
            "inc_votes",
            "sort_by",
            "total_count",
            "avatar_url",
            "img_url",
          ],
        },
      ],
    },
  },
  {
    files: ["**/__tests__/**/*.js", "**/*.test.js", "**/*.spec.js"],
    languageOptions: {
      globals: {
        jest: "readonly",
        describe: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        afterEach: "readonly",
      },
    },
    rules: {
      "arrow-body-style": "off",
      "prefer-destructuring": "off",
    },
  },
  {
    files: ["eslint.config.js"],
    rules: {
      "import/no-extraneous-dependencies": "off",
      "no-underscore-dangle": "off",
    },
  },
];
