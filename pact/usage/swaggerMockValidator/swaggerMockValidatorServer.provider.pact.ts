// import express from "npm:express@4.18.2";
import { DenoPact } from "../../denoPact.ts";
import { PactFfi as Pact } from "../../lib/types.ts";
import {
  describe,
  expect,
  it,
  run,
  beforeAll,
  afterAll
} from "https://deno.land/x/tincan/mod.ts";
import { cstr, readCString } from "../../lib/safe-ffi.ts";
import { isPortAvailableSync } from "https://deno.land/x/port/mod.ts";
describe("Verify Swagger Mock Validator Service with pact", () => {
  let denoPact: DenoPact;

  beforeAll(() => {
    denoPact = new DenoPact();
    denoPact.setupLoggers(Pact.LevelFilter.LevelFilter_Trace);
  });
  afterAll(() => {
    denoPact.pactFfi().$$close();
  });
  describe("Validations", () => {
    it("should return ok if there are no errors", () => {
      console.log(
        "port avail?",
        isPortAvailableSync({ port: 3000, hostname: "localhost" })
      );
      const providerName = "swagger-mock-validator-provider";
      const providerVersion = "foo-sha-123";
      const verifierHandle = denoPact
        .pactFfi()
        .pactffi_verifier_new_for_application(
          cstr("deno-pact"),
          cstr("deno-pacts-version")
        );
      denoPact
        .pactFfi()
        .pactffi_verifier_set_provider_info(
          verifierHandle,
          cstr(providerName),
          cstr("http"),
          cstr("localhost"),
          3000,
          cstr("/")
        );
      // denoPact
      //   .pactFfi()
      //   .pactffi_verifier_set_filter_info(
      //     verifierHandle,
      //     cstr(""),
      //     cstr("book"),
      //     0
      //   );
      // denoPact
      //   .pactFfi()
      //   .pactffi_verifier_set_provider_state(
      //     verifierHandle,
      //     cstr("http://localhost:8000/change-state"),
      //     1,
      //     1
      //   );
      denoPact.pactFfi().pactffi_verifier_set_verification_options(
        verifierHandle,
        0,
        BigInt(5000) // request timeout
      );
      // denoPact.pactFfi().pactffi_verifier_set_publish_options(verifierHandle, cstr('1.0.0'), cstr('NULL'), cstr(namePtr), 3, cstr('some-branch'));
      // denoPact.pactFfi().pactffi_verifier_set_consumer_filters(verifierHandle, cstr(consumers), 1);
      denoPact
        .pactFfi()
        //  * Adds a Pact directory as a source to verify. All pacts from the directory that match the
        //   * provider name will be verified
        // This isn't the case and it picks up all pacts
        // .pactffi_verifier_add_directory_source(verifierHandle, cstr("./pacts"));
        .pactffi_verifier_add_file_source(
          verifierHandle,
          cstr(
            "./pacts/swagger-mock-validator-consumer-swagger-mock-validator-provider.json"
          )
        );
      const result = denoPact
        .pactFfi()
        .pactffi_verifier_execute(verifierHandle);
      if (result != 0) {
        console.log("Failed verification");
        const results = readCString(
          denoPact.pactFfi().pactffi_verifier_json(verifierHandle)
        );
        denoPact.pactFfi().pactffi_verifier_shutdown(verifierHandle);
        const reportFileLocation = "results.json";
        console.log("Tests failed, writing results to: ", reportFileLocation);

        Deno.openSync(reportFileLocation, {
          create: true,
          write: true
        }).writeSync(new TextEncoder().encode(results));

        expect(JSON.parse(results).errors).toEqual([]);
      } else {
        denoPact.pactFfi().pactffi_verifier_shutdown(verifierHandle);
      }

      console.log("port avail?", isPortAvailableSync({ port: 3000 }));
    });
  });
});

run();
