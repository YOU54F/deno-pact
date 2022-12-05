import { swaggerMockValidatorService } from "./swaggerMockValidatorService.ts";
import { getModuleDir } from "../../lib/utils.ts";
import * as path from "https://deno.land/std/path/mod.ts";
const decoder = new TextDecoder("utf-8");

import {
  beforeAll,
  describe,
  expect,
  it,
  run
} from "https://deno.land/x/tincan/mod.ts";

describe("Swagger Mock Validator Service", () => {
  let oasDefinition: any;
  let pactFile: any;

  beforeAll(async () => {
    oasDefinition = JSON.parse(
      decoder.decode(
        await Deno.readFile(path.join(getModuleDir(import.meta), "oas.json"))
      )
    );
    pactFile = JSON.parse(
      decoder.decode(
        await Deno.readFile(path.join(getModuleDir(import.meta), "pact.json"))
      )
    );
  });

  describe("Validations", () => {
    it("should return ok if there are no errors", async () => {
      const results = await swaggerMockValidatorService({
        oas: {
          content: oasDefinition
        },
        pact: {
          content: pactFile
        }
      });

      expect(JSON.parse(results)).toEqual({
        errors: [],
        success: true,
        warnings: [],
        consumer: "ExampleConsumer",
        provider: "ExampleProvider",
        specContentPathOrUrl: "content",
        mockContentPathOrUrl: "content"
      });
    });
    it("should return report on errors", async () => {
      // Arrange
      pactFile.interactions[0].request.path = "/getNotMyModel";
      // Act
      const results = await swaggerMockValidatorService({
        oas: {
          content: oasDefinition
        },
        pact: {
          content: pactFile
        }
      });
      console.log(results);
      // Assert
      expect(JSON.parse(results)).toEqual(
        JSON.parse(
          decoder.decode(
            await Deno.readFile(
              path.join(getModuleDir(import.meta), "validationFailure.json")
            )
          )
        )
      );
    });
  });
});

run();
