import * as ffigen from "https://deno.land/x/ffigen/mod.ts";

if (Deno.args.includes("-d")) {
  await ffigen.extractSymbolDefinitions({
    input: "input/pact.h",
    output: "input/pact.json",
  });
}

if (Deno.args.includes("-s")) {
  await ffigen.extractExposedSymbols({
    input: "input/libpact_ffi.so",
    output: "input/libpact_ffi.txt",
  });
}

await ffigen.generateBindings({
  libName: "PactFfi",
  libPrefix: "",
  symbolsFile: "input/pact.json",
  exposedSymbolsFile: "input/libpact_ffi.txt",
  headersBaseUrl: ".",
  outputFolder: "lib",
});
