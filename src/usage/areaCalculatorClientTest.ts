import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { DenoPact } from "../denoPact.ts";
import { PactFfi as Pact } from "../lib/types.ts";
import { getShapeMessage } from "./areaCalculator/areaCalculatorClient.ts";
import * as path from "https://deno.land/std/path/mod.ts";
import { getModuleDir } from "../lib/utils.ts";
const protoPath = path.join(
  getModuleDir(import.meta),
  "areaCalculator",
  "area_calculator.proto"
);
Deno.test(
  {
    name: "Greeter/SayHello Unary gRPC test",
    sanitizeResources: false,
    sanitizeOps: false
  },
  async () => {
    const denoPact = new DenoPact();
    const pactContents = {
      "pact:proto": protoPath,
      "pact:proto-service": "Calculator/calculateOne",
      "pact:content-type": "application/protobuf",
      request: {
        rectangle: {
          length: "matching(number, 3)",
          width: "matching(number, 4)"
        }
      },
      response: { value: ["matching(number, 12)"] }
    };
    console.log(
      "🚀 Testing gRPC Area Calculator with Pact Protobuf Plugin  🚀\n",
      {
        pactContents
      }
    );

    await denoPact
      .setupLoggers()
      // Arrange
      .newPact("area-calculator-consumer", "area-calculator-provider")
      .addMetaDataToPact(denoPact.getPactFfiVersion())
      .newSyncMessageInteraction("A gRPC calculateOne request")
      .setPactSpecification(Pact.PactSpecification.PactSpecification_V4)
      .usingPactPlugin("protobuf")
      .withInteractionContents(
        Pact.InteractionPart.InteractionPart_Request,
        "application/grpc",
        pactContents
      )
      .createMockServerForTransport("grpc")
      .executeTest(async () => {
        const expected = [12];
        // Act
        const mockServerPort = denoPact.getMockServerPort();
        const results = await getShapeMessage(mockServerPort);
        // Assert
        assertEquals(results.value, expected);
      })
      .then((results) => console.log(results));
  }
);
