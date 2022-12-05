import * as path from "https://deno.land/std/path/mod.ts";
import { DenoPact } from "../denoPact.ts";
import { PactFfi as Pact } from "../lib/types.ts";
import { getShapeMessage } from "./areaCalculator/areaCalculatorClient.ts";
import { getModuleDir } from "../lib/utils.ts";

const denoPact = new DenoPact();
const protoPath = path.join(
  getModuleDir(import.meta),
  "areaCalculator",
  "area_calculator.proto"
);
const pactContents = {
  "pact:proto": protoPath,
  "pact:proto-service": "Calculator/calculateOne",
  "pact:content-type": "application/protobuf",
  request: {
    rectangle: { length: "matching(number, 3)", width: "matching(number, 4)" }
  },
  response: { value: ["matching(number, 12)"] }
};
console.log("🚀 Testing gRPC Area Calculator with Pact Protobuf Plugin  🚀\n", {
  pactContents
});

denoPact
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
    const expected = 12;
    // Act
    const mockServerPort = denoPact.getMockServerPort();
    const results = await getShapeMessage(mockServerPort);
    // Assert
    if (results && results.value && results.value[0]) {
      const actual = results.value[0];
      actual === expected
        ? console.log("✅ tests passed 👌", { actual, expected })
        : console.log("🚨 tests failed, check out the errors below 👇", {
            actual,
            expected
          });
    } else {
      console.log("shape message client didnt return expected response", {
        expected
      });
    }
  })
  .then((results) => console.log(results));
