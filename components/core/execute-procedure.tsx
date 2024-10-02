"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MonacoEditor, { Monaco, useMonaco } from "@monaco-editor/react";
import { useContext, useEffect, useMemo, useState } from "react";
import { install, fake } from "zod-schema-faker";
type Command = {
  timestamp: number;
  cmd: string;
  command: string;
  preview: string;
  isPreviewJson: boolean;

  error_message: string;
};
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import WithClipboardCopy from "./with-clipboardcopy";
import TerminalEditor from "./terminal-editor";
import JSONEditor from "./json-editor";
import { z } from "zod";
import { execute } from "@/actions/client";
import { MagicboxContext } from "@/app/koksmat/magicbox-context";
import jsonSchemaToZod from "json-schema-to-zod";

class CommandManager {
  private commands: Command[] = [];

  // Method to add a command
  addCommand(
    timestamp: number,
    cmd: string,
    command: string,
    preview: string,
    isPreviewJson: boolean,

    error_message: string = ""
  ): void {
    if (!this.commands) {
      this.commands = [];
    }
    // Check if the command already exists
    const existingCommand = this.commands.find(
      (c) =>
        c.cmd === cmd &&
        c.command === command &&
        c.preview === preview &&
        c.error_message === error_message
    );

    if (!existingCommand) {
      this.commands.push({
        timestamp,
        cmd,
        command,
        preview,
        isPreviewJson,

        error_message,
      });
    } else {
      existingCommand.timestamp = timestamp;
      console.log("Command already exists");
    }
  }

  // Method to get all commands
  getCommands(): Command[] {
    return this.commands ?? [];
  }

  // Method to marshal (convert the commands array to a JSON string)
  unmarshal(): string {
    return JSON.stringify(this.commands);
  }

  // Method to unmarshal (populate the commands array from a JSON string)
  marshal(jsonString: string): boolean {
    try {
      const commands: Command[] = JSON.parse(jsonString);
      this.commands = commands;
      return true;
    } catch (error) {
      this.commands = [];
      console.error("Invalid JSON string");
      return false;
    }
  }
}
interface JsonSchema {
  type: string;
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema | JsonSchema[];
  enum?: any[];
  [key: string]: any;
}

function generateSample(schema: JsonSchema): any {
  switch (schema.type) {
    case "string":
      return schema.enum ? schema.enum[0] : "sample string";
    case "number":
      return schema.enum ? schema.enum[0] : 42;
    case "integer":
      return schema.enum ? schema.enum[0] : 42;
    case "boolean":
      return schema.enum ? schema.enum[0] : true;
    case "array":
      if (Array.isArray(schema.items)) {
        return schema.items.map((item) => generateSample(item));
      }
      return [generateSample(schema.items as JsonSchema)];
    case "object":
      const obj: Record<string, any> = {};
      if (schema.properties) {
        for (const key in schema.properties) {
          obj[key] = generateSample(schema.properties[key]);
        }
      }
      return obj;
    default:
      return null;
  }
}

// // Example usage:
// const exampleSchema: JsonSchema = {
//   type: 'object',
//   properties: {
//     name: { type: 'string' },
//     age: { type: 'integer' },
//     isActive: { type: 'boolean' },
//     tags: { type: 'array', items: { type: 'string' } },
//   }
// };

// const sampleData = generateSample(exampleSchema);
// console.log(sampleData);

