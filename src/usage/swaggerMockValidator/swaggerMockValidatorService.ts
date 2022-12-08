import lib from "npm:@pactflow/swagger-mock-validator";
import mergeAllOf from "npm:json-schema-merge-allof";
import $RefParser from "npm:@apidevtools/json-schema-ref-parser";

async function mergeAllOfOas(inputContent: string) {
  async function preprocessOpenapiSpec(apiSpec: $RefParser.JSONSchema) {
    const schema = await $RefParser.dereference(apiSpec);

    function mergeAllOfRecursively(
      candidate: any,
      parent: { [x: string]: any },
      k: string
    ) {
      if (typeof candidate !== "object") return;

      if (candidate && candidate?.allOf) {
        parent[k] = mergeAllOf(candidate, {
          ignoreAdditionalProperties: true,
          deep: true
        });
      } else {
        for (const [key, value] of Object.entries(candidate)) {
          mergeAllOfRecursively(value, candidate, key);
        }
      }
    }

    for (const [key, value] of Object.entries(schema)) {
      mergeAllOfRecursively(value, apiSpec, key);
    }

    return schema;
  }

  const preprocessedApiSpec = await preprocessOpenapiSpec(
    JSON.parse(inputContent)
  );
  return JSON.stringify(preprocessedApiSpec);
}

export const swaggerMockValidatorService = async ({
  oas,
  pact
}: {
  oas: any;
  pact: any;
}) => {
  const pactData = {
    content: JSON.stringify(pact.content),
    pathOrUrl: "content",
    format: "auto-detect"
  };
  const specData = {
    content: JSON.stringify(oas.content),
    pathOrUrl: "content",
    format: "auto-detect"
  };

  // Merge allOfs
  specData.content = await mergeAllOfOas(specData.content);

  // Perform BDCT validation
  const validationResult = await lib.validate({
    mock: pactData,
    spec: specData
  });
  const parsedMock = JSON.parse(pactData.content);
  return JSON.stringify({
    ...validationResult,
    consumer: parsedMock.consumer.name,
    provider: parsedMock.provider.name,
    specContentPathOrUrl: specData.pathOrUrl,
    mockContentPathOrUrl: pactData.pathOrUrl
  });
};
