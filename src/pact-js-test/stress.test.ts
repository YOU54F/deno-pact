import { MatchersV3, PactV3 } from "../pact-js/v3/index.ts";

console.log(new Date().toISOString(), "START");

const providers = [];
for (let i = 0, len = 500; i < len; i++) {
  const provider = new PactV3({
    consumer: "MyConsumer"+i,
    provider: "MyProvider"+i,
    logLevel: "info"
  });
  console.log(new Date().toISOString(), "DONE" + i);
  provider
    .given("Server is healthy")
    .uponReceiving("A request for API health")
    .withRequest({
      method: "GET",
      path: "/health"
    })
    .willRespondWith({
      status: 200,
      body: { status: MatchersV3.like("up") }
    });

  provider.executeTest((mockServer) => {
    return fetch(mockServer.url + "/health").then(async (res) => {
      console.log(await res.text());
    });
  });
  providers.push(provider);
}

console.log(new Date().toISOString(), "END");

// Deno.on('exit', function() {
//   console.log(Date.now(), "EXIT")
// })
