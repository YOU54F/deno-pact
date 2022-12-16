import { Buffer } from "https://deno.land/std@0.167.0/io/buffer.ts";
// import {
//   CREATE_MOCK_SERVER_ERRORS,
//   Ffi,
//   FfiPactHandle,
//   FfiSpecificationVersion,
//   FfiWritePactResponse,
//   INTERACTION_PART_REQUEST,
//   INTERACTION_PART_RESPONSE
// } from "./pactcore.ffi.ts";
//   import {
//     getLogLevel,
//     setLogLevel,
//     logCrashAndThrow,
//     logErrorAndThrow,
//   } from '../logger';
import { wrapAllWithCheck, wrapWithCheck } from "./checkErrors.ts";

import {
  AsynchronousMessage,
  ConsumerInteraction,
  ConsumerMessagePact,
  ConsumerPact,
  MatchingResult,
  Mismatch,
  SynchronousMessage
} from "./pactcore.d.ts";
import { cstr, loadPactFfi, PactFfi, readCString } from "../lib/mod.ts";
import { libraryLocation } from "../denoPact.ts";
import {
  CREATE_MOCK_SERVER_ERRORS,
  FfiPactHandle,
  FfiSpecificationVersion,
  FfiWritePactResponse,
  INTERACTION_PART_REQUEST,
  INTERACTION_PART_RESPONSE,
  FfiLogLevelFilter
} from "./ffiTypes.ts";
export const makeConsumerPact = (
  consumer: string,
  provider: string,
  version: FfiSpecificationVersion = 3,
  // logLevel = getLogLevel()
  logLevel = "info"
): ConsumerPact => {
  // const ffi = getFfiLib(logLevel);
  const ffi = loadPactFfi(libraryLocation);

  if (logLevel) {
    ffi.pactffi_logger_init();
    ffi.pactffi_logger_attach_sink(
      cstr("stdout"),
      4
    );
    ffi.pactffi_logger_apply();
  }

  const pactPtr = ffi.pactffi_new_pact(cstr(consumer), cstr(provider));
  if (!ffi.pactffi_with_specification(pactPtr, version)) {
    throw new Error(
      `Unable to set core spec version. The pact FfiSpecificationVersion '${version}' may be invalid (note this is not the same as the pact spec version)`
    );
  }

  return {
    addPlugin: (name: string, version: string) => {
      ffi.pactffi_using_plugin(pactPtr, cstr(name), cstr(version));
    },
    cleanupPlugins: () => {
      ffi.pactffi_cleanup_plugins(pactPtr);
    },
    createMockServer: (
      address: string,
      requestedPort?: number,
      tls = false
    ) => {
      const port = ffi.pactffi_create_mock_server_for_pact(
        pactPtr,
        cstr(`${address}:${requestedPort ? requestedPort : 0}`),
        tls ? 1 : 0
      );
      const error: keyof typeof CREATE_MOCK_SERVER_ERRORS | undefined =
        Object.keys(CREATE_MOCK_SERVER_ERRORS).find(
          (key) => CREATE_MOCK_SERVER_ERRORS[key] === port
        ) as keyof typeof CREATE_MOCK_SERVER_ERRORS;
      if (error) {
        if (error === "ADDRESS_NOT_VALID") {
          logErrorAndThrow(
            `Unable to start mock server at '${address}'. Is the address and port valid?`
          );
        }
        if (error === "TLS_CONFIG") {
          logErrorAndThrow(
            `Unable to create TLS configuration with self-signed certificate`
          );
        }
        logCrashAndThrow(
          `The pact core couldn\'t create the mock server because of an error described by '${error}'`
        );
      }
      if (port <= 0) {
        logCrashAndThrow(
          `The pact core returned an unhandled error code '${port}'`
        );
      }
      return port;
    },
    mockServerMatchedSuccessfully: (port: number) => {
      return !!ffi.pactffi_mock_server_matched(port);
    },
    mockServerMismatches: (port: number): MatchingResult[] => {
      return mockServerMismatches(ffi, port);
    },
    cleanupMockServer: (port: number): boolean => {
      return wrapWithCheck<(port: number) => boolean>(
        (port: number): boolean => !!ffi.pactffi_cleanup_mock_server(port),
        "cleanupMockServer"
      )(port);
    },
    writePactFile: (dir: string, merge = true) =>
      writePact(ffi, pactPtr, dir, merge),
    writePactFileForPluginServer: (port: number, dir: string, merge = true) =>
      writePact(ffi, pactPtr, dir, merge, port),
    addMetadata: (namespace: string, name: string, value: string): boolean => {
      return !!ffi.pactffi_with_pact_metadata(
        pactPtr,
        cstr(namespace),
        cstr(name),
        cstr(value)
      );
    },
    newAsynchronousMessage: (description: string): AsynchronousMessage => {
      const interactionPtr = ffi.pactffi_new_async_message(
        pactPtr,
        cstr(description)
      );

      return asyncMessage(ffi, interactionPtr);
    },
    newSynchronousMessage: (description: string): SynchronousMessage => {
      // TODO: will this automatically set the correct spec version?
      const interactionPtr = ffi.pactffi_new_async_message(
        pactPtr,
        cstr(description)
      );

      return {
        withPluginRequestInteractionContents: (
          contentType: string,
          contents: string
        ) => {
          ffi.pactffi_interaction_contents(
            interactionPtr,
            INTERACTION_PART_REQUEST,
            cstr(contentType),
            cstr(contents)
          );
          return true;
        },
        withPluginResponseInteractionContents: (
          contentType: string,
          contents: string
        ) => {
          ffi.pactffi_interaction_contents(
            interactionPtr,
            INTERACTION_PART_RESPONSE,
            cstr(contentType),
            cstr(contents)
          );
          return true;
        },
        withPluginRequestResponseInteractionContents: (
          contentType: string,
          contents: string
        ) => {
          ffi.pactffi_interaction_contents(
            interactionPtr,
            INTERACTION_PART_REQUEST,
            cstr(contentType),
            cstr(contents)
          );
          return true;
        },
        given: (state: string) => {
          return ffi.pactffi_given(interactionPtr, cstr(state));
        },
        givenWithParam: (state: string, name: string, value: string) => {
          return ffi.pactffi_given_with_param(
            interactionPtr,
            cstr(state),
            cstr(name),
            cstr(value)
          );
        },
        withRequestContents: (body: string, contentType: string) => {
          return ffi.pactffi_with_body(
            interactionPtr,
            INTERACTION_PART_REQUEST,
            cstr(contentType),
            cstr(body)
          );
        },
        withResponseContents: (body: string, contentType: string) => {
          return ffi.pactffi_with_body(
            interactionPtr,
            INTERACTION_PART_RESPONSE,
            cstr(contentType),
            cstr(body)
          );
        },
        withRequestBinaryContents: (body: Buffer, contentType: string) => {
          return ffi.pactffi_with_binary_file(
            interactionPtr,
            INTERACTION_PART_REQUEST,
            cstr(contentType),
            cstr(body),
            body.length
          );
        },
        withResponseBinaryContents: (body: Buffer, contentType: string) => {
          return ffi.pactffi_with_binary_file(
            interactionPtr,
            INTERACTION_PART_RESPONSE,
            cstr(contentType),
            cstr(body),
            body.length
          );
        },
        withMetadata: (name: string, value: string) => {
          return ffi.pactffi_message_with_metadata(
            interactionPtr,
            cstr(name),
            cstr(value)
          );
        }
      };
    },
    pactffiCreateMockServerForTransport(
      address: string,
      transport: string,
      config: string,
      port?: number
    ) {
      return ffi.pactffi_create_mock_server_for_transport(
        pactPtr,
        cstr(address),
        port || 0,
        cstr(transport),
        cstr(config)
      );
    },
    newInteraction: (description: string): ConsumerInteraction => {
      const interactionPtr = ffi.pactffi_new_interaction(
        pactPtr,
        cstr(description)
      );

      return wrapAllWithCheck<ConsumerInteraction>({
        uponReceiving: (description: string) => {
          return !!ffi.pactffi_upon_receiving(
            interactionPtr,
            cstr(description)
          );
        },
        given: (state: string) => {
          return !!ffi.pactffi_given(interactionPtr, cstr(state));
        },
        givenWithParam: (state: string, name: string, value: string) => {
          return !!ffi.pactffi_given_with_param(
            interactionPtr,
            cstr(state),
            cstr(name),
            cstr(value)
          );
        },
        withRequest: (method: string, path: string) => {
          return !!ffi.pactffi_with_request(
            interactionPtr,
            cstr(method),
            cstr(path)
          );
        },
        withQuery: (name: string, index: number, value: string) => {
          return !!ffi.pactffi_with_query_parameter(
            interactionPtr,
            cstr(name),
            index,
            cstr(value)
          );
        },
        withRequestHeader: (name: string, index: number, value: string) => {
          return !!ffi.pactffi_with_header(
            interactionPtr,
            INTERACTION_PART_REQUEST,
            cstr(name),
            index,
            cstr(value)
          );
        },
        withRequestBody: (body: string, contentType: string) => {
          return !!ffi.pactffi_with_body(
            interactionPtr,
            INTERACTION_PART_REQUEST,
            cstr(contentType),
            cstr(body)
          );
        },
        withRequestBinaryBody: (body: Buffer, contentType: string) => {
          return !!ffi.pactffi_with_binary_file(
            interactionPtr,
            INTERACTION_PART_REQUEST,
            cstr(contentType),
            cstr(body),
            body.length
          );
        },
        withRequestMultipartBody: (
          contentType: string,
          filename: string,
          mimePartName: string
        ) => {
          return (
            ffi.pactffi_with_multipart_file(
              interactionPtr,
              INTERACTION_PART_REQUEST,
              cstr(contentType),
              cstr(filename),
              cstr(mimePartName)
            ) === undefined
          );
        },
        withResponseHeader: (name: string, index: number, value: string) => {
          return !!ffi.pactffi_with_header(
            interactionPtr,
            INTERACTION_PART_RESPONSE,
            cstr(name),
            index,
            cstr(value)
          );
        },
        withResponseBody: (body: string, contentType: string) => {
          return !!ffi.pactffi_with_body(
            interactionPtr,
            INTERACTION_PART_RESPONSE,
            cstr(contentType),
            cstr(body)
          );
        },
        withResponseBinaryBody: (body: Buffer, contentType: string) => {
          return !!ffi.pactffi_with_binary_file(
            interactionPtr,
            INTERACTION_PART_RESPONSE,
            cstr(contentType),
            cstr(body),
            body.length
          );
        },
        withResponseMultipartBody: (
          contentType: string,
          filename: string,
          mimePartName: string
        ) => {
          return (
            ffi.pactffi_with_multipart_file(
              interactionPtr,
              INTERACTION_PART_RESPONSE,
              cstr(contentType),
              cstr(filename),
              cstr(mimePartName)
            ) === undefined
          );
        },
        withStatus: (status: number) => {
          return !!ffi.pactffi_response_status(interactionPtr, status);
        },
        withPluginRequestInteractionContents: (
          contentType: string,
          contents: string
        ) => {
          console.log(interactionPtr);
          console.log(INTERACTION_PART_REQUEST);
          ffi.pactffi_interaction_contents(
            interactionPtr,
            INTERACTION_PART_REQUEST,
            cstr(contentType),
            cstr(contents)
          );

          return true;
        },
        withPluginRequestResponseInteractionContents: (
          contentType: string,
          contents: string
        ) => {
          ffi.pactffi_interaction_contents(
            interactionPtr,
            INTERACTION_PART_REQUEST,
            cstr(contentType),
            cstr(contents)
          );

          return true;
        },
        withPluginResponseInteractionContents: (
          contentType: string,
          contents: string
        ) => {
          ffi.pactffi_interaction_contents(
            interactionPtr,
            INTERACTION_PART_RESPONSE,
            cstr(contentType),
            cstr(contents)
          );
          return true;
        }
      });
    }
  };
};

