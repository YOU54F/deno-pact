import { getClient } from "https://deno.land/x/grpc_basic@0.4.6/client.ts";
import { Greeter } from "./greeter.d.ts";

const protoPath = new URL("./greeter.proto", import.meta.url);
const protoFile = await Deno.readTextFile(protoPath);

export const getGreeterClient = (port?: number) => {
  return getClient<Greeter>({
    port: port ?? 37757,
    root: protoFile,
    serviceName: "Greeter",
  });
};

export const sayHello = async (port?: number) => {
  const client = getGreeterClient(port);
  const result = await client.SayHello({ name: "unary #1" });
  client.close();
  return result;
};
export const shoutHello = async (port?: number) => {
  const client = getGreeterClient(port);
  const results = [];
  for await (const reply of client.ShoutHello({ name: "streamed" })) {
    results.push(reply);
  }
  client.close();
  return results;
};

import { parse } from "https://deno.land/std@0.119.0/flags/mod.ts";
const flags = parse(Deno.args, {
  boolean: ["run"],
  string: ["port"],
});
if (flags.run) {
  if (flags.port) {
    console.log(await sayHello(flags.port));
    console.log(await shoutHello(flags.port));
  } else {
    console.log(await sayHello());
    console.log(await shoutHello());
  }
}
