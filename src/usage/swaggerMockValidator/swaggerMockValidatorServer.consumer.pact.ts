import { beforeEach, describe, expect, it, run } from "../../deps.test.ts";

import { DenoPact, getModuleDir, Pact, path } from "../../deps.dev.ts";
// } from "../../deps.ts";

const decoder = new TextDecoder("utf-8");

describe("Swagger Mock Validator Service", () => {
  let oasDefinition: any;
  let pactFile: any;

  beforeEach(async () => {
    oasDefinition = JSON.parse(
      decoder.decode(
        await Deno.readFile(path.join(getModuleDir(import.meta), "oas.json")),
      ),
    );
    pactFile = JSON.parse(
      decoder.decode(
        await Deno.readFile(path.join(getModuleDir(import.meta), "pact.json")),
      ),
    );
  });

  describe("Validations", () => {
    it("should return ok if there are no errors", async () => {
      const expected = {
        errors: [],
        success: true,
        warnings: [],
        consumer: "ExampleConsumer",
        provider: "ExampleProvider",
        specContentPathOrUrl: "content",
        mockContentPathOrUrl: "content",
      };

      const requestData = {
        oas: {
          content: oasDefinition,
        },
        pact: {
          content: pactFile,
        },
      };

      const denoPact = new DenoPact();
      await denoPact
        .setupLoggers(Pact.LevelFilter.LevelFilter_Info)
        // Arrange
        .newPact(
          "swagger-mock-validator-consumer",
          "swagger-mock-validator-provider",
        )
        .addMetaDataToPact(denoPact.getPactFfiVersion())
        .newInteraction("A OpenAPI/Pact request")
        .given("an OpenAPI definition exists")
        .uponReceiving("an HTTP request that exists in the OpenAPI definition")
        .setPactSpecification(Pact.PactSpecification.PactSpecification_V4)
        .withRequest("/", "POST")
        .withResponse(200)
        .withHeader(
          Pact.InteractionPart.InteractionPart_Request,
          "content-type",
          "application/json",
        )
        .withBody(
          Pact.InteractionPart.InteractionPart_Request,
          "application/json",
          requestData,
        )
        .withBody(
          Pact.InteractionPart.InteractionPart_Response,
          "application/json",
          expected,
        )
        .createMockServerForTransport("http", "0.0.0.0", 0)
        .executeTest(async () => {
          // Act
          const response = await fetch(
            `http://localhost:${denoPact.getMockServerPort()}`,
            {
              method: "POST",
              body: JSON.stringify(requestData),
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            },
          );
          // Assert
          const actual = await response.json();
          expect(actual).toEqual(expected);
        })
        .then((results) => console.log(results));
    });
    it("should return report on errors", async () => {
      pactFile.interactions[0].request.path = "/getNotMyModel";

      const expected = JSON.parse(
        decoder.decode(
          await Deno.readFile(
            path.join(getModuleDir(import.meta), "validationFailure.json"),
          ),
        ),
      );

      const requestData = {
        oas: {
          content: oasDefinition,
        },
        pact: {
          content: pactFile,
        },
      };

      const denoPact = new DenoPact();
      await denoPact
        .setupLoggers(Pact.LevelFilter.LevelFilter_Info)
        // Arrange
        .newPact(
          "swagger-mock-validator-consumer",
          "swagger-mock-validator-provider",
        )
        .addMetaDataToPact(denoPact.getPactFfiVersion())
        .newInteraction("A OpenAPI/Pact request")
        .given("an OpenAPI definition exists")
        .uponReceiving("an HTTP request that doesnt in the OpenAPI definition")
        .setPactSpecification(Pact.PactSpecification.PactSpecification_V4)
        .withRequest("/", "POST")
        .withResponse(200)
        .withHeader(
          Pact.InteractionPart.InteractionPart_Request,
          "content-type",
          "application/json",
        )
        .withBody(
          Pact.InteractionPart.InteractionPart_Request,
          "application/json",
          requestData,
        )
        .withBody(
          Pact.InteractionPart.InteractionPart_Response,
          "application/json",
          expected,
        )
        .createMockServerForTransport("http", "0.0.0.0", 0)
        .executeTest(async () => {
          // Act
          const response = await fetch(
            `http://localhost:${denoPact.getMockServerPort()}`,
            {
              method: "POST",
              body: JSON.stringify(requestData),
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            },
          );
          // Assert
          const actual = await response.json();
          expect(actual).toEqual(expected);
        })
        .then((results) => console.log(results));
    });
  });
});

run();
