
# Deno Pact

<img src="https://avatars.githubusercontent.com/u/42048915?s=200&v=4" height="80" width="80"><img src="https://i.pinimg.com/originals/01/9e/e0/019ee012b9ca5318b09d2f5696fc54ee.png" height="80" width="80"><img src="https://user-images.githubusercontent.com/19932401/206557102-f5141b7d-a4f4-441b-84f6-ede3552c4696.png" height="80" width="80">

## Download Pact FFI Library

- Checks if it exists in `${HOME}/.pact/ffi/<pact_ffi_version>`
- Downloads the neccessary library for your architecture
- Executes the library to ensure it works

```sh
deno run -A --unstable pact/downloadFfi.ts --run
```

| OS      | Architecture | Supported |
| ------- | ------------ | --------- |
| OSX     | x86_64       | ✅         |
| OSX     | arm          | ✅         |
| Linux   | x86_64       | ✅         |
| Linux   | arm          | ✅         |
| Windows | x86_64       | ✅         |

You can also do this in code


```ts
import { downloadFfiForPlatform } from "https://deno.land/x/pact/src/mod.ts";
await downloadFfiForPlatform()
```

## How to use

```ts
import { DenoPact, Pact } from "https://deno.land/x/pact/src/mod.ts";
const denoPact = new DenoPact();
```

## Examples

There is a handy helper script to run the examples

Try `./run help` for available commands or take a look at the [run](./run) script

### gRPC Area Calculator

- The Proto File - [area_calculator.proto](./src/usage/areaCalculator/area_calculator.proto)
- The Server - [areaCalculatorServer.ts](./src/usage/areaCalculator/areaCalculatorServer.ts)
- The Client - [areaCalculator/areaCalculatorClient.ts](./src/usage/areaCalculator/areaCalculatorClient.ts)
- The Client Pact test [areaCalculatorClientTest.ts](./src/usage/areaCalculatorClientTest.ts)
- The Server Pact verification [areaCalculatorProviderTest.ts](./src/usage/areaCalculatorProviderTest.ts)

### gRPC Greeter

- The Proto File - [greeter.proto](./src/usage/greeter/greeter.proto)
- The Server - [greeterServer.ts](./src/usage/greeter/greeterServer.ts)
- The Client - [greeterClient.ts](./src/usage/greeter/greeterClient.ts)
- The Client Pact test [greeterClientTest.ts](./src/usage/greeterClientTest.ts)

### HTTP service - Swagger Mock Validator

- The Service - [swaggerMockValidatorService.ts](./src/usage/swaggerMockValidator/swaggerMockValidatorService.ts)
- The Service Unit Test - [swaggerMockValidatorService.test.ts](./src/usage/swaggerMockValidator/swaggerMockValidatorService.test.ts)
- The Server - [swaggerMockValidatorServer.ts](./src/usage/swaggerMockValidator/swaggerMockValidatorServer.ts)
- The Server Integration Test - [swaggerMockValidatorServer.test.ts](./src/usage/swaggerMockValidator/swaggerMockValidatorServer.test.ts)
- The Client Pact test [swaggerMockValidatorServer.consumer.pact.ts](./src/usage/swaggerMockValidator/swaggerMockValidatorServer.consumer.pact.ts)
- The Server Pact verification [swaggerMockValidatorServer.provider.pact.ts](./src/usage/swaggerMockValidator/swaggerMockValidatorServer.provider.pact.ts)

### Pact Verifications

- Pact verification task, tests multiple transport protocols [verifier.test.ts](./src/usage/verifier.test.ts)

### Docker

You can spin up various services with Docker to help you play around with the pact files generated, and the examples

- Pact Broker via Deno [pactBroker.ts](./docker/pactBroker.ts)
- Pact Broker via Docker-Compose [docker-compose.yml](./docker/docker-compose.yml)