export const makeConsumerMessagePact = (
  consumer: string,
  provider: string,
  version: FfiSpecificationVersion = 4,
  logLevel = "info"
  //   logLevel = getLogLevel()
): ConsumerMessagePact => {
  const ffi = loadPactFfi(libraryLocation);
  //   if (logLevel) {
  //     setLogLevel(logLevel);
  //   }

  const pactPtr = ffi.pactffi_new_pact(cstr(consumer), cstr(provider));
  if (!ffi.pactffi_with_specification(pactPtr, version) || version < 4) {
    throw new Error(
      `Unable to set core spec version. The pact FfiSpecificationVersion '${version}' may be invalid (note this is not the same as the pact spec version). It should be set to at least 3`
    );
  }

  return {
    addPlugin: (name: string, version: string) => {
      ffi.pactffi_using_plugin(pactPtr, cstr(name), cstr(version));
    },
    cleanupPlugins: () => {
      ffi.pactffi_cleanup_plugins(pactPtr);
    },
    cleanupMockServer: (port: number): boolean => {
      return wrapWithCheck<(port: number) => boolean>(
        (port: number): boolean => !!ffi.pactffi_cleanup_mock_server(port),
        "cleanupMockServer"
      )(port);
    },
    writePactFile: (dir: string, merge = true) =>
      writePact(ffi, pactPtr, dir, merge),
    writePactFileForPluginServer: (port: number, dir: string, merge = true) =>
      writePact(ffi, pactPtr, dir, merge, port),
    addMetadata: (namespace: string, name: string, value: string): boolean => {
      return !!ffi.pactffi_with_pact_metadata(
        pactPtr,
        cstr(namespace),
        cstr(name),
        cstr(value)
      );
    },
    // Alias for newAsynchronousMessage
    newMessage: (description: string): AsynchronousMessage => {
      const interactionPtr = ffi.pactffi_new_async_message(
        pactPtr,
        cstr(description)
      );

      return asyncMessage(ffi, interactionPtr);
    },
    newAsynchronousMessage: (description: string): AsynchronousMessage => {
      const interactionPtr = ffi.pactffi_new_async_message(
        pactPtr,
        cstr(description)
      );

      return asyncMessage(ffi, interactionPtr);
    },
    newSynchronousMessage: (description: string): SynchronousMessage => {
      // TODO: will this automatically set the correct spec version?
      const interactionPtr = ffi.pactffi_new_async_message(
        pactPtr,
        cstr(description)
      );

      return {
        withPluginRequestInteractionContents: (
          contentType: string,
          contents: string
        ) => {
          ffi.pactffi_interaction_contents(
            interactionPtr,
            INTERACTION_PART_REQUEST,
            cstr(contentType),
            cstr(contents)
          );
          return true;
        },
        withPluginResponseInteractionContents: (
          contentType: string,
          contents: string
        ) => {
          ffi.pactffi_interaction_contents(
            interactionPtr,
            INTERACTION_PART_RESPONSE,
            cstr(contentType),
            cstr(contents)
          );
          return true;
        },
        withPluginRequestResponseInteractionContents: (
          contentType: string,
          contents: string
        ) => {
          ffi.pactffi_interaction_contents(
            interactionPtr,
            INTERACTION_PART_REQUEST,
            cstr(contentType),
            cstr(contents)
          );
          return true;
        },
        given: (state: string) => {
          return ffi.pactffi_given(interactionPtr, cstr(state));
        },
        givenWithParam: (state: string, name: string, value: string) => {
          return ffi.pactffi_given_with_param(
            interactionPtr,
            cstr(state),
            cstr(name),
            cstr(value)
          );
        },
        withRequestContents: (body: string, contentType: string) => {
          return ffi.pactffi_with_body(
            interactionPtr,
            INTERACTION_PART_REQUEST,
            cstr(contentType),
            cstr(body)
          );
        },
        withResponseContents: (body: string, contentType: string) => {
          return ffi.pactffi_with_body(
            interactionPtr,
            INTERACTION_PART_RESPONSE,
            cstr(contentType),
            cstr(body)
          );
        },
        withRequestBinaryContents: (body: Buffer, contentType: string) => {
          return ffi.pactffi_with_binary_file(
            interactionPtr,
            INTERACTION_PART_REQUEST,
            cstr(contentType),
            cstr(body),
            body.length
          );
        },
        withResponseBinaryContents: (body: Buffer, contentType: string) => {
          return ffi.pactffi_with_binary_file(
            interactionPtr,
            INTERACTION_PART_RESPONSE,
            cstr(contentType),
            cstr(body),
            body.length
          );
        },
        withMetadata: (name: string, value: string) => {
          return ffi.pactffi_message_with_metadata(
            interactionPtr,
            cstr(name),
            cstr(value)
          );
        }
      };
    },
    pactffiCreateMockServerForTransport(
      address: string,
      transport: string,
      config: string,
      port?: number
    ) {
      return ffi.pactffi_create_mock_server_for_transport(
        pactPtr,
        cstr(address),
        port || 0,
        cstr(transport),
        cstr(config)
      );
    },
    mockServerMatchedSuccessfully: (port: number) => {
      return !!ffi.pactffi_mock_server_matched(port);
    },
    mockServerMismatches: (port: number): MatchingResult[] => {
      return mockServerMismatches(ffi, port);
    }
  };
};

