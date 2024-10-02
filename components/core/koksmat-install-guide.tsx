import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";

type ShellType = "bash" | "powershell";

export default function KoksmatInstallGuide(props: {
  studioUrl: string;
  id: string;
}) {
  const { studioUrl, id } = props;
  const [copied, setCopied] = useState(false);
  const [shellType, setShellType] = useState<ShellType>("powershell");

  const baseCommand = `$env:GOBIN=(Get-Location).Path; go install github.com/koksmat-com/koksmat@v2.1.13.27; ./koksmat auto run ${id} ${studioUrl}`;

  const commands: Record<ShellType, string> = {
    bash: baseCommand.replace(/;/g, " && ").replace(/\$env:/g, "export "),
    powershell: baseCommand,
  };

  const currentCommand = commands[shellType];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4 ">
          Shell Type
          <Select
            value={shellType}
            onValueChange={(value: ShellType) => setShellType(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select shell" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bash">Bash</SelectItem>
              <SelectItem value="powershell">PowerShell</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between space-x-4">
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold break-all">
            {currentCommand}
          </code>
          <Button
            variant="outline"
            size="icon"
            onClick={copyToClipboard}
            aria-label="Copy to clipboard"
          >
            {copied ? (
              <CheckIcon className="h-4 w-4 text-green-500" />
            ) : (
              <CopyIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Run this command in your {shellType} terminal to install the Go
          program.
        </p>
      </CardContent>
    </Card>
  );
}
