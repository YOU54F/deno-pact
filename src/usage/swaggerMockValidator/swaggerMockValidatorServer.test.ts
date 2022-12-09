import { getModuleDir } from "../../lib/utils.ts";
import * as path from "https://deno.land/std/path/mod.ts";
import express from "npm:express";
import { server as swaggerMockValidatorServer } from "./swaggerMockValidatorServer.ts";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  run,
} from "https://deno.land/x/tincan/mod.ts";
const decoder = new TextDecoder("utf-8");

describe("Swagger Mock Validator Service", () => {
  let server: any;
  let oasDefinition: any;
  let pactFile: any;

  beforeEach(async () => {
    const app = express();
    app.use(express.json());
    server = swaggerMockValidatorServer(3000);
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

  afterEach(() => {
    server.close();
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

      const response = await fetch("http://localhost:3000", {
        method: "POST",
        body: JSON.stringify(requestData),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const actual = await response.json();
      console.log("response", { actual, expected });
      expect(JSON.parse(actual)).toEqual(expected);
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

      const response = await fetch("http://localhost:3000", {
        method: "POST",
        body: JSON.stringify(requestData),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const actual = await response.json();
      console.log("response", { actual, expected });
      expect(JSON.parse(actual)).toEqual(expected);
    });
  });
});

run();
