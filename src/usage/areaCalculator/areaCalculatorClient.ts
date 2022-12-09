import * as path from "https://deno.land/std/path/mod.ts";
import { getClient } from "https://deno.land/x/grpc_basic@0.4.6/client.ts";
import { Calculator } from "./area_calculator.d.ts";

const protoPath = new URL(
  path.join(getModuleDir(import.meta), "area_calculator.proto"),
  import.meta.url,
);
const protoFile = await Deno.readTextFile(
  Deno.build.os === "windows" ? protoPath.href : protoPath,
);
export async function getShapeMessage(port?: number) {
  const client = getClient<Calculator>({
    port: port ?? 37757,
    root: protoFile,
    serviceName: "Calculator",
  });

  const result = await client.calculateOne({
    rectangle: {
      length: 3,
      width: 4,
    },
  });
  client.close();
  return result;
}

// deno run -A --unstable pact/usage/areaCalculator/areaCalculatorClient.ts --run --port 37757
import { parse } from "https://deno.land/std@0.119.0/flags/mod.ts";
import { getModuleDir } from "../../lib/utils.ts";
const flags = parse(Deno.args, {
  boolean: ["run"],
  string: ["port"],
});
if (flags.run) {
  if (flags.port) {
    console.log(await getShapeMessage(flags.port));
  } else {
    console.log(await getShapeMessage());
  }
}
