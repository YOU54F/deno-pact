import { describe, it, run } from "../../deps.test.ts";

import { DenoPact, Pact, isPortAvailableSync } from "../../deps.dev.ts";
// } from "../../deps.ts";

describe("Verify Swagger Mock Validator Service with pact", () => {
  describe("Validations", () => {
    it("should return ok if there are no errors", () => {
      const port = 3000;
      console.log(
        "port avail?",
        isPortAvailableSync({ port, hostname: "localhost" })
      );
      const name = "swagger-mock-validator-provider";
      const providerVersion = "foo-sha-123";
      new DenoPact()
        .setupLoggers(Pact.LevelFilter.LevelFilter_Info)
        .verifier()
        .verifierSetProviderInfo({
          name,
          scheme: "http",
          path: "/",
          port,
          host: "localhost"
        })
        .verifierSetVerificationOptions({
          disableSslVerification: false,
          requestTime: 5000
        })
        .verifierAddFileSource({
          pathToFile:
            "./pacts/swagger-mock-validator-consumer-swagger-mock-validator-provider.json"
        })
        .verifierExecute();
    });
  });
});

run();
