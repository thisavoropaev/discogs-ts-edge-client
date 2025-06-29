import { build, emptyDir } from "https://deno.land/x/dnt@0.40.0/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./src/index.ts"],
  outDir: "./npm",
  shims: {
    deno: true,
  },
  package: {
    name: "discogs-ts-client",
    version: Deno.args[0],
    description: "A TypeScript client for the Discogs API for server and edge environments.",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/thisavoropaev/discogs-ts-client.git",
    },
    bugs: {
      url: "https://github.com/thisavoropaev/discogs-ts-client/issues",
    },
  },
  postBuild() {
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
