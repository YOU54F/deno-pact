export const PactFfi_SYMBOLS = {
  malloc: {
    name: "malloc",
    parameters: ["usize"],
    result: "pointer"
  },
  calloc: {
    name: "calloc",
    parameters: ["usize", "usize"],
    result: "pointer"
  },
  realloc: {
    name: "realloc",
    parameters: ["pointer", "usize"],
    result: "pointer"
  },
  free: {
    name: "free",
    parameters: ["pointer"],
    result: "void"
  },
  posix_memalign: {
    name: "posix_memalign",
    parameters: ["pointer", "usize", "usize"],
    result: "i32"
  },
  abort: {
    name: "abort",
    parameters: [],
    result: "void"
  },
  getenv: {
    name: "getenv",
    parameters: ["pointer"],
    result: "pointer"
  },
  realpath: {
    name: "realpath",
    parameters: ["pointer", "pointer"],
    result: "pointer"
  },
  pactffi_version: {
    name: "pactffi_version",
    parameters: [],
    result: "pointer"
  },
  pactffi_init: {
    name: "pactffi_init",
    parameters: ["pointer"],
    result: "void"
  },
  pactffi_init_with_log_level: {
    name: "pactffi_init_with_log_level",
    parameters: ["pointer"],
    result: "void"
  },
  pactffi_enable_ansi_support: {
    name: "pactffi_enable_ansi_support",
    parameters: [],
    result: "void"
  },
  pactffi_log_message: {
    name: "pactffi_log_message",
    parameters: ["pointer", "pointer", "pointer"],
    result: "void"
  },
  pactffi_match_message: {
    name: "pactffi_match_message",
    parameters: ["pointer", "pointer"],
    result: "pointer"
  },
  pactffi_mismatches_get_iter: {
    name: "pactffi_mismatches_get_iter",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_mismatches_delete: {
    name: "pactffi_mismatches_delete",
    parameters: ["pointer"],
    result: "void"
  },
  pactffi_mismatches_iter_next: {
    name: "pactffi_mismatches_iter_next",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_mismatches_iter_delete: {
    name: "pactffi_mismatches_iter_delete",
    parameters: ["pointer"],
    result: "void"
  },
  pactffi_mismatch_to_json: {
    name: "pactffi_mismatch_to_json",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_mismatch_type: {
    name: "pactffi_mismatch_type",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_mismatch_summary: {
    name: "pactffi_mismatch_summary",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_mismatch_description: {
    name: "pactffi_mismatch_description",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_mismatch_ansi_description: {
    name: "pactffi_mismatch_ansi_description",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_get_error_message: {
    name: "pactffi_get_error_message",
    parameters: ["pointer", "i32"],
    result: "i32"
  },
  pactffi_log_to_stdout: {
    name: "pactffi_log_to_stdout",
    parameters: ["i32"],
    result: "i32"
  },
  pactffi_log_to_stderr: {
    name: "pactffi_log_to_stderr",
    parameters: ["i32"],
    result: "i32"
  },
  pactffi_log_to_file: {
    name: "pactffi_log_to_file",
    parameters: ["pointer", "i32"],
    result: "i32"
  },
  pactffi_log_to_buffer: {
    name: "pactffi_log_to_buffer",
    parameters: ["i32"],
    result: "i32"
  },
  pactffi_logger_init: {
    name: "pactffi_logger_init",
    parameters: [],
    result: "void"
  },
  pactffi_logger_attach_sink: {
    name: "pactffi_logger_attach_sink",
    parameters: ["pointer", "i32"],
    result: "i32"
  },
  pactffi_logger_apply: {
    name: "pactffi_logger_apply",
    parameters: [],
    result: "i32"
  },
  pactffi_fetch_log_buffer: {
    name: "pactffi_fetch_log_buffer",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_parse_pact_json: {
    name: "pactffi_parse_pact_json",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_pact_model_delete: {
    name: "pactffi_pact_model_delete",
    parameters: ["pointer"],
    result: "void"
  },
  pactffi_consumer_get_name: {
    name: "pactffi_consumer_get_name",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_message_new: {
    name: "pactffi_message_new",
    parameters: [],
    result: "pointer"
  },
  pactffi_message_new_from_json: {
    name: "pactffi_message_new_from_json",
    parameters: ["u32", "pointer", "i32"],
    result: "pointer"
  },
  pactffi_message_new_from_body: {
    name: "pactffi_message_new_from_body",
    parameters: ["pointer", "pointer"],
    result: "pointer"
  },
  pactffi_message_delete: {
    name: "pactffi_message_delete",
    parameters: ["pointer"],
    result: "void"
  },
  pactffi_message_get_contents: {
    name: "pactffi_message_get_contents",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_message_set_contents: {
    name: "pactffi_message_set_contents",
    parameters: ["pointer", "pointer", "pointer"],
    result: "void"
  },
  pactffi_message_get_contents_length: {
    name: "pactffi_message_get_contents_length",
    parameters: ["pointer"],
    result: "usize"
  },
  pactffi_message_get_contents_bin: {
    name: "pactffi_message_get_contents_bin",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_message_set_contents_bin: {
    name: "pactffi_message_set_contents_bin",
    parameters: ["pointer", "pointer", "usize", "pointer"],
    result: "void"
  },
  pactffi_message_get_description: {
    name: "pactffi_message_get_description",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_message_set_description: {
    name: "pactffi_message_set_description",
    parameters: ["pointer", "pointer"],
    result: "i32"
  },
  pactffi_message_get_provider_state: {
    name: "pactffi_message_get_provider_state",
    parameters: ["pointer", "u32"],
    result: "pointer"
  },
  pactffi_message_get_provider_state_iter: {
    name: "pactffi_message_get_provider_state_iter",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_provider_state_iter_next: {
    name: "pactffi_provider_state_iter_next",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_provider_state_iter_delete: {
    name: "pactffi_provider_state_iter_delete",
    parameters: ["pointer"],
    result: "void"
  },
  pactffi_message_find_metadata: {
    name: "pactffi_message_find_metadata",
    parameters: ["pointer", "pointer"],
    result: "pointer"
  },
  pactffi_message_insert_metadata: {
    name: "pactffi_message_insert_metadata",
    parameters: ["pointer", "pointer", "pointer"],
    result: "i32"
  },
  pactffi_message_get_metadata_iter: {
    name: "pactffi_message_get_metadata_iter",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_message_metadata_iter_next: {
    name: "pactffi_message_metadata_iter_next",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_message_metadata_iter_delete: {
    name: "pactffi_message_metadata_iter_delete",
    parameters: ["pointer"],
    result: "void"
  },
  pactffi_message_metadata_pair_delete: {
    name: "pactffi_message_metadata_pair_delete",
    parameters: ["pointer"],
    result: "void"
  },
  pactffi_message_pact_new_from_json: {
    name: "pactffi_message_pact_new_from_json",
    parameters: ["pointer", "pointer"],
    result: "pointer"
  },
  pactffi_message_pact_delete: {
    name: "pactffi_message_pact_delete",
    parameters: ["pointer"],
    result: "void"
  },
  pactffi_message_pact_get_consumer: {
    name: "pactffi_message_pact_get_consumer",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_message_pact_get_provider: {
    name: "pactffi_message_pact_get_provider",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_message_pact_get_message_iter: {
    name: "pactffi_message_pact_get_message_iter",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_message_pact_message_iter_next: {
    name: "pactffi_message_pact_message_iter_next",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_message_pact_message_iter_delete: {
    name: "pactffi_message_pact_message_iter_delete",
    parameters: ["pointer"],
    result: "void"
  },
  pactffi_message_pact_find_metadata: {
    name: "pactffi_message_pact_find_metadata",
    parameters: ["pointer", "pointer", "pointer"],
    result: "pointer"
  },
  pactffi_message_pact_get_metadata_iter: {
    name: "pactffi_message_pact_get_metadata_iter",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_message_pact_metadata_iter_next: {
    name: "pactffi_message_pact_metadata_iter_next",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_message_pact_metadata_iter_delete: {
    name: "pactffi_message_pact_metadata_iter_delete",
    parameters: ["pointer"],
    result: "void"
  },
  pactffi_message_pact_metadata_triple_delete: {
    name: "pactffi_message_pact_metadata_triple_delete",
    parameters: ["pointer"],
    result: "void"
  },
  pactffi_provider_get_name: {
    name: "pactffi_provider_get_name",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_provider_state_get_name: {
    name: "pactffi_provider_state_get_name",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_provider_state_get_param_iter: {
    name: "pactffi_provider_state_get_param_iter",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_provider_state_param_iter_next: {
    name: "pactffi_provider_state_param_iter_next",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_provider_state_delete: {
    name: "pactffi_provider_state_delete",
    parameters: ["pointer"],
    result: "void"
  },
  pactffi_provider_state_param_iter_delete: {
    name: "pactffi_provider_state_param_iter_delete",
    parameters: ["pointer"],
    result: "void"
  },
  pactffi_provider_state_param_pair_delete: {
    name: "pactffi_provider_state_param_pair_delete",
    parameters: ["pointer"],
    result: "void"
  },
  pactffi_pact_message_iter_delete: {
    name: "pactffi_pact_message_iter_delete",
    parameters: ["pointer"],
    result: "void"
  },
  pactffi_pact_message_iter_next: {
    name: "pactffi_pact_message_iter_next",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_pact_sync_message_iter_next: {
    name: "pactffi_pact_sync_message_iter_next",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_pact_sync_message_iter_delete: {
    name: "pactffi_pact_sync_message_iter_delete",
    parameters: ["pointer"],
    result: "void"
  },
  pactffi_pact_sync_http_iter_next: {
    name: "pactffi_pact_sync_http_iter_next",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_pact_sync_http_iter_delete: {
    name: "pactffi_pact_sync_http_iter_delete",
    parameters: ["pointer"],
    result: "void"
  },
  pactffi_sync_message_new: {
    name: "pactffi_sync_message_new",
    parameters: [],
    result: "pointer"
  },
  pactffi_sync_message_delete: {
    name: "pactffi_sync_message_delete",
    parameters: ["pointer"],
    result: "void"
  },
  pactffi_sync_message_get_request_contents: {
    name: "pactffi_sync_message_get_request_contents",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_sync_message_set_request_contents: {
    name: "pactffi_sync_message_set_request_contents",
    parameters: ["pointer", "pointer", "pointer"],
    result: "void"
  },
  pactffi_sync_message_get_request_contents_length: {
    name: "pactffi_sync_message_get_request_contents_length",
    parameters: ["pointer"],
    result: "usize"
  },
  pactffi_sync_message_get_request_contents_bin: {
    name: "pactffi_sync_message_get_request_contents_bin",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_sync_message_set_request_contents_bin: {
    name: "pactffi_sync_message_set_request_contents_bin",
    parameters: ["pointer", "pointer", "usize", "pointer"],
    result: "void"
  },
  pactffi_sync_message_get_number_responses: {
    name: "pactffi_sync_message_get_number_responses",
    parameters: ["pointer"],
    result: "usize"
  },
  pactffi_sync_message_get_response_contents: {
    name: "pactffi_sync_message_get_response_contents",
    parameters: ["pointer", "usize"],
    result: "pointer"
  },
  pactffi_sync_message_set_response_contents: {
    name: "pactffi_sync_message_set_response_contents",
    parameters: ["pointer", "usize", "pointer", "pointer"],
    result: "void"
  },
  pactffi_sync_message_get_response_contents_length: {
    name: "pactffi_sync_message_get_response_contents_length",
    parameters: ["pointer", "usize"],
    result: "usize"
  },
  pactffi_sync_message_get_response_contents_bin: {
    name: "pactffi_sync_message_get_response_contents_bin",
    parameters: ["pointer", "usize"],
    result: "pointer"
  },
  pactffi_sync_message_set_response_contents_bin: {
    name: "pactffi_sync_message_set_response_contents_bin",
    parameters: ["pointer", "usize", "pointer", "usize", "pointer"],
    result: "void"
  },
  pactffi_sync_message_get_description: {
    name: "pactffi_sync_message_get_description",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_sync_message_set_description: {
    name: "pactffi_sync_message_set_description",
    parameters: ["pointer", "pointer"],
    result: "i32"
  },
  pactffi_sync_message_get_provider_state: {
    name: "pactffi_sync_message_get_provider_state",
    parameters: ["pointer", "u32"],
    result: "pointer"
  },
  pactffi_sync_message_get_provider_state_iter: {
    name: "pactffi_sync_message_get_provider_state_iter",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_sync_http_new: {
    name: "pactffi_sync_http_new",
    parameters: [],
    result: "pointer"
  },
  pactffi_sync_http_delete: {
    name: "pactffi_sync_http_delete",
    parameters: ["pointer"],
    result: "void"
  },
  pactffi_sync_http_get_request_contents: {
    name: "pactffi_sync_http_get_request_contents",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_sync_http_set_request_contents: {
    name: "pactffi_sync_http_set_request_contents",
    parameters: ["pointer", "pointer", "pointer"],
    result: "void"
  },
  pactffi_sync_http_get_request_contents_length: {
    name: "pactffi_sync_http_get_request_contents_length",
    parameters: ["pointer"],
    result: "usize"
  },
  pactffi_sync_http_get_request_contents_bin: {
    name: "pactffi_sync_http_get_request_contents_bin",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_sync_http_set_request_contents_bin: {
    name: "pactffi_sync_http_set_request_contents_bin",
    parameters: ["pointer", "pointer", "usize", "pointer"],
    result: "void"
  },
  pactffi_sync_http_get_response_contents: {
    name: "pactffi_sync_http_get_response_contents",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_sync_http_set_response_contents: {
    name: "pactffi_sync_http_set_response_contents",
    parameters: ["pointer", "pointer", "pointer"],
    result: "void"
  },
  pactffi_sync_http_get_response_contents_length: {
    name: "pactffi_sync_http_get_response_contents_length",
    parameters: ["pointer"],
    result: "usize"
  },
  pactffi_sync_http_get_response_contents_bin: {
    name: "pactffi_sync_http_get_response_contents_bin",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_sync_http_set_response_contents_bin: {
    name: "pactffi_sync_http_set_response_contents_bin",
    parameters: ["pointer", "pointer", "usize", "pointer"],
    result: "void"
  },
  pactffi_sync_http_get_description: {
    name: "pactffi_sync_http_get_description",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_sync_http_set_description: {
    name: "pactffi_sync_http_set_description",
    parameters: ["pointer", "pointer"],
    result: "i32"
  },
  pactffi_sync_http_get_provider_state: {
    name: "pactffi_sync_http_get_provider_state",
    parameters: ["pointer", "u32"],
    result: "pointer"
  },
  pactffi_sync_http_get_provider_state_iter: {
    name: "pactffi_sync_http_get_provider_state_iter",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_parse_matcher_definition: {
    name: "pactffi_parse_matcher_definition",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_matcher_definition_error: {
    name: "pactffi_matcher_definition_error",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_matcher_definition_value: {
    name: "pactffi_matcher_definition_value",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_matcher_definition_delete: {
    name: "pactffi_matcher_definition_delete",
    parameters: ["pointer"],
    result: "void"
  },
  pactffi_matcher_definition_generator: {
    name: "pactffi_matcher_definition_generator",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_matcher_definition_value_type: {
    name: "pactffi_matcher_definition_value_type",
    parameters: ["pointer"],
    result: "i32"
  },
  pactffi_matching_rule_iter_delete: {
    name: "pactffi_matching_rule_iter_delete",
    parameters: ["pointer"],
    result: "void"
  },
  pactffi_matcher_definition_iter: {
    name: "pactffi_matcher_definition_iter",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_matching_rule_iter_next: {
    name: "pactffi_matching_rule_iter_next",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_matching_rule_to_json: {
    name: "pactffi_matching_rule_to_json",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_generator_to_json: {
    name: "pactffi_generator_to_json",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_generator_generate_string: {
    name: "pactffi_generator_generate_string",
    parameters: ["pointer", "pointer"],
    result: "pointer"
  },
  pactffi_generator_generate_integer: {
    name: "pactffi_generator_generate_integer",
    parameters: ["pointer", "pointer"],
    result: "u16"
  },
  pactffi_string_delete: {
    name: "pactffi_string_delete",
    parameters: ["pointer"],
    result: "void"
  },
  pactffi_create_mock_server: {
    name: "pactffi_create_mock_server",
    parameters: ["pointer", "pointer", "u8"],
    result: "i32"
  },
  pactffi_get_tls_ca_certificate: {
    name: "pactffi_get_tls_ca_certificate",
    parameters: [],
    result: "pointer"
  },
  pactffi_create_mock_server_for_pact: {
    name: "pactffi_create_mock_server_for_pact",
    parameters: ["u16", "pointer", "u8"],
    result: "i32"
  },
  pactffi_create_mock_server_for_transport: {
    name: "pactffi_create_mock_server_for_transport",
    parameters: ["u16", "pointer", "u16", "pointer", "pointer"],
    result: "i32"
  },
  pactffi_mock_server_matched: {
    name: "pactffi_mock_server_matched",
    parameters: ["i32"],
    result: "u8"
  },
  pactffi_mock_server_mismatches: {
    name: "pactffi_mock_server_mismatches",
    parameters: ["i32"],
    result: "pointer"
  },
  pactffi_cleanup_mock_server: {
    name: "pactffi_cleanup_mock_server",
    parameters: ["i32"],
    result: "u8"
  },
  pactffi_write_pact_file: {
    name: "pactffi_write_pact_file",
    parameters: ["i32", "pointer", "u8"],
    result: "i32"
  },
  pactffi_mock_server_logs: {
    name: "pactffi_mock_server_logs",
    parameters: ["i32"],
    result: "pointer"
  },
  pactffi_generate_datetime_string: {
    name: "pactffi_generate_datetime_string",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_check_regex: {
    name: "pactffi_check_regex",
    parameters: ["pointer", "pointer"],
    result: "u8"
  },
  pactffi_generate_regex_value: {
    name: "pactffi_generate_regex_value",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_free_string: {
    name: "pactffi_free_string",
    parameters: ["pointer"],
    result: "void"
  },
  pactffi_new_pact: {
    name: "pactffi_new_pact",
    parameters: ["pointer", "pointer"],
    result: "u16"
  },
  pactffi_new_interaction: {
    name: "pactffi_new_interaction",
    parameters: ["u16", "pointer"],
    result: "u32"
  },
  pactffi_new_message_interaction: {
    name: "pactffi_new_message_interaction",
    parameters: ["u16", "pointer"],
    result: "u32"
  },
  pactffi_new_sync_message_interaction: {
    name: "pactffi_new_sync_message_interaction",
    parameters: ["u16", "pointer"],
    result: "u32"
  },
  pactffi_upon_receiving: {
    name: "pactffi_upon_receiving",
    parameters: ["u32", "pointer"],
    result: "u8"
  },
  pactffi_given: {
    name: "pactffi_given",
    parameters: ["u32", "pointer"],
    result: "u8"
  },
  pactffi_interaction_test_name: {
    name: "pactffi_interaction_test_name",
    parameters: ["u32", "pointer"],
    result: "u32"
  },
  pactffi_given_with_param: {
    name: "pactffi_given_with_param",
    parameters: ["u32", "pointer", "pointer", "pointer"],
    result: "u8"
  },
  pactffi_with_request: {
    name: "pactffi_with_request",
    parameters: ["u32", "pointer", "pointer"],
    result: "u8"
  },
  pactffi_with_query_parameter: {
    name: "pactffi_with_query_parameter",
    parameters: ["u32", "pointer", "usize", "pointer"],
    result: "u8"
  },
  pactffi_with_query_parameter_v2: {
    name: "pactffi_with_query_parameter_v2",
    parameters: ["u32", "pointer", "usize", "pointer"],
    result: "u8"
  },
  pactffi_with_specification: {
    name: "pactffi_with_specification",
    parameters: ["u16", "i32"],
    result: "u8"
  },
  pactffi_with_pact_metadata: {
    name: "pactffi_with_pact_metadata",
    parameters: ["u16", "pointer", "pointer", "pointer"],
    result: "u8"
  },
  pactffi_with_header: {
    name: "pactffi_with_header",
    parameters: ["u32", "i32", "pointer", "usize", "pointer"],
    result: "u8"
  },
  pactffi_with_header_v2: {
    name: "pactffi_with_header_v2",
    parameters: ["u32", "i32", "pointer", "usize", "pointer"],
    result: "u8"
  },
  pactffi_response_status: {
    name: "pactffi_response_status",
    parameters: ["u32", "u16"],
    result: "u8"
  },
  pactffi_with_body: {
    name: "pactffi_with_body",
    parameters: ["u32", "i32", "pointer", "pointer"],
    result: "u8"
  },
  pactffi_with_binary_file: {
    name: "pactffi_with_binary_file",
    parameters: ["u32", "i32", "pointer", "pointer", "usize"],
    result: "u8"
  },
  pactffi_with_multipart_file: {
    name: "pactffi_with_multipart_file",
    parameters: ["u32", "i32", "pointer", "pointer", "pointer"],
    result: "pointer"
  },
  pactffi_pact_handle_get_message_iter: {
    name: "pactffi_pact_handle_get_message_iter",
    parameters: ["u16"],
    result: "pointer"
  },
  pactffi_pact_handle_get_sync_message_iter: {
    name: "pactffi_pact_handle_get_sync_message_iter",
    parameters: ["u16"],
    result: "pointer"
  },
  pactffi_pact_handle_get_sync_http_iter: {
    name: "pactffi_pact_handle_get_sync_http_iter",
    parameters: ["u16"],
    result: "pointer"
  },
  pactffi_new_message_pact: {
    name: "pactffi_new_message_pact",
    parameters: ["pointer", "pointer"],
    result: "u16"
  },
  pactffi_new_message: {
    name: "pactffi_new_message",
    parameters: ["u16", "pointer"],
    result: "u32"
  },
  pactffi_message_expects_to_receive: {
    name: "pactffi_message_expects_to_receive",
    parameters: ["u32", "pointer"],
    result: "void"
  },
  pactffi_message_given: {
    name: "pactffi_message_given",
    parameters: ["u32", "pointer"],
    result: "void"
  },
  pactffi_message_given_with_param: {
    name: "pactffi_message_given_with_param",
    parameters: ["u32", "pointer", "pointer", "pointer"],
    result: "void"
  },
  pactffi_message_with_contents: {
    name: "pactffi_message_with_contents",
    parameters: ["u32", "pointer", "pointer", "usize"],
    result: "void"
  },
  pactffi_message_with_metadata: {
    name: "pactffi_message_with_metadata",
    parameters: ["u32", "pointer", "pointer"],
    result: "void"
  },
  pactffi_message_reify: {
    name: "pactffi_message_reify",
    parameters: ["u32"],
    result: "pointer"
  },
  pactffi_write_message_pact_file: {
    name: "pactffi_write_message_pact_file",
    parameters: ["u16", "pointer", "u8"],
    result: "i32"
  },
  pactffi_with_message_pact_metadata: {
    name: "pactffi_with_message_pact_metadata",
    parameters: ["u16", "pointer", "pointer", "pointer"],
    result: "void"
  },
  pactffi_pact_handle_write_file: {
    name: "pactffi_pact_handle_write_file",
    parameters: ["u16", "pointer", "u8"],
    result: "i32"
  },
  pactffi_new_async_message: {
    name: "pactffi_new_async_message",
    parameters: ["u16", "pointer"],
    result: "u32"
  },
  pactffi_free_pact_handle: {
    name: "pactffi_free_pact_handle",
    parameters: ["u16"],
    result: "u32"
  },
  pactffi_free_message_pact_handle: {
    name: "pactffi_free_message_pact_handle",
    parameters: ["u16"],
    result: "u32"
  },
  pactffi_verify: {
    name: "pactffi_verify",
    parameters: ["pointer"],
    result: "i32"
  },
  pactffi_verifier_new: {
    name: "pactffi_verifier_new",
    parameters: [],
    result: "pointer"
  },
  pactffi_verifier_new_for_application: {
    name: "pactffi_verifier_new_for_application",
    parameters: ["pointer", "pointer"],
    result: "pointer"
  },
  pactffi_verifier_shutdown: {
    name: "pactffi_verifier_shutdown",
    parameters: ["pointer"],
    result: "void"
  },
  pactffi_verifier_set_provider_info: {
    name: "pactffi_verifier_set_provider_info",
    parameters: ["pointer", "pointer", "pointer", "pointer", "u16", "pointer"],
    result: "void"
  },
  pactffi_verifier_add_provider_transport: {
    name: "pactffi_verifier_add_provider_transport",
    parameters: ["pointer", "pointer", "u16", "pointer", "pointer"],
    result: "void"
  },
  pactffi_verifier_set_filter_info: {
    name: "pactffi_verifier_set_filter_info",
    parameters: ["pointer", "pointer", "pointer", "u8"],
    result: "void"
  },
  pactffi_verifier_set_provider_state: {
    name: "pactffi_verifier_set_provider_state",
    parameters: ["pointer", "pointer", "u8", "u8"],
    result: "void"
  },
  pactffi_verifier_set_verification_options: {
    name: "pactffi_verifier_set_verification_options",
    parameters: ["pointer", "u8", "u64"],
    result: "i32"
  },
  pactffi_verifier_set_coloured_output: {
    name: "pactffi_verifier_set_coloured_output",
    parameters: ["pointer", "u8"],
    result: "i32"
  },
  pactffi_verifier_set_no_pacts_is_error: {
    name: "pactffi_verifier_set_no_pacts_is_error",
    parameters: ["pointer", "u8"],
    result: "i32"
  },
  pactffi_verifier_set_publish_options: {
    name: "pactffi_verifier_set_publish_options",
    parameters: ["pointer", "pointer", "pointer", "pointer", "u16", "pointer"],
    result: "i32"
  },
  pactffi_verifier_set_consumer_filters: {
    name: "pactffi_verifier_set_consumer_filters",
    parameters: ["pointer", "pointer", "u16"],
    result: "void"
  },
  pactffi_verifier_add_custom_header: {
    name: "pactffi_verifier_add_custom_header",
    parameters: ["pointer", "pointer", "pointer"],
    result: "void"
  },
  pactffi_verifier_add_file_source: {
    name: "pactffi_verifier_add_file_source",
    parameters: ["pointer", "pointer"],
    result: "void"
  },
  pactffi_verifier_add_directory_source: {
    name: "pactffi_verifier_add_directory_source",
    parameters: ["pointer", "pointer"],
    result: "void"
  },
  pactffi_verifier_url_source: {
    name: "pactffi_verifier_url_source",
    parameters: ["pointer", "pointer", "pointer", "pointer", "pointer"],
    result: "void"
  },
  pactffi_verifier_broker_source: {
    name: "pactffi_verifier_broker_source",
    parameters: ["pointer", "pointer", "pointer", "pointer", "pointer"],
    result: "void"
  },
  pactffi_verifier_broker_source_with_selectors: {
    name: "pactffi_verifier_broker_source_with_selectors",
    parameters: ["pointer", "pointer", "pointer", "pointer", "pointer", "u8", "pointer", "pointer", "u16", "pointer", "pointer", "u16", "pointer", "u16"],
    result: "void"
  },
  pactffi_verifier_execute: {
    name: "pactffi_verifier_execute",
    parameters: ["pointer"],
    result: "i32"
  },
  pactffi_verifier_cli_args: {
    name: "pactffi_verifier_cli_args",
    parameters: [],
    result: "pointer"
  },
  pactffi_verifier_logs: {
    name: "pactffi_verifier_logs",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_verifier_logs_for_provider: {
    name: "pactffi_verifier_logs_for_provider",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_verifier_output: {
    name: "pactffi_verifier_output",
    parameters: ["pointer", "u8"],
    result: "pointer"
  },
  pactffi_verifier_json: {
    name: "pactffi_verifier_json",
    parameters: ["pointer"],
    result: "pointer"
  },
  pactffi_using_plugin: {
    name: "pactffi_using_plugin",
    parameters: ["u16", "pointer", "pointer"],
    result: "u32"
  },
  pactffi_cleanup_plugins: {
    name: "pactffi_cleanup_plugins",
    parameters: ["u16"],
    result: "void"
  },
  pactffi_interaction_contents: {
    name: "pactffi_interaction_contents",
    parameters: ["u32", "i32", "pointer", "pointer"],
    result: "u32"
  }
} as const;
