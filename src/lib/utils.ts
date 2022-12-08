import * as path from "https://deno.land/std/path/mod.ts";
export function getModuleDir(importMeta: ImportMeta): string {
  return path.resolve(path.dirname(path.fromFileUrl(importMeta.url)));
}
