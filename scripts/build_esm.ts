#!/usr/bin/env -S deno run --allow-read --allow-write

import { ensureDir } from "https://deno.land/std@0.208.0/fs/mod.ts";
import { join } from "https://deno.land/std@0.208.0/path/mod.ts";
import { copy } from "https://deno.land/std@0.224.0/fs/copy.ts";
import { exists } from "https://deno.land/std@0.224.0/fs/exists.ts";

const DIST_DIR = "dist";

// Collect all TypeScript files in a directory
async function collectSourceFiles(dir: string): Promise<string[]> {
  const files: string[] = [];

  for await (const entry of Deno.readDir(dir)) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory) {
      const subFiles = await collectSourceFiles(fullPath);
      files.push(...subFiles);
    } else if (entry.name.endsWith(".ts") && !entry.name.endsWith(".d.ts")) {
      files.push(fullPath);
    }
  }

  return files;
}

// Process a file for bundling - remove imports/exports and return clean code
async function processFileForBundle(filePath: string): Promise<string | null> {
  try {
    const content = await Deno.readTextFile(filePath);

    // Remove import statements (they'll be inlined)
    const processedContent = content
      .replace(/^import\s+.*?from\s+["'][^"']*["'];?\s*$/gm, "")
      .replace(/^import\s+["'][^"']*["'];?\s*$/gm, "")
      .replace(/^export\s*\{[^}]*\}\s*from\s*["'][^"']*["'];?\s*$/gm, "")
      .replace(/^export\s*\*\s*from\s*["'][^"']*["'];?\s*$/gm, "")
      // Keep export declarations but remove 'export' keyword for internal functions
      .replace(
        /^export\s+(const|let|var|function|class|interface|type|enum)/gm,
        "$1",
      )
      .replace(/^export\s*\{/gm, "// Exported: {")
      .replace(/^export\s+default/gm, "const defaultExport =")
      // Remove empty lines
      .replace(/^\s*$/gm, "")
      .split("\n")
      .filter((line) => line.trim() !== "")
      .join("\n");

    return processedContent;
  } catch (error) {
    console.warn(`⚠️ Could not process file ${filePath}:`, error);
    return null;
  }
}

async function buildESM() {
  console.log("🚀 Building ESM bundle for edge runtime...");

  // Ensure dist directory exists
  await ensureDir(DIST_DIR);

  // Create a proper bundle by collecting all source files
  const allFiles = await collectSourceFiles("src");
  const bundledModules = new Map<string, string>();

  // Process each file and collect exports
  for (const file of allFiles) {
    const content = await processFileForBundle(file);
    if (content) {
      const moduleName = file.replace(/^src\//, "").replace(/\.ts$/, "");
      bundledModules.set(moduleName, content);
    }
  }

  // Create the final bundle
  let bundleContent = `// Discogs TypeScript Client - Edge Runtime Bundle
// Generated on ${new Date().toISOString()}

`;

  // Add all module contents
  for (const [moduleName, content] of bundledModules) {
    bundleContent += `// Module: ${moduleName}\n${content}\n\n`;
  }

  await Deno.writeTextFile(`${DIST_DIR}/index.js`, bundleContent);
  console.log("✅ ESM bundle created: dist/index.js");

  // Create package.json for ESM
  const packageJson = {
    name: "discogs-ts-client",
    version: "1.0.0",
    type: "module",
    main: "index.js",
    exports: {
      ".": {
        import: "./index.js",
        types: "./index.d.ts",
      },
    },
    engines: {
      node: ">=18",
    },
    keywords: ["discogs", "api", "client", "edge", "serverless"],
    repository: {
      type: "git",
      url: "git+https://github.com/your-username/discogs-ts-client.git",
    },
    license: "MIT",
  };

  await Deno.writeTextFile(
    `${DIST_DIR}/package.json`,
    JSON.stringify(packageJson, null, 2),
  );

  console.log("✅ Package.json created");

  // Generate TypeScript declarations
  const typeCommand = new Deno.Command("deno", {
    args: ["run", "--allow-read", "--allow-write", "scripts/generate_types.ts"],
    stdout: "piped",
    stderr: "piped",
  });

  const typeResult = await typeCommand.output();

  if (!typeResult.success) {
    console.warn("⚠️ Type generation failed, but bundle is still usable");
  } else {
    console.log("✅ TypeScript declarations generated");
  }

  // Copy README if exists
  if (await exists("README.md")) {
    await copy("README.md", `${DIST_DIR}/README.md`, { overwrite: true });
    console.log("✅ README.md copied");
  }

  console.log("🎉 ESM build complete! Ready for edge runtime deployment.");
}

if (import.meta.main) {
  await buildESM();
}
