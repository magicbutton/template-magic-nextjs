import { z, ZodSchema } from "zod";

// Function to convert JSON schema to Zod schema
/**
   * 
   * @param jsonSchema 
   * @returns ZodSchema<any>
   *
   * example usage:
   
  const schemaJson = {
    "type": "object",
    "properties": {
      "name": { "type": "string" },
      "age": { "type": "number" },
      "email": { "type": "string", "format": "email" },
      "isActive": { "type": "boolean" }
    },
    "required": ["name", "age", "email"]
  }
  // Convert the JSON schema to Zod schema
  const zodSchema = jsonSchemaToZod(schemaJson);

  // Example usage
  const exampleData = {
    name: "John Doe",
    age: 30,
    email: "john.doe@example.com",
    isActive: true,
  };

  try {
    zodSchema.parse(exampleData);
    console.log("Validation succeeded");
  } catch (e) {
    console.error("Validation failed:", e.errors);
  }

   */
export const jsonSchemaToZod = (jsonSchema: any): ZodSchema<any> => {
  if (jsonSchema.type === "object") {
    const shape: { [key: string]: ZodSchema<any> } = {};
    for (const key in jsonSchema.properties) {
      shape[key] = jsonSchemaToZod(jsonSchema.properties[key]);
    }
    return z.object(shape).strict();
  }

  switch (jsonSchema.type) {
    case "string":
      let stringSchema = z.string();
      if (jsonSchema.format === "email") {
        stringSchema = stringSchema.email();
      }
      return stringSchema;
    case "number":
      return z.number();
    case "boolean":
      return z.boolean();
    default:
      throw new Error(`Unsupported type: ${jsonSchema.type}`);
  }
};
