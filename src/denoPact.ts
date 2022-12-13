import home_dir from "https://deno.land/x/dir/home_dir/mod.ts";
import * as path from "https://deno.land/std/path/mod.ts";
import {
  cstr,
  loadPactFfi,
  PactFfi,
  Pointer,
  readCString,
  StructPointer
} from "./lib/mod.ts";
import { PactFfi as Pact } from "./lib/types.ts";
const DEBUG = Deno.env.get("DEBUG");
// ENABLE/DISABLE Console Logs
if (!DEBUG) {
  console.debug = function () {};
}
export const PACT_FFI_VERSION = "v0.3.15";
export const PACT_FFI_LOCATION = path.join(
  home_dir() ?? "",
  ".pact",
  "ffi",
  PACT_FFI_VERSION
);
export const libraryFilename =
  Deno.build.os === "darwin"
    ? "libpact_ffi.dylib"
    : Deno.build.os === "windows"
    ? "pact_ffi.dll"
    : "libpact_ffi.so";
export const libraryLocation = path.join(PACT_FFI_LOCATION, libraryFilename);
export class DenoPact {
  private ffi: typeof PactFfi;
  private version: string;
  private appName = "pact-deno-ffi";
  private PACT_FILE_DIR = "./pacts";
  private pact: Pact.PactHandle | null;
  private syncHttpPact: Pointer<StructPointer<"SynchronousHttp">> | null;
  private interaction: Pact.InteractionHandle | null;
  private mockServerPort: number | null;
  private matched: number;
  private mismatches: string | null;
  private verifierHandle: Pact.VerifierHandle | null;
  private verificationResult: number | null;
  private verificationResultsJson: any | null;
  private verificationResultsFileName: string;
  private writeVerificationResultsToFile: boolean;

  constructor() {
    this.ffi = loadPactFfi(libraryLocation);
    this.version = "";

    // This is for our consumer side
    this.pact = null;
    this.interaction = null;
    this.mockServerPort = null;
    this.matched = 0;
    this.mismatches = null;
    this.interaction = null;
    this.syncHttpPact = null;

    // This is for our provider verifier side
    this.verifierHandle = null;
    this.verificationResult = null;
    this.verificationResultsJson = null;
    this.verificationResultsFileName = "verificationResults.json";
    this.writeVerificationResultsToFile = false;
  }

  public denoPactClose() {
    this.ffi.$$close();
  }

  // provider verifier side stuff

