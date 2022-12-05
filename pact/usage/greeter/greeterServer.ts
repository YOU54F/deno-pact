import { GrpcServer } from "https://deno.land/x/grpc_basic@0.4.6/server.ts";
import { Greeter } from "./greeter.d.ts";

const port = 37757;
const server = new GrpcServer();

const protoPath = new URL("./greeter.proto", import.meta.url);
const protoFile = await Deno.readTextFile(protoPath);

server.addService<Greeter>(protoFile, {
  
   async SayHello({ name }): Promise<{ message: string; }> {
    const message = `hello ${name || "stranger"}`;
    return Promise.resolve({ message });
  },

  async *ShoutHello({ name }): AsyncGenerator<{ message: string; }, void, unknown> {
    for (const n of [0, 1, 2]) {
      const message = `hello ${name || "stranger"} #${n}`;
      yield { message };
    }
  }
});

console.log(`gonna listen on ${port} port`);
for await (const conn of Deno.listen({ port })) {
  server.handle(conn);
}