import { MagicboxContext } from "@/app/koksmat/magicbox-context";
import React, { useContext, useEffect } from "react";

export function GlobalDropHandling() {
  const magicbox = useContext(MagicboxContext);
  useEffect(() => {
    // Attach the drag and drop event listeners
    const handleDrop = (event: any) => {
      event.preventDefault();

      const dataTransfer = event.dataTransfer;
      const files = dataTransfer.files;

      if (files.length) {
        console.log("Dropped files:", files);
      } else {
        const textData = dataTransfer.getData("Text");
        console.log("Dropped Text Data:", textData);
        magicbox.handlePaste(textData);
      }
    };

    const handleDragOver = (event: any) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    };

    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("drop", handleDrop);

    // Cleanup event listeners on component unmount
    return () => {
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("drop", handleDrop);
    };
  }, []);

  return null;
}
