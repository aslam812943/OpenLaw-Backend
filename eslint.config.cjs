const tsParser = require("@typescript-eslint/parser");
const tseslint = require("@typescript-eslint/eslint-plugin");
const importPlugin = require("eslint-plugin-import");
const unusedImports = require("eslint-plugin-unused-imports");

module.exports = [
  {
    files: ["src/**/*.ts"],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      }
    },

    plugins: {
      "@typescript-eslint": tseslint,
      import: importPlugin,
      "unused-imports": unusedImports,
      promise,
      boundaries
    },

    settings: {
      "import/resolver": {
        typescript: {}
      },
     
    },

    rules: {

      "@typescript-eslint/no-explicit-any": "error",

    }
  }
];
