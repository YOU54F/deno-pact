
# Deno Pact

<img src="https://avatars.githubusercontent.com/u/42048915?s=200&v=4" height="80" width="80">
<img src="https://i.pinimg.com/originals/01/9e/e0/019ee012b9ca5318b09d2f5696fc54ee.png" height="80" width="80">
<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDI1MCAyNTAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDI1MCAyNTA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj48c3R5bGUgdHlwZT0idGV4dC9jc3MiPiAuc3Qwe2ZpbGw6IzUwRTRFQTt9IC5zdDF7ZmlsbDpub25lO30gLnN0MntvcGFjaXR5OjAuOTtmaWxsOiNGRkZGRkY7fSAuc3Qze29wYWNpdHk6MC41NTtmaWxsOiNGRkZGRkY7fSAuc3Q0e2ZpbGw6I0FGQzRDRTt9IC5zdDV7ZmlsbDojMTczNjQ3O30gLnN0NntvcGFjaXR5OjAuNztmaWxsOiMxQTQyNTQ7fSAuc3Q3e29wYWNpdHk6MC42O30gLnN0OHtmaWxsOiNGRkZGRkY7fQo8L3N0eWxlPjxnPjxnPjxnPjxnPjxnPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMjQuOTk5LDI0Mi44NzJjLTY0Ljk5NiwwLTExNy44NzQtNTIuODc2LTExNy44NzQtMTE3Ljg3MlM2MC4wMDQsNy4xMjYsMTI0Ljk5OSw3LjEyNiBzMTE3Ljg3NCw1Mi44NzksMTE3Ljg3NCwxMTcuODc0UzE4OS45OTUsMjQyLjg3MiwxMjQuOTk5LDI0Mi44NzJ6Ii8+PC9nPjxnPjxnPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMjQuOTk5LDEzLjAyNmM2MS44NDMsMCwxMTEuOTc0LDUwLjEzMiwxMTEuOTc0LDExMS45NzRjMCw2MS44NDEtNTAuMTMyLDExMS45NzQtMTExLjk3NCwxMTEuOTc0IGMtNjEuODQxLDAtMTExLjk3My01MC4xMzMtMTExLjk3My0xMTEuOTc0QzEzLjAyNiw2My4xNTgsNjMuMTU4LDEzLjAyNiwxMjQuOTk5LDEzLjAyNiBNMTI0Ljk5OSwxLjIyNiBDNTYuNzUxLDEuMjI2LDEuMjI2LDU2Ljc1MSwxLjIyNiwxMjVzNTUuNTI1LDEyMy43NzQsMTIzLjc3MywxMjMuNzc0YzY4LjI1LDAsMTIzLjc3NS01NS41MjUsMTIzLjc3NS0xMjMuNzc0IFMxOTMuMjQ5LDEuMjI2LDEyNC45OTksMS4yMjZMMTI0Ljk5OSwxLjIyNnoiLz48L2c+PC9nPjwvZz48L2c+PC9nPjxwYXRoIGNsYXNzPSJzdDUiIGQ9Ik0xNTQuNjg0LDE5Mi44N2MtNi41MzksMC0xMi41Ni0yLjMwMS0xNy44OTUtNi44NDFjLTYuMjY2LTUuMzMxLTExLjc0Ni0xMS40MTktMTcuNTQ4LTE3Ljg2NCBjLTEuMjctMS40MTEtMi41NDgtMi44MzEtMy44NDEtNC4yNDlsMTkuNjI3LTEuODc0bDEuMzY2LDEuNTY0YzIuMDMsMi4zMjYsNC4zNjEsNC45OTgsNi43MDgsNy42NTYgYzMuMjk0LDMuNzMsNy42ODgsNS43ODUsMTIuMzczLDUuNzg1YzMuNDMzLDAsNi43NTgtMS4xMjYsOS42MTctMy4yNTZjMy42NTItMi43MjEsNi4wNTctNi43NzMsNi42LTExLjExNyBjMC41MTItNC4wOTMtMC42NTQtOC4xMy0zLjI4MS0xMS4zNjhjLTguNjgxLTEwLjY5NS0xNy43NzUtMjAuODYzLTI2LjMwOS0zMC4yNThjLTIuNDk4LTIuNzQ5LTYuMTg5LTQuMzI3LTEwLjEyNS00LjMyNyBjLTEuOTA5LDAtMy44MDEsMC4zNTgtNS42MjEsMS4wNjRsLTIuNTc5LDEuMDAxbDAuNDg5LDEuMzU5bC0xMi42NDUtMy45NzVsMy42ODItMTMuMzkxbDAuNzMsMS4xMjRsMi4xMjYtMC43ODQgYzUuMTk1LTEuOTE2LDkuODE5LTIuODQ4LDE0LjEzNS0yLjg0OGM5LjU3NSwwLDE3LjM1Miw0LjUxOSwyNi4wMDEsMTUuMTExYzMuMTI5LDMuODMyLDYuNDUsNy41OCw5LjY2MSwxMS4yMDUgYzQuMjMyLDQuNzc3LDguNTk0LDkuNzAxLDEyLjQ4OCwxNC43ODZjNS45NzMsNy43OTksOC4wNywxNy42MzUsNS43NTUsMjYuOTg1Yy0yLjMyNiw5LjM5MS04LjgwNSwxNy4xNDktMTcuNzc2LDIxLjI4MyBDMTYzLjc3MiwxOTEuNzg1LDE1OS4xNTEsMTkyLjg3LDE1NC42ODQsMTkyLjg3TDE1NC42ODQsMTkyLjg3eiIvPjxwYXRoIGNsYXNzPSJzdDUiIGQ9Ik0xMTkuNzY1LDE1My4yNGMtOS45ODIsMC0xOC40MDktNC4zMTUtMjUuNzYyLTEzLjE5Yy0zLjI5Mi0zLjk3NC02Ljc4Ny03Ljg1NS0xMC4xNjctMTEuNjA4IGMtMy44MjQtNC4yNDctNy43MjktOC41ODMtMTEuMzExLTEzLjAxYy05LjE4LTExLjM0NC05Ljc4Ni0yNS45OTctMS41ODEtMzguMjRjNS44LTguNjU1LDE1LjgwMy0xNC4wMzEsMjYuMTA3LTE0LjAzMSBjNi4zODUsMCwxMi4zNjQsMi4wMzUsMTcuMjg5LDUuODg2YzYuMjQ2LDQuODgyLDExLjYwNSwxMC43NTcsMTcuMjc4LDE2Ljk3N2MwLDAsMS41MDgsMS42NTIsMi4yMTMsMi40MjIgYy0wLjkxNy0wLjA1NC0xLjgzMS0wLjA4MS0yLjcyNy0wLjA4MWMtNS41MTEsMC0xMC43MTIsMS4wMDQtMTUuODkyLDMuMDY5TDExNC44MzcsOTFjLTEuNTYtMS44MDMtMy40MTEtMy45NDItNS4yNjgtNi4wNzcgYy0zLjQwNy0zLjkxNS03Ljg5OC02LjA3LTEyLjY0NS02LjA3Yy0zLjY3MiwwLTcuMjE1LDEuMjk4LTEwLjI0OCwzLjc1NGMtMy40OCwyLjgxOC01LjYxNiw2LjY5NC02LjAxNCwxMC45MTUgYy0wLjQwMiw0LjI2MSwxLjAwOCw4LjUzOCwzLjk3LDEyLjA0M2M1LjY2Nyw2LjcwMiwxMS41MzQsMTMuMzY5LDE3LjIwOCwxOS44MTZsMC4xOTksMC4yMjZjMS45NCwyLjIwNCwzLjg3OSw0LjQwNyw1LjgxMiw2LjYxNSBjMi45MDMsMy4zMTMsNy4yNzIsNS4yMTMsMTEuOTg4LDUuMjEzYzEuNzczLDAsMy41NDgtMC4yNjQsNS4yNzUtMC43ODZsMy4xMDMtMC45MzdsLTAuNTM3LTEuMTgzbDExLjc3NywzLjcwM2wtNC4wNTMsMTIuODkzIGwtMC41NDgtMC45MjRjMCwwLTIuMTUzLDAuNzk2LTMuNDQsMS4yNjlDMTI3LjQzNiwxNTIuOTMyLDEyMy40MTksMTUzLjI0LDExOS43NjUsMTUzLjI0eiIvPjxwYXRoIGNsYXNzPSJzdDUiIGQ9Ik0xMzEuNzk0LDEyMi4wNjNjLTcuNDU1LTAuNTM5LTE0LjQyOC0xLjA0NC0yMS43NTEtMS41NzRjMC41NDEtNy40NzksMS42MTEtMjIuMjYzLDEuNjExLTIyLjI2MyBMMTMxLjc5NCwxMjIuMDYzeiIvPjxwYXRoIGNsYXNzPSJzdDUiIGQ9Ik0xMTguODU0LDEzMS40N2M3LjQ1NSwwLjU0NSwxNC40MjcsMS4wNTQsMjEuNzUsMS41ODljLTAuNTQ2LDcuNDc4LTEuNjI2LDIyLjI2Mi0xLjYyNiwyMi4yNjJMMTE4Ljg1NCwxMzEuNDcgeiIvPjwvZz48L3N2Zz4=" height="80" width="80">

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