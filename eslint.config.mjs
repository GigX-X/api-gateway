import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/**
 * * specifying different configurations for TypeScript files (.ts, .mts) and JavaScript files.

  For TypeScript files:
  added Node.js and Express globals, which are more appropriate for the server environment.
  specified the TypeScript parser and pointed it to tsconfig.json file.
  included both recommended JavaScript and TypeScript rules.

  For JavaScript files, we're using the recommended JavaScript configuration.

  Added files such as node_modules and dist to ignores.
*/

/**
 * TODO: do "npm run lint" before committing or to check for potential issues 
 * TODO: Inorder to Fix any issues !
 * TODO: npm run lint:fix
 * 
 * ! Inorder to do any of those commands above add the scripts to package.json !
 */

export default [
  {
    ignores: ["node_modules/**", "dist/**"],
  },
  {
    files: ["**/*.{ts,mts}"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.express,
      },
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
    },
  },
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    ...pluginJs.configs.recommended,
  },
  {
    files: ["index.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      sourceType: "commonjs",
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      "no-undef": "off", // Turn off no-undef for this file
    },
  },
];
