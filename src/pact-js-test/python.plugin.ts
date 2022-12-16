import { SpecificationVersion } from "../pact-js/v3/types.ts";
import { PactV4 } from "../pact-js/v4/index.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const testPactV4 = async() => {
  const parseMattMessage = (raw: string): string => {
    return raw.replace(/(MATT)+/g, "").trim();
  };
  const generateMattMessage = (raw: string): string => {
    return `MATT${raw}MATT`;
  };

  const pact = new PactV4({
    consumer: "foo",
    provider: "bar",
    spec: SpecificationVersion.SPECIFICATION_VERSION_V4,
    // port: 3000,
  });

  const mattRequest = `{"request": {"body": "hello"}}`;
  const mattResponse = `{"response":{"body":"world"}}`;

  await pact
    .addInteraction()
    .given("the Matt protocol exists")
    .uponReceiving("an HTTP request to /matt")
    // .usingPlugin({
    //   plugin: "node-template",
    //   version: "0.0.0"
    // })
    // .usingPlugin({
    //   plugin: "deno-template",
    //   version: "0.0.0"
    // })
    .usingPlugin({
      plugin: "python-template",
      version: "0.0.0"
    })
    .withRequest("POST", "/matt", (builder) => {
      builder.pluginContents("application/matt", mattRequest);
    })
    .willRespondWith(200, (builder) => {
      builder.pluginContents("application/matt", mattResponse);
    })
    .executeTest(async (mockserver) => {
      console.log(mockserver);

      return await fetch(mockserver.url + "/matt", {
        method: "POST",
        body: generateMattMessage("hello"),
        headers: {
          Accept: "application/matt",
          "Content-Type": "application/matt"
        }
      });
    })
    .then(async (res) => {
      const resultText = (await res?.text()) ?? "fail";
      assertEquals(parseMattMessage(resultText), "world");
    });
};

await testPactV4()