import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { Button } from "./ui/button";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check } from "lucide-react";

export default function WithClipboardCopy(props: {
  children: any;
  text: string;
}) {
  const { children, text } = props;
  const [copied, setCopied] = useState<string | null>(null);
  const [hoovering, sethoovering] = useState(false);
  const handleCopy = (sourceCode: string) => {
    navigator.clipboard.writeText(sourceCode);
    setCopied(sourceCode);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div
      onMouseEnter={() => sethoovering(true)}
      onMouseLeave={() => sethoovering(false)}
      className="flex items-center gap-2"
    >
      {children}
      {!copied && (
        <CopyIcon
          className="h-5 w-5 text-muted-foreground"
          // inClick handler which cancel default
          onClick={(e: any) => {
            e.preventDefault();
            handleCopy(text);
          }}
        />
      )}
      {copied && (
        <Check className="h-5 w-5 text-muted-foreground" />
      )}
    </div>
  );
}

function CopyIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
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
