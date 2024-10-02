"use client";
import { useSQLSelect3 } from "@/app/koksmat/usesqlselect3";
import { ProcedureInfo } from "@/components/stored-procedure-page";
import { generateDatabaseCallSourceCode } from "@/lib/generatevalidationfunction";
import { extractAndParseJson } from "@/lib/tsql-extract";
import jsonSchemaToZod from "json-schema-to-zod";
import React, { useEffect, useState } from "react";

export interface Result {
  procedure_info: ProcedureInfo;
}
export default function useProcedureInfo(props: {
  params: {
    procedure: string;
    database: string;
  };
}) {
  const { procedure, database } = props.params;
  const [procedureInfo, setprocedureInfo] = useState<ProcedureInfo>();
  const [jsonSchema, setjsonSchema] = useState<any | null>();
  const [zodSchema, setzodSchema] = useState<any | null>();

  const [functionCode, setfunctionCode] = useState("");
  const [importCode, setimportCode] = useState("");
  const [callCode, setcallCode] = useState("");
  const sql = `
  WITH proc_source AS (
      SELECT
          p.oid AS procedure_oid,
          p.proname AS procedure_name,
          l.lanname AS language,
          pg_get_functiondef(p.oid) AS source_code,
          d.description AS comment
      FROM
          pg_proc p
      JOIN
          pg_language l ON p.prolang = l.oid
      LEFT JOIN
          pg_description d ON p.oid = d.objoid
      WHERE
          p.proname = '${procedure}'
  ),
  func_deps AS (
      SELECT
          d.refobjid AS table_oid,
          d.objid AS procedure_oid,
          c2.relname AS table_name
      FROM
          pg_depend d
      JOIN
          pg_proc p ON d.objid = p.oid
      JOIN
          pg_class c2 ON d.refobjid = c2.oid
      WHERE
          p.proname = '${procedure}'
          AND c2.relkind = 'r'
  )
  SELECT json_build_object(
      'procedure_name', ps.procedure_name,
      'language', ps.language,
      'source_code', ps.source_code,
      'comment', ps.comment,
      'dependencies', COALESCE(json_agg(fd.table_name) FILTER (WHERE fd.table_name IS NOT NULL), '[]'::json)
  ) AS procedure_info
  FROM
      proc_source ps
  LEFT JOIN
      func_deps fd ON ps.procedure_oid = fd.procedure_oid
  GROUP BY
      ps.procedure_name, ps.language, ps.source_code, ps.comment
  
    `;
  const query = useSQLSelect3<Result>(database, sql);

  useEffect(() => {
    if (query && query.dataset && query.dataset.length > 0) {
      setprocedureInfo(query.dataset[0].procedure_info);
    }
  }, [query.dataset]);

  useEffect(() => {
    if (!procedureInfo) {
      return;
    }

    const metadata = extractAndParseJson(procedureInfo.source_code);
    if (metadata) {
      try {
        setjsonSchema(metadata);
        const txtcode = jsonSchemaToZod(metadata);

        // const code = prettier.format(txtcode, {
        //   parser: "typescript",
        //   plugins: [parserTypeScript],
        // });
        //setzodSchema(JSON.parse(zodSchema));
        setzodSchema(txtcode);
        const code = generateDatabaseCallSourceCode(
          database,
          procedure,
          metadata,
          txtcode
        );
        setfunctionCode(code.source);
        setimportCode(code.import);
        setcallCode(code.call);
      } catch (error) {
        setzodSchema(error);
      }
    }
  }, [procedureInfo]);
  return {
    functionCode,
    procedureInfo,
    zodSchema,
    importCode,
    callCode,
    jsonSchema,
  };
}
