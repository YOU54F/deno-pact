
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
import { downloadFfiForPlatform } from "downloadFfi.ts";
await downloadFfiForPlatform()
```

## How to use

```ts
import { DenoPact } from "DenoPact.ts";
import { PactFfi as Pact } from "types.ts";
const denoPact = new DenoPact();
```

## Examples

There is a handy helper script to run the examples

Try `./run help` for available commands or take a look at the [run](./run) script

### gRPC Area Calculator

- [area_calculator.proto](./pact/usage/areaCalculator/area_calculator.proto)
- [areaCalculatorServer.ts](./pact/usage/areaCalculator/areaCalculatorServer.ts)
- [areaCalculator/areaCalculatorClient.ts](./pact/usage/areaCalculator/areaCalculatorClient.ts)
- [areaCalculatorClientTest.ts](./pact/usage/areaCalculatorClientTest.ts)

### gRPC Greeter

- [greeter.proto](./pact/usage/greeter/greeter.proto)
- [greeterServer.ts](./pact/usage/greeter/greeterServer.ts)
- [greeterClient.ts](./pact/usage/greeter/greeterClient.ts)
- [greeterClientTest.ts](./pact/usage/greeterClientTest.ts)
