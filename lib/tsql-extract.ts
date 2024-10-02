/**
 * 
 * @param input 
 * @returns 
 * 
 * // Test the function with the provided input

const inputString = `CREATE OR REPLACE PROCEDURE proc.create_database(IN p_actor_name character varying, IN p_params jsonb, OUT p_id integer)
LANGUAGE plpgsql
AS $procedure$
DECLARE
     v_rows_updated INTEGER;
v_tenant VARCHAR COLLATE pg_catalog."default" ;
  v_searchindex VARCHAR COLLATE pg_catalog."default" ;
  v_name VARCHAR COLLATE pg_catalog."default" ;
  v_description VARCHAR COLLATE pg_catalog."default";
  v_connection_id INTEGER;
  v_server VARCHAR;
  v_environment_id INTEGER;
      v_audit_id integer;  -- Variable to hold the OUT parameter value
  p_auditlog_params jsonb;

BEGIN
  v_tenant := p_params->>'tenant';
  v_searchindex := p_params->>'searchindex';
  v_name := p_params->>'name';
  v_description := p_params->>'description';
  v_connection_id := p_params->>'connection_id';
  v_server := p_params->>'server';
  v_environment_id := p_params->>'environment_id';
       

  INSERT INTO public.database (
  id,
  created_at,
  updated_at,
      created_by, 
      updated_by, 
      tenant,
      searchindex,
      name,
      description,
      connection_id,
      server,
      environment_id
  )
  VALUES (
      DEFAULT,
      DEFAULT,
      DEFAULT,
      p_actor_name, 
      p_actor_name,  -- Use the same value for updated_by
      v_tenant,
      v_searchindex,
      v_name,
      v_description,
      v_connection_id,
      v_server,
      v_environment_id
  )
  RETURNING id INTO p_id;

     p_auditlog_params := jsonb_build_object(
      'tenant', '',
      'searchindex', '',
      'name', 'create_database',
      'status', 'success',
      'description', '',
      'action', 'create_database',
      'entity', 'database',
      'entityid', -1,
      'actor', p_actor_name,
      'metadata', p_params
  );
###MAGICAPP-START##
{
  "version": "v0.0.1",
  "action": "create",
  "input" : {
"type": "object",
"properties": {

  "tenant": { "type": "string" },
  "searchindex": { "type": "string" },
  "name": { "type": "string" },
  "description": { "type": "string" },
  "connection_id": { "type": "number" },
  "server": { "type": "string" },
  "environment_id": { "type": "number" }
}
  }
}

##MAGICAPP-END##

  -- Call the create_auditlog procedure
  CALL proc.create_auditlog(p_actor_name, p_auditlog_params, v_audit_id);
END;
$procedure$`;

console.log(extractAndParseJson(inputString));
 */
export function extractAndParseJson(input: string): object | null {
  const startMarker = "###MAGICAPP-START##";
  const endMarker = "##MAGICAPP-END##";

  // Extract the JSON string between the markers
  const startIndex = input.indexOf(startMarker);
  const endIndex = input.indexOf(endMarker);

  if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
    // Markers not found or in the wrong order
    return null;
  }

  const jsonString = input
    .substring(startIndex + startMarker.length, endIndex)
    .trim();

  // Find the first and last curly braces to isolate the JSON part
  const firstBrace = jsonString.indexOf("{");
  const lastBrace = jsonString.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
    // No valid JSON found
    return null;
  }

  const jsonContent = jsonString.substring(firstBrace, lastBrace + 1);

  try {
    return JSON.parse(jsonContent);
  } catch (error) {
    // JSON parsing failed
    console.error("Failed to parse JSON:", error);
    return null;
  }
}