export default function ExecuteProcedure(props: {
  databaseName: string;
  procedureName: string;
  jsonSchema: JsonSchema;
  zodSchema: string;
}) {
  const magicbox = useContext(MagicboxContext);
  const { databaseName, procedureName, jsonSchema, zodSchema } = props;
  const [input, setinput] = useState("");
  const [output, setoutput] = useState<any>();
  const [isJSON, setisJSON] = useState(false);
  const [isRunning, setisRunning] = useState(false);
  const commandHistory = useMemo(() => {
    const commands = localStorage.getItem("procedure_calls");
    const cmd_manager = new CommandManager();

    cmd_manager.marshal(commands!);
    return cmd_manager;
  }, []);

  useEffect(() => {
    const load = async () => {
      debugger;

      const fake = generateSample(jsonSchema);
      const input = JSON.stringify(fake, null, 2);
      setinput(input);
    };
    if (input) {
      return;
    }
    if (!jsonSchema) {
      return;
    }
    load();
  }, [jsonSchema]);

  function parseCommand(command: string): { command: string; args: string[] } {
    const args: string[] = [];
    let currentArg = "";
    let inSingleQuote = false;

    for (let i = 0; i < command.length; i++) {
      const char = command[i];

      if (char === "'") {
        inSingleQuote = !inSingleQuote;
      } else if (char === " " && !inSingleQuote) {
        if (currentArg) {
          args.push(currentArg);
          currentArg = "";
        }
      } else {
        currentArg += char;
      }
    }

    if (currentArg) {
      args.push(currentArg);
    }

    const cmd = args.shift() ?? "";
    return { command: cmd, args };
  }

  const run = async () => {
    setisRunning(true);

    // The schema for the CreateCountry procedure

    const result = await execute(
      magicbox.authtoken, // <-- this is the authentication token containing the user's credentials - the upn will be used as "actor" name
      databaseName, // <-- this is a reference to a record in the connections table in the mix database
      "magic-mix.app", // <-- this is the service name processing the request
      procedureName, // <-- this is the name of the procedure in the database pointed to by the connection
      JSON.parse(input) // <-- this is the data to be sent to the procedure
    );
    setisRunning(false);

    setoutput(JSON.stringify(result.data, null, 2));
    return result.data;
  };
  // const execute = async () => {
  //   const { command, args } = parseCommand(cmd);
  //   const body = JSON.stringify({
  //     sessionid: __dirname + "/" + __filename,
  //     action: "",
  //     command,
  //     args,
  //     cwd,
  //   });
  //   const result = await fetch("/api/autopilot/exec", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body,
  //   });
  //   setisRunning(true);
  //   const j = await result.json();
  //   setisRunning(false);

  //   if (j.body) {
  //     try {
  //       const json = JSON.parse(j.body);
  //       setoutput(json);
  //       setisJSON(true);
  //       commandHistory.addCommand(
  //         Date.now(),
  //         cmd,
  //         command,
  //         JSON.stringify(json, null, 2),
  //         true,

  //         j.error_message
  //       );
  //     } catch (error) {
  //       setisJSON(false);

  //       const ansiUp = new AnsiUp();
  //       const htmlOutput = ansiUp.ansi_to_html(j.body);
  //       setoutput(j.body);
  //       commandHistory.addCommand(
  //         Date.now(),
  //         cmd,
  //         command,
  //         j.body,
  //         false,

  //         j.error_message
  //       );
  //     }
  //     localStorage.setItem("commands", commandHistory.unmarshal());
  //   }
  //   console.log(j);
  //   console.log(result);
  // };

  return (
    <div className="flex  w-[calc(100vw-200px)] bg-background  h-[calc(100vh-200px)]">
      <ResizablePanelGroup direction="horizontal" className="min-h-full">
        <ResizablePanel
          defaultSize={20}
          className="overflow-auto max-h-full min-h-full"
        >
          <div className="grid gap-2 p-4">
            {commandHistory
              .getCommands()
              .sort((a, b) => b.timestamp - a.timestamp)

              .map((command, index) => (
                <div
                  onClick={() => {
                    //setcmd(command.cmd);
                    setoutput(command.preview);
                  }}
                  className="flex items-center gap-2 rounded-md bg-muted/30 p-2 text-sm cursor-pointer"
                  key={index}
                >
                  <TerminalIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate text-muted-foreground">
                    {command.cmd}
                  </span>
                  {command.error_message && (
                    <span className="text-muted-foreground text-red-500">
                      {command.error_message}
                    </span>
                  )}
                </div>
              ))}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel className="min-h-full">
          <ResizablePanelGroup direction="vertical" className="min-h-full">
            <ResizablePanel defaultSize={70}>
              {/* <div className="flex h-16 items-center gap-4 border-b bg-background px-4">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <TerminalIcon className="h-4 w-4" />
                  <span className="sr-only">Toggle history</span>
                </Button>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CircleDotIcon className="h-4 w-4 text-primary" />
                  <span className="text-primary">Terminal</span>
                </div>
              </div> */}

              <div className="ml-4">Parameters to use</div>
              <div className="flex items-center gap-2 border-t bg-background px-4 py-2 h-full max-w-[calc(80vw-100px)]">
                <JSONEditor
                  onEnter={() => {
                    //execute();
                  }}
                  json={input}
                  schema={props.jsonSchema}
                  onJsonChange={function (json: string): void {
                    setinput(json);
                  }}
                />

                <Button disabled={isRunning || !input} onClick={() => run()}>
                  Run
                </Button>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
              <div className="flex flex-1 flex-col h-full">
                <div className="flex h-16 items-center gap-2 border-b bg-background px-4">
                  <Button
                    disabled
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <ParenthesesIcon className="h-4 w-4" />
                    <span className="sr-only">Parse</span>
                  </Button>
                  <Button
                    disabled
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <CodeIcon className="h-4 w-4" />
                    <span className="sr-only">Preview Snippet</span>
                  </Button>
                  <Button
                    disabled
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <CopyIcon className="h-4 w-4" />
                    <span className="sr-only">Copy Snippet</span>
                  </Button>
                  <Button
                    disabled
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <SaveIcon className="h-4 w-4" />
                    <span className="sr-only">Write Snippet</span>
                  </Button>
                </div>
                <div className="flex flex-1 flex-col overflow-hidden ">
                  <div className="flex-1 overflow-y-auto bg-muted/10 p-4 h-full max-w-[calc(80vw-100px)]">
                    <MonacoEditor
                      width={"100%"}
                      defaultValue=""
                      height="100%"
                      language={isJSON ? "json" : "shell"}
                      // onChange={(value) => {
                      //   setcmd(value!);
                      // }}
                      value={isJSON ? JSON.stringify(output, null, 2) : output}
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: true },
                        scrollBeyondLastLine: false,
                      }}
                    />
                  </div>
                </div>
                <div>Output is: {isJSON ? "JSON" : "Text"} </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

function CircleDotIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  );
}

function CodeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function CopyIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function ParenthesesIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 21s-4-3-4-9 4-9 4-9" />
      <path d="M16 3s4 3 4 9-4 9-4 9" />
    </svg>
  );
}

function SaveIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
      <path d="M7 3v4a1 1 0 0 0 1 1h7" />
    </svg>
  );
}

function TerminalIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" x2="20" y1="19" y2="19" />
    </svg>
  );
}

function XIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
