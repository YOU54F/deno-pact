import * as path from "https://deno.land/std/path/mod.ts";
import { DenoPact } from "../denoPact.ts";
import { PactFfi as Pact } from "../lib/types.ts";
import { sayHello } from "./greeter/greeterClient.ts";
import { getModuleDir } from "../lib/utils.ts";
const denoPact = new DenoPact();

const protoPath = path.join(
  getModuleDir(import.meta),
  "greeter",
  "greeter.proto"
);
const nameToSend = "unary #1";
const expectedReply = `hello ${nameToSend}`;
const pactContents = {
  "pact:proto": protoPath,
  "pact:proto-service": "Greeter/SayHello",
  "pact:content-type": "application/protobuf",
  request: {
    name: `matching(type, '${nameToSend}')`
  },
  response: { message: `matching(type, '${expectedReply}')` }
};
console.log("🚀 Testing gRPC Greeter Client with Pact Protobuf Plugin  🚀\n", {
  pactContents
});
denoPact
  .setupLoggers(Pact.LevelFilter.LevelFilter_Info)
  // Arrange
  .newPact("greeter-consumer", "greeter-provider")
  .addMetaDataToPact(denoPact.getPactFfiVersion())
  .newSyncMessageInteraction("A gRPC greeter request")
  .setPactSpecification(Pact.PactSpecification.PactSpecification_V4)
  .usingPactPlugin("protobuf")
  .withInteractionContents(
    Pact.InteractionPart.InteractionPart_Request,
    "application/grpc",
    pactContents
  )
  .createMockServerForTransport("grpc")
  .executeTest(async () => {
    const expected = expectedReply;
    // Act
    const mockServerPort = denoPact.getMockServerPort();
    const results = await sayHello(mockServerPort);
    console.log(results);
    // Assert
    if (results && results.message) {
      const actual = results.message;
      actual === expected
        ? console.log("✅ tests passed 👌", { actual, expected })
        : console.log("🚨 tests failed, check out the errors below 👇", {
            actual,
            expected
          });
    } else {
      console.log("🚨 greeter client didnt return expected response", {
        expected,
        results
      });
    }
  })
  .then((results) => console.log(results));
