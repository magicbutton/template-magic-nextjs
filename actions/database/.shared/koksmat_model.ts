/**
 * This function is generated by Magic Button Studio v0.1
 * Feel free to modify it as needed
 *
 */

import { z, ZodObject } from "zod";

// The schema for the CreateKoksmatModel procedure
export const _schema = z
  .object({
    id: z.string(),
    name: z.string().optional(),
    description: z.string().optional(),
    data: z.record(z.any()).optional(),
  })
  .describe("Create operation");

//  TypeScript type based on the schema
export type Model = z.infer<typeof _schema>;
