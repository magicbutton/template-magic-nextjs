"use client";

import MonacoEditor, { Monaco } from "@monaco-editor/react";
import { useEffect, useState } from "react";
type Command = {
  timestamp: number;
  cmd: string;
  command: string;
  preview: string;
  isPreviewJson: boolean;

  error_message: string;
};
import * as monacoEditor from "monaco-editor"; // Importing the types
import { set } from "date-fns";
export default function JSONEditor(props: {
  json: string;
  schema: object;
  onJsonChange: (json: string) => void;
  onEnter: () => void;
}) {
  const [editorText, setEditorText] = useState("");
  const { onEnter, onJsonChange, json, schema } = props;
  const [customSchema, setCustomSchema] = useState(schema);
  useEffect(() => {
    setEditorText(json);
  }, [json]);
  const [monaco, setmonaco] = useState<Monaco>();
  useEffect(() => {
    if (!monaco) {
      return;
    }
    if (!schema) {
      return;
    }

    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [
        {
          uri: "http://myserver/foo-schema.json",
          fileMatch: ["*"],
          schema: props.schema,
        },
      ],
    });
  }, [monaco, schema]);

  const handleEditorDidMount = (
    editor: monacoEditor.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    // editor.addCommand(monaco.KeyCode.Enter, () => {
    //   onEnter();
    // });
    // JSON schema configuration
    setmonaco(monaco);
  };

  return (
    <MonacoEditor
      width={"100%"}
      defaultValue=""
      height="100%"
      language="json"
      onChange={(value) => {
        onJsonChange(value!);
      }}
      onMount={handleEditorDidMount}
      value={editorText}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
      }}
    />
  );
}
