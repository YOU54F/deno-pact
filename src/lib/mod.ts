import { PactFfi } from "./types.ts";
import { PactFfi_SYMBOLS } from "./symbols.ts";

export * from "./safe-ffi.ts";
export type { PactFfi };

export function loadPactFfi(path: string): typeof PactFfi {
  const lib = Deno.dlopen(path, PactFfi_SYMBOLS);

  return { ...lib.symbols, $$close: () => lib.close() } as never;
}
