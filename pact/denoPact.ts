import home_dir from "https://deno.land/x/dir/home_dir/mod.ts";
import * as path from "https://deno.land/std/path/mod.ts";
import {
  cstr,
  loadPactFfi,
  readCString,
  PactFfi
} from "./lib/mod.ts";
import { PactFfi as Pact } from "./lib/types.ts";

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
  private interaction: Pact.InteractionHandle | null;
  private mockServerPort: number | null;
  private matched: number;
  private mismatches: string | null;

  constructor() {
    this.ffi = loadPactFfi(libraryLocation);
    this.version = "";
    this.pact = null;
    this.interaction = null;
    this.mockServerPort = null;
    this.matched = 0;
    this.mismatches = null;
    this.interaction = null;
  }

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

  public newPact(consumer_name: string, provider_name: string) {
    this.pact = this.ffi.pactffi_new_pact(
      cstr(consumer_name),
      cstr(provider_name)
    );
    return this;
  }

  public logMessage(msg: string, level = "INFO") {
    this.ffi.pactffi_log_message(cstr(this.appName), cstr(level), cstr(msg));
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
    this.mockServerPort = this.ffi.pactffi_create_mock_server(
      cstr(JSON.stringify(pact)),
      cstr(hostname + ":" + port),
      0
    );
    this.ffi.pactffi_log_message(
      cstr("pact-deno-ffi"),
      cstr("INFO"),
      cstr("pactffi_create_mock_server: running on port " + this.mockServerPort)
    );
    return this;
  }
  public cleanupMockServer() {
    if (this.mockServerPort) {
      const pactffi_cleanup_mock_server_result =
        this.ffi.pactffi_cleanup_mock_server(this.mockServerPort);
      this.logMessage(
        "🧹 Cleaned up Pact Mock Server: " +
          !!pactffi_cleanup_mock_server_result
      );
    }

    // return pactffi_cleanup_mock_server_result;

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
      this.interaction = this.ffi.pactffi_new_sync_message_interaction(
        this.pact,
        cstr(description)
      );
    }
    return this;
  }
  public setPactSpecification(specification: Pact.PactSpecification = 5) {
    if (this.pact) {
      this.ffi.pactffi_with_specification(this.pact, specification);
    }
    return this;
  }
  public usingPactPlugin(pluginName: string, pluginVersion = "") {
    if (this.pact) {
      this.ffi.pactffi_using_plugin(
        this.pact,
        cstr(pluginName),
        cstr(pluginVersion)
      );
    }
    return this;
  }
  public withInteractionContents(
    interactionPart: Pact.InteractionPart,
    transportType: string,
    contents: any
  ) {
    if (this.interaction) {
      this.ffi.pactffi_interaction_contents(
        this.interaction,
        interactionPart,
        cstr(transportType),
        cstr(JSON.stringify(contents))
      );
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

  public async executeTest(callback:  () => Promise<void>) {
    if (this.mockServerPort) {
      try {
        await callback();
      } catch (err) {
        this.checkMatches().cleanupMockServer().cleanupPlugins();
        return {
          then(cb: (results: string) => void) {
            return cb("🚨 tests failed" + err.message);
          }
        };
      }
      this.checkMatches()
      if (this.matched === 1) {
        this
          .writePactFiles()
          .cleanupMockServer()
          .cleanupPlugins();
        return {
          then(cb: (results: string) => void) {
            return cb("✅ tests passed 👌");
          }
        };
      } else {
        this.cleanupMockServer().cleanupPlugins();
        const results = this.mismatches
          ? "🚨 tests failed, check out the errors below 👇: \n" +
            JSON.stringify(JSON.parse(this.mismatches), null, "\t")
          : "🚨 tests failed";

        return {
          then(cb: (results: string) => void) {
            return cb(results);
          }
        };
      }
    } else {
      this.cleanupPlugins();
      return {
        then(cb: (results: string) => void) {
          return cb("Mock server is not running, so could not execute test");
        }
      };
    }
  }
}
