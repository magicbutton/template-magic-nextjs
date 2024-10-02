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
import { ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
export default function TerminalEditor(props: {
  code: string;
  language: string;
  onCodeChange: (code: string) => void;
  onEnter: () => void;
}) {
  const [editorText, setEditorText] = useState("");
  const { onEnter, language, onCodeChange, code } = props;
  useEffect(() => {
    setEditorText(code);
  }, [code]);

  const handleEditorDidMount = (
    editor: monacoEditor.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editor.addCommand(monaco.KeyCode.Enter, () => {
      onEnter();
    });
  };
  return (
    <MonacoEditor
      width={"100%"}
      defaultValue=""
      height="100%"
      language={language}
      onChange={(value) => {
        onCodeChange(value!);
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
