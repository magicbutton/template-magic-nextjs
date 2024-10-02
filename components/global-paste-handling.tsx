import { MagicboxContext } from "@/app/koksmat/magicbox-context";
import React, { useContext, useState } from "react";
import { Clipboard, Check } from "lucide-react";

export default function Component() {
  const magicbox = useContext(MagicboxContext);
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePaste = async (text: string) => {
    console.log("Pasted Data:", text);
    setIsAnimating(true);
    try {
      await magicbox.handlePaste(text);
    } catch (error) {
      console.error("Error in magicbox.handlePaste:", error);
    }
    setTimeout(() => setIsAnimating(false), 2000);
  };

  const handleClick = async () => {
    try {
      const text = await navigator.clipboard.readText();
      handlePaste(text);
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  };

  const handlePasteEvent = (event: React.ClipboardEvent) => {
    event.preventDefault();
    const text = event.clipboardData.getData("text");
    handlePaste(text);
  };

  return (
    <button
      onClick={handleClick}
      onPaste={handlePasteEvent}
      className="relative w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      aria-label="Click to paste"
    >
      <span
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isAnimating ? "opacity-100" : "opacity-0"}`}
      >
        <Check className="w-6 h-6 text-primary-foreground" />
      </span>
      <span
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}
      >
        <Clipboard className="w-6 h-6" />
      </span>
      <span
        className={`absolute inset-0 rounded-full border-4 border-primary-foreground transition-transform duration-300 ${isAnimating ? "animate-ping" : ""}`}
      ></span>
    </button>
  );
}
