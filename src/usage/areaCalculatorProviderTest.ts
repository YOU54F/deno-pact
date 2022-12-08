import { DenoPact } from "../denoPact.ts";
import { PactFfi as Pact } from "../lib/types.ts";
import { describe, it, run } from "https://deno.land/x/tincan/mod.ts";
import { isPortAvailableSync } from "https://deno.land/x/port/mod.ts";
import * as path from "https://deno.land/std/path/mod.ts";

describe("Verify Area Calculator Provider with pact", () => {
  describe("Validations", () => {
    it("should return ok if there are no errors", () => {
      const pactDir = path.join(Deno.cwd(), "pacts");

      const port = 37757;
      console.log(
        "port avail?",
        isPortAvailableSync({ port, hostname: "localhost" })
      );
      const name = "area-calculator-provider";
      const providerVersion = "foo-sha-123";
      console.log("🚀 executing verifier");
      new DenoPact()
        .verifier()
        .setupLoggers(Pact.LevelFilter.LevelFilter_Info)
        .verifierSetProviderInfo({
          // name, // I assume name is taken from the pact file, if it is not set ?
          port
          // basePath: "/",
          // transport: "http",
          // hostname: "localhost"
        })
        .verifierAddProviderTransports([
          // The ports arent picked up from here, I would expect to be able to set the provider
          // name, in verifierSetProviderInfo, without providing a port
          // { protocol: "protobuf", port: 37757, scheme: "tcp" },
          // { protocol: "http", port: 3000, scheme: "http" }
        ])
        .verifierSetVerificationOptions({
          disableSslVerification: false,
          requestTime: 5000
        })
        .verifierSetPublishOptions({
          providerVersion,
          providerBranch: "safbranch",
          providerTags: ["some", "tags", "yo"],
          buildUrl: "http://funkyurl.com"
        })
        .verifierSetConsumerFilters({ names: ["area-calculator-consumer"] })
        .verifierAddDirectorySource({ pathToDir: pactDir })
        // .verifierAddFileSource({
        //   pathToFile:
        //     "./pacts/area-calculator-consumer-area-calculator-provider.json"
        // })
        // .verifierAddUrlSource({
        //   url:
        //     "http://0.0.0.0:8001/pacts/provider/area-calculator-provider/consumer/area-calculator-consumer/latest",
        // })
        // .verifierSetFilterInfo({
        //   description:'yolo'
        // })
        .verifierExecute();
    });
  });
});

run();