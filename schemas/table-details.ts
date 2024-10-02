export interface Root {
  Result: TableDetail[];
}

export interface TableDetail {
  table_metadata: TableMetadata;
}

export interface TableMetadata {
  table_name: string;
  row_count: number;
  disk_size: string;
  columns: Column[];
  referencing_functions: ReferencingFunction[];
}

export interface Column {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default?: string;
}

export interface ReferencingFunction {
  function_name: string;
  function_definition: string;
}
export const tableDetailsSql = (table: string) => `
WITH table_info AS (
    -- Query to get number of records in the table
    SELECT
        (SELECT reltuples::bigint AS row_count
         FROM pg_class
         WHERE relname = '${table}' AND relkind = 'r') AS row_count,
    -- Query to get disk size of the table
    (SELECT pg_size_pretty(pg_total_relation_size('${table}'))) AS disk_size,
    -- Query to get column definitions
    (SELECT json_agg(cols)
     FROM (
         SELECT column_name, data_type, is_nullable, column_default
         FROM information_schema.columns
         WHERE table_name = '${table}'
     ) cols) AS columns,
    -- Query to get functions and stored procedures referencing the table
    (SELECT json_agg(procedures)
     FROM (
         SELECT p.proname AS function_name,
                pg_catalog.pg_get_functiondef(p.oid) AS function_definition
         FROM pg_catalog.pg_proc p
         JOIN pg_catalog.pg_depend d ON d.objid = p.oid
         JOIN pg_catalog.pg_rewrite r ON r.oid = d.refobjid
         JOIN pg_catalog.pg_class c ON c.oid = r.ev_class
         WHERE d.refobjid = '${table}'::regclass
           AND d.classid = 'pg_class'::regclass
           AND d.refclassid = 'pg_class'::regclass
           AND r.ev_type = '1' -- NORMAL type of dependency
         UNION
         SELECT p.proname AS function_name,
                pg_catalog.pg_get_functiondef(p.oid) AS function_definition
         FROM pg_catalog.pg_proc p
         WHERE p.prosrc ~ '${table}' -- Check for direct reference in function body
     ) procedures) AS referencing_functions
)

-- Constructing the final JSON object
SELECT json_build_object(
    'table_name', '${table}',
    'row_count', (SELECT row_count FROM table_info),
    'disk_size', (SELECT disk_size FROM table_info),
    'columns', (SELECT columns FROM table_info),
    'referencing_functions', (SELECT referencing_functions FROM table_info)
) AS table_metadata

    `;
