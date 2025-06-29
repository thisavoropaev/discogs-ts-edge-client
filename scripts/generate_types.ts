#!/usr/bin/env -S deno run --allow-read --allow-write

import { walk } from "https://deno.land/std@0.224.0/fs/walk.ts";
import { ensureDir } from "https://deno.land/std@0.224.0/fs/ensure_dir.ts";
import { join } from "https://deno.land/std@0.224.0/path/mod.ts";

const SRC_DIR = "./src";
const DIST_DIR = "./dist";

async function generateTypes() {
  console.log("📝 Generating TypeScript declarations...");

  await ensureDir(DIST_DIR);

  // Collect all TypeScript files
  const tsFiles: string[] = [];

  for await (
    const entry of walk(SRC_DIR, {
      exts: [".ts"],
      skip: [/\.test\.ts$/, /\.spec\.ts$/],
    })
  ) {
    if (entry.isFile) {
      tsFiles.push(entry.path);
    }
  }

  // Read main index.ts to extract exports
  const indexPath = join(SRC_DIR, "index.ts");
  let indexContent = "";

  try {
    indexContent = await Deno.readTextFile(indexPath);
  } catch {
    console.warn("⚠️ No index.ts found, creating minimal types");
  }

  // Extract export statements
  const exports = extractExports(indexContent);

  // Generate main declaration file
  const declarationContent = generateDeclarationContent(exports);

  await Deno.writeTextFile(join(DIST_DIR, "index.d.ts"), declarationContent);

  console.log("✅ TypeScript declarations generated");
}

function extractExports(content: string): string[] {
  const exportRegex =
    /export\s+(?:type\s+|interface\s+|class\s+|function\s+|const\s+|let\s+|var\s+)?([\w\s,{}*]+)(?:\s+from\s+['"][^'"]+['"])?/g;
  const exports: string[] = [];
  let match;

  while ((match = exportRegex.exec(content)) !== null) {
    const exportClause = match[1].trim();
    if (exportClause.includes("{")) {
      // Named exports like { foo, bar }
      const namedExports = exportClause
        .replace(/[{}]/g, "")
        .split(",")
        .map((e) => e.trim())
        .filter((e) => e.length > 0);
      exports.push(...namedExports);
    } else if (exportClause === "*") {
      // Re-export all
      exports.push("*");
    } else {
      // Single export
      exports.push(exportClause);
    }
  }

  return [...new Set(exports)];
}

function generateDeclarationContent(exports: string[]): string {
  const header =
    `// Generated TypeScript declarations for edge runtime compatibility
// This file provides type definitions for the discogs-ts-client library

`;

  const commonTypes = `
// Common types for Discogs API
export type DiscogsResponse<T = unknown> = {
  data: T;
  pagination?: {
    page: number;
    pages: number;
    per_page: number;
    items: number;
    urls: {
      last?: string;
      next?: string;
    };
  };
};

export type DiscogsError = {
  message: string;
  code?: number;
};

export type DiscogsClientConfig = {
  userAgent: string;
  consumerKey?: string;
  consumerSecret?: string;
  token?: string;
  tokenSecret?: string;
};

// Main client class
export declare class DiscogsClient {
  constructor(config: DiscogsClientConfig);
  
  // Auth methods
  getRequestToken(): Promise<{ token: string; tokenSecret: string; authorizeUrl: string }>;
  getAccessToken(requestToken: string, requestTokenSecret: string, verifier: string): Promise<{ token: string; tokenSecret: string }>;
  
  // API methods
  getIdentity(): Promise<DiscogsResponse<any>>;
  getProfile(username: string): Promise<DiscogsResponse<any>>;
  search(query: string, options?: Record<string, any>): Promise<DiscogsResponse<any>>;
  getRelease(id: number): Promise<DiscogsResponse<any>>;
  getMaster(id: number): Promise<DiscogsResponse<any>>;
  getArtist(id: number): Promise<DiscogsResponse<any>>;
  getLabel(id: number): Promise<DiscogsResponse<any>>;
}

// Default export
export default DiscogsClient;
`;

  return header + commonTypes;
}

if (import.meta.main) {
  await generateTypes();
}
