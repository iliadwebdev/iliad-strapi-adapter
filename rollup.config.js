const nodeResolve = require("@rollup/plugin-node-resolve");
const typescript = require("rollup-plugin-typescript2");
const commonjs = require("@rollup/plugin-commonjs");
const pkg = require("./package.json");

console.log("using rollup.config.js");

const dependencies = ({ dependencies }) => Object.keys(dependencies || {});
const pkgDependencies = dependencies(pkg);

module.exports = {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "named",
      sourcemap: true,
      strict: false,
    },
  ],
  plugins: [
    typescript({
      // include: ["src/**/*.ts+(|x)", "node_modules/@iliad.dev/**/*.ts"],
      useTsconfigDeclarationDir: true,
    }),
    nodeResolve({
      extensions: [".js", ".ts", ".json"],
      modulesOnly: true, // Ensures that only modules are resolved
      // preferBuiltins: true,
      // browser: true,
    }),
    commonjs(),
  ],
  external: (id) => {
    console.log({ id });
    return [
      // <-- suppresses the warning
      "@iliad.dev/ts-utils",
      "@iliad.dev/hermes",
      "iliad-hermes-ts",
      "@strapi/strapi",
      "typescript",
      "qs",
    ]
      .concat(pkgDependencies)
      .includes(id);
  },
};