export const makeConsumerAsyncMessagePact = makeConsumerMessagePact;

const mockServerMismatches = (ffi: typeof PactFfi, port: number) => {
  const results: MatchingResult[] = JSON.parse(
    readCString(ffi.pactffi_mock_server_mismatches(port))
  );
  return results.map((result: MatchingResult) => ({
    ...result,
    ...("mismatches" in result
      ? {
          mismatches: result.mismatches.map((m: string | Mismatch) =>
            typeof m === "string" ? JSON.parse(m) : m
          )
        }
      : {})
  }));
};
const writePact = (
  ffi: typeof PactFfi,
  pactPtr: FfiPactHandle,
  dir: string,
  merge = true,
  port = 0
) => {
  let result: FfiWritePactResponse;
  console.log(port)
  if (port != 0) {
    result = ffi.pactffi_write_pact_file(
      port,
      cstr(dir),
      !merge ? 0 : 1
    ) as FfiWritePactResponse;
  } else {
    result = ffi.pactffi_write_pact_file(
      pactPtr,
      cstr(dir),
      !merge ? 0 : 1
    ) as FfiWritePactResponse;
  }

  switch (result) {
    case FfiWritePactResponse.SUCCESS:
      return;
    case FfiWritePactResponse.UNABLE_TO_WRITE_PACT_FILE:
      logErrorAndThrow("The pact core was unable to write the pact file");
      break;
    case FfiWritePactResponse.GENERAL_PANIC:
      logCrashAndThrow("The pact core panicked while writing the pact file");
      break;
    case FfiWritePactResponse.MOCK_SERVER_NOT_FOUND:
      logCrashAndThrow(
        "The pact core was asked to write a pact file from a mock server that appears not to exist"
      );
      break;
    default:
      logCrashAndThrow(
        `The pact core returned an unknown error code (${result}) instead of writing the pact`
      );
  }
};

