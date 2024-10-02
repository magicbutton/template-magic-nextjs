"use client";
import { execute } from "./execute2";
/**
 * Create operation
 */
export interface CreateBiteProps {
  body?: { [key: string]: any };
  description?: string;
  name?: string;
  /**
   * Search Index is used for concatenating all searchable fields in a single field making in
   * easier to search
   */
  searchindex?: string;
  tenant?: string;
  [property: string]: any;
}

export async function shareCreateBite(
  token: string,
  name: string,
  description: string,
  body: any
) {
  const request: CreateBiteProps = {
    name: name,
    description: description,
    body,
    tenant: "",
    searchindex: "name:" + name,
  };
  return execute(token, "share", "magic-mix.app", "create_bite", request);
}
