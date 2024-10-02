"use client";
import { createContext } from "react";

export type ToolCanvasType = "toolbar" | "canvas";
export type ToolContextType = {
  canvasType: ToolCanvasType;
  setCanvasType: (canvasType: "toolbar" | "canvas") => void;
};
export const ToolContext = createContext<ToolContextType>({
  canvasType: "toolbar",
  setCanvasType: function (canvasType: ToolCanvasType): void {
    throw new Error("Function not implemented.");
  },
});