const asyncMessage = (ffi: typeof PactFfi, interactionPtr: number) => ({
  withPluginRequestInteractionContents: (
    contentType: string,
    contents: string
  ) => {
    ffi.pactffi_interaction_contents(
      interactionPtr,
      INTERACTION_PART_REQUEST,
      cstr(contentType),
      cstr(contents)
    );
    return true;
  },
  expectsToReceive: (description: string) => {
    return ffi.pactffi_message_expects_to_receive(
      interactionPtr,
      cstr(description)
    );
  },
  given: (state: string) => {
    return ffi.pactffi_message_given(interactionPtr, cstr(state));
  },
  givenWithParam: (state: string, name: string, value: string) => {
    return ffi.pactffi_message_given_with_param(
      interactionPtr,
      cstr(state),
      cstr(name),
      cstr(value)
    );
  },
  withContents: (body: string, contentType: string) => {
    return ffi.pactffi_message_with_contents(
      interactionPtr,
      cstr(contentType),
      cstr(body),
      body.length
    );
  },
  withBinaryContents: (body: Buffer, contentType: string) => {
    return ffi.pactffi_message_with_contents(
      interactionPtr,
      cstr(contentType),
      cstr(body),
      body.length
    );
  },
  reifyMessage: () => {
    return ffi.pactffi_message_reify(interactionPtr);
  },
  withMetadata: (name: string, value: string) => {
    return ffi.pactffi_message_with_metadata(interactionPtr, name, value);
  }
});

export * from "./pact.d.ts";

export const logErrorAndThrow = (message: string, context?: string): never => {
  console.error(message, context);
  throw new Error(message);
};

export const logCrashAndThrow = (message: string, context?: string): never => {
  console.error(message, context);
  throw new Error(message);
};