  public verifier() {
    console.debug("🚧 calling verifier with args:", {});
    this.verifierHandle = this.ffi.pactffi_verifier_new_for_application(
      cstr(this.appName),
      cstr(this.getPactFfiVersion())
    );
    console.debug("✅ called verifier, result:", this.verifierHandle);
    return this;
  }
  public verifierSetColouredOutput(enable = true) {
    console.debug("🚧 calling verifierSetColouredOutput with args:", {
      enable
    });

    if (!enable && this.verifierHandle) {
      const result = this.ffi.pactffi_verifier_set_coloured_output(
        this.verifierHandle,
        0
      );
      console.debug("✅ called verifierSetColouredOutput, result:", { result });
    } else {
      console.debug(
        "⚠️ no verifierHandle or coloured debugs already enabled:",
        {
          verifierHandle: !!this.verifierHandle,
          enable
        }
      );
    }
    return this;
  }
  public verifierSetProviderInfo(args: {
    name?: string;
    scheme?: string;
    host?: string;
    port?: number;
    path?: string;
  }) {
    console.debug("🚧 calling verifierSetProviderInfo with args:", { args });
    if (this.verifierHandle) {
      this.ffi.pactffi_verifier_set_provider_info(
        this.verifierHandle,
        // https://github.com/pact-foundation/pact-reference/blob/cfb2c03f87b3f67464291dd936d0aac555c42c91/rust/pact_ffi/src/verifier/mod.rs#L143
        // defaults
        // let handle = as_mut!(handle);
        // let name = if_null(name, "provider");
        // let scheme = if_null(scheme, "http");
        // let host = if_null(host, "localhost");
        // let path = if_null(path, "/");
        // @ts-ignore
        args.name ? cstr(args.name) : null,
        // defaults to http
        args.scheme ? cstr(args.scheme) : null,
        // defaults to localhost
        args.host ? cstr(args.host) : null,
        // errors if not set
        args.port ?? 0,
        // defaults to /
        args.path ? cstr(args.path) : null
      );
      console.debug("✅ called verifierSetProviderInfo, result:", { args });
    } else {
      console.debug("⚠️ no verifierHandle", {
        verifierHandle: !!this.verifierHandle
      });
    }
    return this;
  }
  public verifierSetVerificationOptions(args: {
    disableSslVerification: boolean;
    requestTime?: number;
  }) {
    console.debug("🚧 calling verifierSetVerificationOptions with args:", {
      args
    });
    if (this.verifierHandle) {
      this.ffi.pactffi_verifier_set_verification_options(
        this.verifierHandle,
        args.disableSslVerification ? 1 : 0,
        BigInt(args.requestTime ?? 5000)
      ); // request timeout

      console.debug("✅ added verifierSetVerificationOptions:", { args });
    } else {
      console.debug("⚠️ no verifierHandle", {
        verifierHandle: !!this.verifierHandle,
        args
      });
    }
    return this;
  }
  public verifierAddFileSource(args: { pathToFile: string }) {
    console.debug("🚧 calling verifierAddFileSource with args:", { args });
    if (this.verifierHandle) {
      this.ffi.pactffi_verifier_add_file_source(
        this.verifierHandle,
        cstr(args.pathToFile)
      );
      console.debug("✅ added verifierAddFileSource:", { args });
    } else {
      console.debug("⚠️ no verifierHandle", {
        verifierHandle: !!this.verifierHandle,
        args
      });
    }
    return this;
  }
  public verifierAddUrlSource(args: {
    url: string;
    username?: string;
    password?: string;
    token?: string;
  }) {
    console.debug("🚧 calling verifierAddUrlSource with args:", { args });
    if (this.verifierHandle) {
      this.ffi.pactffi_verifier_url_source(
        this.verifierHandle,
        cstr(args.url),
        cstr(args.username ?? ""),
        cstr(args.password ?? ""),
        cstr(args.token ?? "")
      );
      console.debug("✅ added verifierAddUrlSource:", { args });
    } else {
      console.debug("⚠️ no verifierHandle", {
        verifierHandle: !!this.verifierHandle,
        args
      });
    }
    return this;
  }
  public verifierBrokerSourceWithSelectors(args: {
    url: string;
    username?: string;
    password?: string;
    token?: string;
    enablePending?: boolean;
    includeWipPactsSince?: string | true;
    providerTags?: string[];
    providerBranch?: string;
    consumerVersionSelectors?: { [key: string]: string | boolean }[];
    consumerVersionTags?: string[];
  }) {
    console.debug("🚧 calling verifierBrokerSourceWithSelectors with args:", {
      args
    });
    if (this.verifierHandle) {
      this.ffi.pactffi_verifier_broker_source_with_selectors(
        this.verifierHandle,
        cstr(args.url),
        cstr(args.username ?? ""),
        cstr(args.password ?? ""),
        cstr(args.token ?? ""),
        args.enablePending ? 1 : 0,
        args.includeWipPactsSince === true
          ? cstr("2020-01-01")
          : cstr(args.includeWipPactsSince ?? ""),
        this.arr2Ptrs(args.providerTags ?? []),
        args.providerTags?.length ?? 0,
        cstr(args.providerBranch ?? ""),
        this.arrJson2Ptrs(args.consumerVersionSelectors ?? []),
        args.consumerVersionSelectors?.length ?? 0,
        this.arr2Ptrs(args.consumerVersionTags ?? []),
        args.consumerVersionTags?.length ?? 0
      );
      console.debug("✅ called verifierBrokerSourceWithSelectors:", { args });
    } else {
      console.debug("⚠️ no verifierHandle", {
        verifierHandle: !!this.verifierHandle,
        args
      });
    }
    return this;
  }
  public verifierBrokerSource(args: {
    url: string;
    username?: string;
    password?: string;
    token?: string;
  }) {
    console.debug("🚧 calling verifierBrokerSource with args:", { args });
    if (this.verifierHandle) {
      this.ffi.pactffi_verifier_broker_source(
        this.verifierHandle,
        cstr(args.url ?? null),
        cstr(args.username ?? ""),
        cstr(args.password ?? ""),
        cstr(args.token ?? "")
      );
      console.debug("✅ added verifierBrokerSource:", { args });
    } else {
      console.debug("⚠️ no verifierHandle", {
        verifierHandle: !!this.verifierHandle,
        args
      });
    }
    return this;
  }
  public verifierAddDirectorySource(args: { pathToDir: string }) {
    console.debug("🚧 calling verifierAddDirectorySource with args:", { args });
    //  * Adds a Pact directory as a source to verify. All pacts from the directory that match the
    //  * provider name will be verified
    // This isn't the case and it picks up all pacts
    if (this.verifierHandle) {
      this.ffi.pactffi_verifier_add_directory_source(
        this.verifierHandle,
        cstr(args.pathToDir)
      );
      console.debug("✅ added verifierAddDirectorySource:", { args });
    } else {
      console.debug("⚠️ no verifierHandle", {
        verifierHandle: !!this.verifierHandle,
        args
      });
    }
    return this;
  }
  public verifierAddProviderTransports(
    args: {
      protocol?: string;
      path?: string;
      scheme?: string;
      port?: number;
    }[]
  ) {
    console.debug("🚧 calling verifierAddProviderTransport with args:", {
      args
    });
    if (this.verifierHandle) {
      args.forEach(
        (transport: {
          protocol?: string;
          path?: string;
          port?: number;
          scheme?: string;
        }) => {
          console.debug("✅ adding transport:", { transport });

          this.ffi.pactffi_verifier_add_provider_transport(
            // @ts-ignore
            this.verifierHandle,
            transport.protocol ? cstr(transport.protocol) : null,
            transport.port ?? 0,
            transport.path ? cstr(transport.path) : null,
            transport.scheme ? cstr(transport.scheme) : null
          );
          console.debug("✅ added transport:", { transport });
        }
      );
    } else {
      console.debug("⚠️ no verifierHandle", {
        verifierHandle: !!this.verifierHandle,
        args
      });
    }
    return this;
  }
  public verifierExecute() {
    console.debug("🚧 calling verifierExecute");
    if (this.verifierHandle) {
      this.verificationResult = this.ffi.pactffi_verifier_execute(
        this.verifierHandle
      );
      console.debug(" ✅ called verifierExecute: ", {
        verificationResult: this.verificationResult
      });
      this.verifierCheckResults();
      this.verifierShutdown();
      this.denoPactClose();
      if (this.verificationResultsJson) {
        throw new Error(this.verificationResultsJson);
      }
    } else {
      console.debug("⚠️ no verifierHandle", {
        verifierHandle: this.verifierHandle
      });
    }
    return this;
  }
  public verifierWriteResultsToFile() {
    console.debug("🚧 calling verifierWriteResultsToFile");
    if (this.verificationResultsJson) {
      Deno.openSync(this.verificationResultsFileName, {
        create: true,
        write: true
      }).writeSync(new TextEncoder().encode(this.verificationResultsJson));
      console.debug(" ✅ called verifierWriteResultsToFile: ", {
        verificationResult: this.verificationResult
      });
    } else {
      console.debug("⚠️ no verifierHandle", {
        verifierHandle: !!this.verifierHandle
      });
    }
    return this;
  }
  public verifierCheckResults() {
    console.debug("🚧 calling verifierCheckResults");
    if (
      this.verifierHandle &&
      this.verificationResult &&
      this.verificationResult != 0
    ) {
      this.verificationResultsJson = readCString(
        this.ffi.pactffi_verifier_json(this.verifierHandle)
      );
      console.debug(
        " 🚨 Failed verification",
        JSON.stringify(JSON.parse(this.verificationResultsJson), null, "\t")
      );

      console.debug();
      if (this.writeVerificationResultsToFile) {
        this.verifierWriteResultsToFile();
      }
    } else {
      console.debug("⚠️ no verifierHandle", {
        verifierHandle: !!this.verifierHandle
      });
    }
    return this;
  }
  public verifierJsonResults() {
    console.debug("🚧 calling verifierJsonResults");
    if (this.verifierHandle) {
      this.verificationResultsJson = this.ffi.pactffi_verifier_json(
        this.verifierHandle
      );
      console.debug("✅ called verifierJsonResults:");
    } else {
      console.debug("⚠️ no verifierHandle", {
        verifierHandle: !!this.verifierHandle
      });
    }
    return this;
  }
  public verifierShutdown() {
    console.debug("🚧 calling verifierShutdown");
    if (this.verifierHandle) {
      this.ffi.pactffi_verifier_shutdown(this.verifierHandle);
      console.debug("✅ called verifierShutdown:");
    } else {
      console.debug("⚠️ no verifierHandle", {
        verifierHandle: !!this.verifierHandle
      });
    }
    return this;
  }
  public verifierSetFilterInfo(args: {
    description?: string;
    state?: string;
    noState?: boolean;
  }) {
    if (this.verifierHandle) {
      this.ffi.pactffi_verifier_set_filter_info(
        this.verifierHandle,
        cstr(args.description ?? ""),
        cstr(args.state ?? ""),
        args.noState ? 0 : 1
      );
    } else {
      console.debug("⚠️ no verifierHandle", {
        verifierHandle: !!this.verifierHandle
      });
    }
    return this;
  }

