"use client";

import { useState } from "react";
import { ToolContext, ToolContextType, ToolCanvasType } from "./toolcontext";

export const ToolContextProvider = (props: { children: any }) => {
  const [canvasType, setcanvasType] = useState<ToolCanvasType>("toolbar");

  const toolspace: ToolContextType = {
    canvasType,
    setCanvasType: function (canvasType: ToolCanvasType): void {
      setcanvasType(canvasType);
    },
  };

  return (
    <ToolContext.Provider value={toolspace}>
      {props.children}
    </ToolContext.Provider>
  );
};
