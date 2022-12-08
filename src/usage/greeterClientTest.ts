import {
  DenoPact,
  Pact,
  getModuleDir,
  assertEquals,
  path,
} from "../deps.dev.ts";
// } from "../deps.ts";

import { sayHello } from "./greeter/greeterClient.ts";

const protoPath = path.join(
  getModuleDir(import.meta),
  "greeter",
  "greeter.proto"
);

Deno.test(
  {
    name: "Greeter/SayHello Unary gRPC test",
    sanitizeResources: false,
    sanitizeOps: false
  },
  async () => {
    const denoPact = new DenoPact();

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
    console.log(
      "🚀 Testing gRPC Greeter Client with Pact Protobuf Plugin  🚀\n",
      {
        pactContents
      }
    );
    await denoPact
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
      .executeTest(async function (): Promise<void> {
        const expected = expectedReply;
        // Act
        const mockServerPort = denoPact.getMockServerPort();
        const results = await sayHello(mockServerPort);
        console.log(results);
        // Assert
        assertEquals(results.message, expected);
      })
      .then((results) => console.log(results));
  }
);