  public verifierSetPublishOptions(args: {
    providerVersion?: string;
    buildUrl?: string;
    providerBranch?: string;
    providerTags?: string[];
  }) {
    console.debug("verifierSetPublishOptions");

    if (this.verifierHandle) {
      this.ffi.pactffi_verifier_set_publish_options(
        this.verifierHandle,
        cstr(args.providerVersion ?? ""),
        cstr(args.buildUrl ?? ""),
        this.arr2Ptrs(args.providerTags ?? []),
        args.providerTags?.length ?? 0,
        cstr(args.providerBranch ?? "")
      );
    } else {
      console.debug("⚠️ no verifierHandle", {
        verifierHandle: !!this.verifierHandle
      });
    }
    return this;
  }
  public verifierSetConsumerFilters(args: { names?: string[] }) {
    if (this.verifierHandle) {
      console.debug("setting filters");
      this.ffi.pactffi_verifier_set_consumer_filters(
        this.verifierHandle,
        this.arr2Ptrs(args.names ?? []),
        args.names?.length ?? 0
      );
    } else {
      console.debug("⚠️ no verifierHandle", {
        verifierHandle: !!this.verifierHandle
      });
    }
    return this;
  }

  private arr2Ptrs(arr: string[]) {
    const buffer = new BigInt64Array(arr.length);
    arr.map((a, i) => {
      buffer[i] = BigInt(cstr(a));
    });
    return Deno.UnsafePointer.of(buffer) as Pointer<Pointer<number>>;
  }

