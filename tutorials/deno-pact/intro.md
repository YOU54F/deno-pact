## Tutorial Prerequisites

- Nothing! Just you and a bit of time

## Install Deno


2. `curl -fsSL https://deno.land/x/install/install.sh | sh`{{exec}}
3. `echo 'export DENO_INSTALL="/root/.deno"' >> ~/.bashrc `{{exec}}
4. `echo 'export PATH="$DENO_INSTALL/bin:$PATH"' >> ~/.bashrc `{{exec}}
5. `source ~/.bashrc`{{exec}}

## Get the Pact FFI

5. `deno run -A --unstable https://deno.land/x/pact/src/downloadFfi.ts --run`{{exec}}
6. `touch helloPactDeno.ts`


```ts
import { DenoPact, Pact } from "https://deno.land/x/pact/src/mod.ts";
const denoPact = new DenoPact();
console.log(denoPact.getPactFfiVersion());
```{{copy}}

7. `deno run -A --unstable helloPactDeno.ts`

## Run the Examples


2. `git clone https://github.com/YOU54F/deno-pact`{{exec}}
3. `cd deno-pact`{{exec}}
4. `./run get_pact_ffi`{{exec}}
7. `./run get_pact_plugin_cli`{{exec}}
8. `PATH_TO_CLI=/root/bin/ ./run get_protobuf_plugin`{{exec}}

## gRPC AreaCalculator

8. `./run test_grpc_area_client`{{exec}}
9. `./run test_grpc_area_provider`{{exec}}
10. `./run start_area_calculator_provider`{{exec}}
11. `./run run_area_calculator`{{exec}}

## gRPC Greeter

12. `./run run_grpc_greeter`{{exec}}
13. `./run test_grpc_greeter_client`{{exec}}

## HTTP Service

14. `./run run_product_api_provider`{{exec}}
15. `./run test_product_api_provider`{{exec}}

## HTTP Service

16. `./run run_smv_service`{{exec}}
17. `./run test_smv_service_provider_integration`{{exec}}
18. `./run test_smv_service_consumer_pact`{{exec}}
19. `./run test_smv_service_provider_pact`{{exec}}

##  Pact Verifier

20. `./run test_verifier_pact`{{exec}}

## Pact Broker

25. `curl pact.saf.dev -Lso - | bash -s -- broker deploy mybroker 8000`{{exec}}
    1. Open the [Pact Broker]({{TRAFFIC_HOST1_8000}}) and observe it's contents.
    2. You can check the Docker logs for the Pact Broker, `docker logs mybroker_pact_broker_1`{{exec}}
    3. Restart the container if there was any issues `docker restart mybroker_pact_broker_1`{{exec}}

5. `./run get_broker`{{exec}}
6. Open the [Pact Broker]({{TRAFFIC_HOST1_9292}})