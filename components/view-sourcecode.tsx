import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { Button } from "./ui/button";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check } from "lucide-react";
export default function SourceCode(props: {
  children: any;
  language: string;
  isDark: boolean;
}) {
  const { children, language, isDark } = props;
  const [copied, setCopied] = useState(false);
  const [hoovering, sethoovering] = useState(false);
  const handleCopy = (sourceCode: string) => {
    navigator.clipboard.writeText(sourceCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div
      onMouseEnter={() => sethoovering(true)}
      onMouseLeave={() => sethoovering(false)}
    >
      <div className="overflow-scroll max-w-[80vw]">
        <pre className="relative">
          {hoovering && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCopy(children)}
              className="absolute top-1 right-1 bg-white"
            >
              {copied && <Check className="h-5 w-5 text-muted-foreground" />}

              {!copied && (
                <CopyIcon className="h-5 w-5 text-muted-foreground " />
              )}
            </Button>
          )}
          <code>
            <SyntaxHighlighter
              language={language}
              style={isDark ? dark : undefined}
            >
              {children}
            </SyntaxHighlighter>
          </code>
        </pre>
      </div>
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