  private arrJson2Ptrs(arr: { [key: string]: string | boolean }[]) {
    const buffer = new BigInt64Array(arr.length);
    arr.map((a, i) => {
      buffer[i] = BigInt(cstr(JSON.stringify(a)));
    });
    return Deno.UnsafePointer.of(buffer) as Pointer<Pointer<number>>;
  }

  // general stuff

  public pactFfi() {
    return this.ffi;
  }
  public getMockServerPort() {
    return this.mockServerPort ?? 0;
  }
  public getPactFfiVersion() {
    this.version = readCString(this.ffi.pactffi_version());
    return this.version;
  }
  public setupLoggers(logLevel?: Pact.LevelFilter) {
    this.ffi.pactffi_logger_init();
    this.ffi.pactffi_logger_attach_sink(
      cstr("stdout"),
      logLevel ?? Pact.LevelFilter.LevelFilter_Info
    );
    this.ffi.pactffi_logger_apply();
    this.ffi.pactffi_log_message(
      cstr("pact-deno-ffi"),
      cstr("INFO"),
      cstr(`hello from ffi version: ${this.getPactFfiVersion()}`)
    );

    return this;
  }
  public logMessage(msg: string, level = "INFO") {
    this.ffi.pactffi_log_message(cstr(this.appName), cstr(level), cstr(msg));
  }
  // consumer side stuff
  public newPact(consumer_name: string, provider_name: string) {
    console.debug("🚧 creating newPact", this.pact);

    this.pact = this.ffi.pactffi_new_pact(
      cstr(consumer_name),
      cstr(provider_name)
    );
    return this;
  }
  public checkMatches() {
    if (this.mockServerPort) {
      this.matched = this.ffi.pactffi_mock_server_matched(this.mockServerPort);
      this.logMessage("pactffi_mock_server_matched: " + this.matched);

      if (this.matched === 0) {
        const mismatches = this.ffi.pactffi_mock_server_mismatches(
          this.mockServerPort
        );
        if (mismatches) {
          this.logMessage(
            "pactffi_mock_server_mismatches: " + readCString(mismatches)
          );
          this.mismatches = readCString(mismatches) as string;
        }
      }
    }
    return this;
  }
  public writePactFiles(pactDir?: string, writePactIfNoMatches?: boolean) {
    if (this.mockServerPort && (this.matched || writePactIfNoMatches)) {
      const res_write_pact = this.ffi.pactffi_write_pact_file(
        this.mockServerPort,
        cstr(pactDir ?? this.PACT_FILE_DIR),
        0
      );
      this.logMessage("pactffi_write_pact_file: " + res_write_pact);
    } else {
      this.logMessage("not writing file as no port or mismatches");
    }

    return this;
  }
  public createMockServer(
    pact: Pact.PactHandle,
    hostname = "127.0.0.1",
    port = "0"
  ) {
    console.debug("🚧 creating createMockServer");

    this.mockServerPort = this.ffi.pactffi_create_mock_server(
      cstr(JSON.stringify(pact)),
      cstr(hostname + ":" + port),
      0
    );
    console.debug("🚧 created mockServerPort", this.mockServerPort);

    this.ffi.pactffi_log_message(
      cstr("pact-deno-ffi"),
      cstr("INFO"),
      cstr("pactffi_create_mock_server: running on port " + this.mockServerPort)
    );
    return this;
  }
  public cleanupMockServer() {
    if (this.mockServerPort) {
      console.debug("🚧 creating cleanupMockServer");
      const pactffi_cleanup_mock_server_result =
        this.ffi.pactffi_cleanup_mock_server(this.mockServerPort);
      this.logMessage(
        "🧹 Cleaned up Pact Mock Server: " +
          !!pactffi_cleanup_mock_server_result
      );
    }

    return this;
  }
  public cleanupPlugins() {
    if (this.pact) {
      this.ffi.pactffi_cleanup_plugins(this.pact);
      this.logMessage("🧹 Cleaned up Pact Plugins");
    }
    return this;
  }
  public addMetaDataToPact(value: string, key = "ffi") {
    console.debug("🚧 creating addMetaDataToPact");
    if (this.pact) {
      this.ffi.pactffi_with_pact_metadata(
        this.pact,
        cstr(this.appName),
        cstr(key),
        cstr(value)
      );
    }
    return this;
  }
  public newSyncMessageInteraction(description: string) {
    if (this.pact) {
      console.debug("🚧 creating new newSyncMessageInteraction");

      this.interaction = this.ffi.pactffi_new_sync_message_interaction(
        this.pact,
        cstr(description)
      );
    }
    return this;
  }
  public syncHttpPactNew() {
    console.debug("🚧 creating new newSyncHttpPact");

    this.syncHttpPact = this.ffi.pactffi_sync_http_new();

    return this;
  }
  public newInteraction(description: string) {
    if (this.pact) {
      console.debug("🚧 creating new interaction");
      this.interaction = this.ffi.pactffi_new_interaction(
        this.pact,
        cstr(description)
      );
    }
    return this;
  }
  public given(description: string) {
    if (this.interaction) {
      console.debug("🚧 creating given");

      const res = this.ffi.pactffi_given(this.interaction, cstr(description));
      console.debug("🚧 result: ", res);
    }
    return this;
  }
  public givenWithParam(description: string, name: string, value: string) {
    if (this.interaction) {
      console.debug("🚧 creating givenWithParam");

      const res = this.ffi.pactffi_given_with_param(
        this.interaction,
        cstr(description),
        cstr(name),
        cstr(value)
      );
      console.debug("🚧 result: ", res);
    }
    return this;
  }
  public withRequest(path: string, method = "GET") {
    if (this.interaction) {
      console.debug("🚧 creating withRequest", { path, method });

      const res = this.ffi.pactffi_with_request(
        this.interaction,
        cstr(method),
        cstr(path)
      );
      console.debug("🚧 result: ", res);
    }
    return this;
  }
  public withResponse(code: number) {
    if (this.interaction) {
      console.debug("🚧 creating withResponse");

      const res = this.ffi.pactffi_response_status(this.interaction, code);
      console.debug("🚧 result: ", res);
    }
    return this;
  }
  public uponReceiving(description: string) {
    if (this.interaction) {
      console.debug("🚧 creating uponReceiving");

      const res = this.ffi.pactffi_upon_receiving(
        this.interaction,
        cstr(description)
      );
      console.debug("🚧 result: ", res);
    }
    return this;
  }
  public setPactSpecification(specification: Pact.PactSpecification = 5) {
    if (this.pact) {
      console.debug("🚧 creating pact spec version");

      const res = this.ffi.pactffi_with_specification(this.pact, specification);
      console.debug("🚧 result: ", res);
    }
    return this;
  }
  public usingPactPlugin(pluginName: string, pluginVersion = "") {
    if (this.pact) {
      console.debug("🚧 creating usingPactPlugin");

      const res = this.ffi.pactffi_using_plugin(
        this.pact,
        cstr(pluginName),
        cstr(pluginVersion)
      );
      console.debug("🚧 result: ", res);
    }
    return this;
  }
  public syncHttpSetRequestContents(contents: any, contentType: string) {
    if (this.syncHttpPact) {
      console.debug("🚧 creating syncHttpSetRequestContents", {
        contentType,
        contents
      });

      this.ffi.pactffi_sync_http_set_request_contents(
        this.syncHttpPact,
        contentType.includes("json")
          ? cstr(JSON.stringify(contents))
          : cstr(contents),
        cstr(contentType)
      );
      console.debug("🚧 set syncHttpSetResponseContents: ");
    }
    return this;
  }
  public syncHttpSetRequestDescription(description: string) {
    if (this.syncHttpPact) {
      console.debug("🚧 creating syncHttpSetRequestDescription", {
        description
      });

      const res = this.ffi.pactffi_sync_http_set_description(
        this.syncHttpPact,
        cstr(description)
      );
      console.debug("🚧 result: ", res);
    }
    return this;
  }
  public syncHttpSetResponseContents(contents: any, contentType: string) {
    if (this.syncHttpPact) {
      console.debug("🚧 creating syncHttpSetResponseContents", {
        contentType,
        contents
      });

      this.ffi.pactffi_sync_http_set_response_contents(
        this.syncHttpPact,
        contentType.includes("json")
          ? cstr(JSON.stringify(contents))
          : cstr(contents),
        cstr(contentType)
      );
      console.debug("🚧 set syncHttpSetResponseContents: ");
    }
    return this;
  }
  public withInteractionContents(
    interactionPart: Pact.InteractionPart,
    transportType: string,
    contents: any
  ) {
    if (this.interaction) {
      console.debug("🚧 creating withInteractionContents", {
        interactionPart,
        transportType,
        contents
      });

      const res = this.ffi.pactffi_interaction_contents(
        this.interaction,
        interactionPart,
        cstr(transportType),
        cstr(JSON.stringify(contents))
      );
      console.debug("🚧 result: ", res);
    }
    return this;
  }
  public withBody(
    interactionPart: Pact.InteractionPart,
    contentType: string,
    contents: any
  ) {
    if (this.interaction) {
      console.debug("🚧 creating withBody");

      const res = this.ffi.pactffi_with_body(
        this.interaction,
        interactionPart,
        cstr(contentType),
        cstr(contentType.includes("json") ? JSON.stringify(contents) : contents)
      );
      console.debug("🚧 result: ", res);
    }
    return this;
  }
  public withQueryParamV2(params: { name: string; value: string }[]) {
    if (this.interaction) {
      console.debug("🚧 creating withQueryParamV2");

      params.map((param, i) => {
        if (this.interaction) {
          console.debug("creating query param", { param, i });
          const res = this.ffi.pactffi_with_query_parameter_v2(
            this.interaction,
            cstr(param.name),
            0,
            cstr(param.name)
          );
          console.debug("🚧 created withQueryParamV2: ", { res, param });
        } else {
          console.debug("🚧 failed to create withQueryParamV2: ", { param });
        }
      });
    }
    return this;
  }
  public withHeader(
    interactionPart: Pact.InteractionPart,
    headerName: string,
    headerValue: string
  ) {
    if (this.interaction) {
      console.debug("🚧 creating withHeader");

      const res = this.ffi.pactffi_with_header_v2(
        this.interaction,
        interactionPart,
        cstr(headerName),
        0,
        cstr(headerValue)
      );
      console.debug("🚧 created withHeader: ", res);
    }
    return this;
  }
  public createMockServerForTransport(
    transport: string,
    address = "0.0.0.0",
    port = 0,
    transportOptions: 0 | any = 0
  ) {
    if (this.pact) {
      console.debug("🚧 creating createMockServerForTransport");

      this.mockServerPort = this.ffi.pactffi_create_mock_server_for_transport(
        this.pact,
        cstr(address),
        port,
        cstr(transport),
        transportOptions
      );
    }
    return this;
  }

