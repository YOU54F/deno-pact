import Docker from "https://deno.land/x/denocker/index.ts";

// https://github.com/Oursin/denocker
// ## API reference
// ### Containers
// * `containers.list` - [Docker API](https://docs.docker.com/engine/api/v1.40/#operation/ContainerList)
// * `containers.create` - [Docker API](https://docs.docker.com/engine/api/v1.40/#operation/ContainerCreate)
// * `containers.start` - [Docker API](https://docs.docker.com/engine/api/v1.40/#operation/ContainerStart)
// * `containers.stop` - [Docker API](https://docs.docker.com/engine/api/v1.40/#operation/ContainerStop)
// * `containers.kill` - [Docker API](https://docs.docker.com/engine/api/v1.40/#operation/ContainerKill)
// * `containers.restart` - [Docker API](https://docs.docker.com/engine/api/v1.40/#operation/ContainerRestart)
// * `containers.wait` - [Docker API](https://docs.docker.com/engine/api/v1.40/#operation/ContainerWait)
// * `containers.rm` - [Docker API](https://docs.docker.com/engine/api/v1.40/#operation/ContainerDelete)

const docker = new Docker("/var/run/docker.sock");

const containerPactDb = await docker.containers.create("pact_db", {
  Image: "postgres:15.0-alpine",
  Healthcheck: { Test: ['psql postgres --command "select 1" -U postgres'] },
  ExposedPorts: { "5432/tcp": { PublicPort: "5432" } },
  Env: ["POSTGRES_DB=pact", "POSTGRES_PASSWORD=password", "POSTGRES_USER=pact"],
  Volumes: { "data_volume:/var/lib/postgresql/data": {} },
  // @ts-ignore
  HostConfig: { PortBindings: { "5432/tcp": [{ HostPort: "5432" }] } },
});
console.log("Container : %o", containerPactDb.message);

const containerPactBroker = await docker.containers.create("pact_broker", {
  Image: "pactfoundation/pact-broker",
  Cmd: ["ls"],
  StopTimeout: 10,
  ExposedPorts: { "9292/tcp": { Port: "9292" } },
  Env: [
    "PACT_BROKER_DATABASE_USERNAME=pact",
    "PACT_BROKER_DATABASE_PASSWORD=password",
    "PACT_BROKER_DATABASE_HOST=db",
    "PACT_BROKER_DATABASE_NAME=pact",
    "PACT_BROKER_DATABASE_CONNECT_MAX_RETRIES=10",
  ],
  HostConfig: {
    // @ts-ignore
    Links: ["pact_db:db"],
    PortBindings: { "9292/tcp": [{ HostPort: "9292" }] },
  },
});

console.log("Container : %o", containerPactBroker.message);
console.log("Container containerPactBroker : %s", containerPactBroker.Id);
console.log("Container containerPactDb : %s", containerPactDb.Id);
if (containerPactBroker.Id && containerPactDb.Id) {
  await docker.containers.start(containerPactDb.Id);
  await docker.containers.start(containerPactBroker.Id);
}

// version: "3"

// services:
//   pact_broker:
//     image: pactfoundation/pact-broker
//     restart: on-failure
//     ports:
//     - "${TENANT_PORT}:9292"
//     links:
//     - pact_db:db
//     depends_on:
//     - pact_db
//     environment:
//       PACT_BROKER_DATABASE_USERNAME: pact
//       PACT_BROKER_DATABASE_PASSWORD: password
//       PACT_BROKER_DATABASE_HOST: db
//       PACT_BROKER_DATABASE_NAME: pact
//       PACT_BROKER_DATABASE_CONNECT_MAX_RETRIES: "10"
//   pact_db:
//     image: postgres:15.0-alpine
//     volumes:
//       - data_volume:/var/lib/postgresql/data
//     healthcheck:
//       test: psql postgres --command "select 1" -U postgres
//     environment:
//       POSTGRES_DB: pact
//       POSTGRES_USER: pact
//       POSTGRES_PASSWORD: password
// volumes:
//   data_volume:
