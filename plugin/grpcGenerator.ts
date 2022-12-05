const source =
  "https://raw.githubusercontent.com/pact-foundation/pact-plugins/main/proto/plugin.proto";
// const source =
//   "https://raw.githubusercontent.com/pact-foundation/pact-plugins/main/examples/protobuf/area_calculator_example/area_calculator.proto";
const response = await fetch(source);
const blob = await response.blob();

// We convert the blob into a typed array
// so we can use it to write the data into the file
const buf = await blob.arrayBuffer();
const protoFile = new Uint8Array(buf);

import { GrpcServer } from "https://deno.land/x/grpc_basic@0.4.6/server.ts";
import { getAvailablePort } from "https://deno.land/x/port/mod.ts";
import { fromProto } from "https://deno.land/x/grpc_basic@0.4.6/gen/dts.ts";

const generatedTypings = fromProto(new TextDecoder().decode(protoFile))
// console.log(generatedTypings)
await Deno.writeTextFile("./proto.gen.d.ts", generatedTypings);

const server = new GrpcServer();

server.addService(new TextDecoder().decode(protoFile), {});

const main = async () => {
  console.log(`Deno Pact Plugin`);
  const port: number = Deno.env.get("PORT")
    ? Number(Deno.env.get("PORT"))
    : (await getAvailablePort()) ?? 50052;
  console.log(JSON.stringify({ port, serverKey: crypto.randomUUID() }));
  for await (const conn of Deno.listen({ port })) {
    server.handle(conn);
  }
};

await main();
