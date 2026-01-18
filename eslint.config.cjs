const tsParser = require("@typescript-eslint/parser");
const tseslint = require("@typescript-eslint/eslint-plugin");
const importPlugin = require("eslint-plugin-import");
const unusedImports = require("eslint-plugin-unused-imports");
const promise = require("eslint-plugin-promise");
const boundaries = require("eslint-plugin-boundaries");

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
      "boundaries/elements": [
        { type: "domain", pattern: "src/domain/*" },
        { type: "application", pattern: "src/application/*" },
        { type: "interface", pattern: "src/interface/*" },
        { type: "infrastructure", pattern: "src/infrastructure/*" }
      ]
    },

    rules: {
      /* ===============================
         TypeScript safety
      =============================== */
      "@typescript-eslint/no-explicit-any": "error",
      // "@typescript-eslint/no-unused-vars": "off",
      // "unused-imports/no-unused-imports": "error",

      /* ===============================
         Async / Promise correctness
      =============================== */
      // "promise/always-return": "warn",
      // "promise/no-return-wrap": "error",
      // "promise/no-nesting": "warn",
      // "promise/no-promise-in-callback": "warn",
      // "promise/no-callback-in-promise": "warn",

      /* ===============================
         Import discipline
      =============================== */
      // "import/no-cycle": "error",
      // "import/no-unresolved": "error",

      /* ===============================
         Clean Architecture enforcement
      =============================== */
      // "boundaries/element-types": [
      //   "error",
      //   {
      //     default: "disallow",
      //     rules: [
      //       { from: "domain", allow: ["domain"] },
      //       { from: "application", allow: ["domain", "application"] },
      //       { from: "interface", allow: ["application", "domain"] },
      //       {
      //         from: "infrastructure",
      //         allow: ["application", "domain", "infrastructure"]
      //       }
      //     ]
      //   }
      // ]
    }
  }
];
