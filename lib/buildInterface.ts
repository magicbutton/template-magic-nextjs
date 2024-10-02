"use client";
import {
  JSONSchemaInput,
  FetchingJSONSchemaStore,
  InputData,
  quicktype,
} from "quicktype-core";

export async function buildInterface(typeName: string, schema: string) {
  if (!schema) {
    return "";
  }
  const schemaInput = new JSONSchemaInput(new FetchingJSONSchemaStore());
  await schemaInput.addSource({ name: typeName, schema });
  const inputData = new InputData();
  inputData.addInput(schemaInput);
  const { lines: tsLines } = await quicktype({
    inputData,
    lang: "typescript",
    rendererOptions: {
      "just-types": true,
    },
  });
  return tsLines.join("\n");
}
