// ex. scripts/build_npm.ts
import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./src/denoPact.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    // package.json properties
    name: "deno-pact",
    version: Deno.args[0],
    description: "Pact 🔗 Contract Testing for Deno 🦕, Powered by Rust 🦀",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/YOU54F/deno-pact.git",
    },
    bugs: {
      url: "https://github.com/YOU54F/deno-pact/issues",
    },
  },

  typeCheck: false,
  test: false,
  declaration: false,
  scriptModule: false,
});

// post build steps
Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
