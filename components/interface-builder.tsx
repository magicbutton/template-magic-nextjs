"use client";
import React, { useEffect, useState } from "react";
import { jsonInputForTargetLanguage } from "quicktype-core";
import { buildInterface } from "../lib/buildInterface";

export default function InterfaceBuilder(props: {
  schema: string;
  typeName: string;
}) {
  const { schema, typeName } = props;
  const [code, setcode] = useState("");
  useEffect(() => {
    const load = async () => {
      const code = await buildInterface(typeName, schema);
      setcode(code);
    };
    if (!schema) return;
    if (!typeName) return;
    load();
  }, [schema, typeName]);

  return (
    <div>
      <pre>{code}</pre>
    </div>
  );
}
