import { z } from "zod";

// Example JSON structure returned from the SQL query
const tableStructure = [
  {
    column_name: "id",
    data_type: "integer",
    is_nullable: "NO",
    column_default: null,
  },
  {
    column_name: "name",
    data_type: "varchar",
    is_nullable: "YES",
    column_default: null,
  },
  {
    column_name: "age",
    data_type: "integer",
    is_nullable: "YES",
    column_default: null,
  },
  // Add more columns as per your table structure
];

// Function to map PostgreSQL data types to Zod types
const mapToZodType = (column: any) => {
  let zodType;

  switch (column.data_type) {
    case "integer":
      zodType = z.number();
      break;
    case "bigint":
      zodType = z.bigint();
      break;
    case "numeric":
    case "decimal":
      zodType = z.string(); // or z.union([z.string(), z.number()])
      break;
    case "boolean":
      zodType = z.boolean();
      break;
    case "text":
    case "varchar":
    case "char":
    case "uuid":
    case "date":
    case "timestamp":
    case "json":
    case "jsonb":
      zodType = z.string();
      break;
    case "bytea":
      zodType = z.instanceof(Buffer);
      break;
    // Handle arrays
    case "ARRAY":
      zodType = z.array(z.any()); // You might want to adjust the inner type based on actual array type
      break;
    default:
      zodType = z.any();
  }

  // Handle nullability
  if (column.is_nullable === "YES") {
    zodType = zodType.nullable();
  }

  return zodType;
};

// Build the Zod schema
/*
// Create the Zod schema
const zodSchema = buildZodSchema(tableStructure);

// Now you can use the generated Zod schema
console.log(zodSchema.shape);

*/

export default function buildZodSchema(tableStructure: any[]) {
  const schema: any = {};

  tableStructure.forEach((column) => {
    schema[column.column_name] = mapToZodType(column);
  });

  return z.object(schema);
}
