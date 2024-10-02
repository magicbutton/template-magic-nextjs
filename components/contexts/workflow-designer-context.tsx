import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { UsePathLookupHook } from "../providers/lookup-provider";
import path from "path";
import { get } from "http";
import { DropdownMenuIcon } from "@radix-ui/react-icons";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "../ui/popover";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

export interface WorkflowItemProps {
  name: string;
}
type editorViewOption = "off" | "simple" | "full";
interface WorkflowOptions {
  state: any;
  editorView: editorViewOption;
}

interface WorkflowContextType {
  state: any;
  editorView: editorViewOption;
  setEditorView: (view: editorViewOption) => void;
  setState: (state: any) => void;
}

const WorkflowContext = createContext<WorkflowContextType | null>(null);

export const useWorkflowContext = (): WorkflowContextType => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error(
      "useWorkflowContext must be used within a WorkflowProvider"
    );
  }
  return context;
};

interface WorkflowProviderProps {
  children: ReactNode;
}

export const WorkflowProvider: React.FC<WorkflowProviderProps> = ({
  children,
}) => {
  const [state, setstate] = useState<any>();
  const [editorView, setEditorView] = useState<editorViewOption>("off");

  return (
    <WorkflowContext.Provider
      value={{
        state: state,
        editorView: editorView,
        setEditorView: setEditorView,
        setState: setstate,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
};