  public async executeTest(callback: () => Promise<void>) {
    let result;
    if (this.mockServerPort) {
      try {
        result = await callback();
      } catch (err) {
        this.checkMatches().cleanupMockServer().cleanupPlugins().ffi.$$close();
        console.debug("An error occurred executing your test ", err);
        return JSON.stringify(
          {
            message: "🚨 Failed to execute your test",
            error: err.message,
            ok: false
          },
          null,
          "\t"
        );
        // return {
        //   then(cb: (results: string) => void) {
        //     return cb("🚨 tests failed" + err.message);
        //   }
        // };
      }
      this.checkMatches();
      if (this.matched === 1) {
        this.writePactFiles()
          .cleanupMockServer()
          .cleanupPlugins()
          .ffi.$$close();
        return JSON.stringify(
          { message: "✅ tests passed 👌", ok: true },
          null,
          "\t"
        );
        // return {
        //   then(cb: (results: string) => void) {
        //     return cb("✅ tests passed 👌");
        //   }
        // };
      } else {
        this.cleanupMockServer().cleanupPlugins().ffi.$$close();
        console.debug("show you da mismatches");
        const results = this.mismatches
          ? JSON.stringify(
              {
                message: "🚨 tests failed",
                error: JSON.parse(this.mismatches),
                ok: false
              },
              null,
              "\t"
            )
          : JSON.stringify(
              {
                message: "🚨 tests failed",
                error: "Mock server unable to return mismatches",
                ok: false
              },
              null,
              "\t"
            );
        return results;
        // return {
        //   then(cb: (results: string) => void) {
        //     return cb(results);
        //   }
        // };
      }
    } else {
      this.cleanupPlugins().ffi.$$close();
      return JSON.stringify(
        {
          message: "🚨 Failed to execute your test",
          error: "Mock server is not running, so could not execute test",
          ok: false
        },
        null,
        "\t"
      );
      // return {
      //   then(cb: (results: string) => void) {
      //     return cb("Mock server is not running, so could not execute test");
      //   }
      // };
    }
  }
}
