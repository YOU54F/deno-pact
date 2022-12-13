export type FfiHandle = number;
export type FfiPactHandle = number;
export type FfiInteractionHandle = number;
export type FfiVerifierHandle = number;
export type FfiMessagePactHandle = number;
export type FfiMessageHandle = number;

export type FfiSpecificationVersion = 0 | 1 | 2 | 3 | 4 | 5;

export const FfiSpecificationVersion: Record<string, FfiSpecificationVersion> =
  {
    SPECIFICATION_VERSION_UNKNOWN: 0,
    SPECIFICATION_VERSION_V1: 1,
    SPECIFICATION_VERSION_V1_1: 2,
    SPECIFICATION_VERSION_V2: 3,
    SPECIFICATION_VERSION_V3: 4,
    SPECIFICATION_VERSION_V4: 5,
  };

export type FfiWritePactResponse = 0 | 1 | 2 | 3;

export const FfiWritePactResponse: Record<string, FfiWritePactResponse> = {
  SUCCESS: 0,
  GENERAL_PANIC: 1,
  UNABLE_TO_WRITE_PACT_FILE: 2,
  MOCK_SERVER_NOT_FOUND: 3,
};

export type FfiWriteMessagePactResponse = 0 | 1 | 2;

export const FfiWriteMessagePactResponse: Record<
  string,
  FfiWriteMessagePactResponse
> = {
  SUCCESS: 0,
  UNABLE_TO_WRITE_PACT_FILE: 1,
  MESSAGE_HANDLE_INVALID: 2,
};

export type FfiConfigurePluginResponse = 0 | 1 | 2 | 3;

export const FfiConfigurePluginResponse: Record<
  string,
  FfiConfigurePluginResponse
> = {
  SUCCESS: 0,
  GENERAL_PANIC: 1,
  FAILED_TO_LOAD_PLUGIN: 2,
  PACT_HANDLE_INVALID: 3,
};

export type FfiPluginInteractionResponse = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const FfiPluginInteractionResponse: Record<
  string,
  FfiPluginInteractionResponse
> = {
  SUCCESS: 0,
  A_GENERAL_PANIC_WAS_CAUGHT: 1,
  MOCK_SERVER_HAS_ALREADY_BEEN_STARTED: 2,
  INTERACTION_HANDLE_IS_INVALID: 3,
  CONTENT_TYPE_IS_NOT_VALID: 4,
  CONTENTS_JSON_IS_NOT_VALID_JSON: 5,
  PLUGIN_RETURNED_AN_ERROR: 6,
};

export type FfiInteractionPart = 0 | 1;

export const INTERACTION_PART_REQUEST: FfiInteractionPart = 0;
export const INTERACTION_PART_RESPONSE: FfiInteractionPart = 1;

export const CREATE_MOCK_SERVER_ERRORS = {
  NULL_POINTER: -1,
  JSON_PARSE_ERROR: -2,
  MOCK_SERVER_START_FAIL: -3,
  CORE_PANIC: -4,
  ADDRESS_NOT_VALID: -5,
  TLS_CONFIG: -6,
};
/*
-1	A null pointer was received
-2	The pact JSON could not be parsed
-3	The mock server could not be started
-4	The method panicked
-5	The address is not valid
-6	Could not create the TLS configuration with the self-signed certificate
*/

export enum VERIFY_PROVIDER_RESPONSE {
  VERIFICATION_SUCCESSFUL = 0,
  VERIFICATION_FAILED,
  NULL_POINTER_RECEIVED,
  METHOD_PANICKED,
  INVALID_ARGUMENTS,
}
/*
 * | Error | Description |
 * |-------|-------------|
 * | 1 | The verification process failed, see output for errors |
 * | 2 | A null pointer was received |
 * | 3 | The method panicked |
 * | 4 | Invalid arguments were provided to the verification process |
 */

export enum FfiFunctionResult {
  RESULT_OK = 0,
  RESULT_FAILED,
}

export enum FfiLogLevelFilter {
  LOG_LEVEL_OFF = 0,
  LOG_LEVEL_ERROR,
  LOG_LEVEL_WARN,
  LOG_LEVEL_INFO,
  LOG_LEVEL_DEBUG,
  LOG_LEVEL_TRACE,
}
