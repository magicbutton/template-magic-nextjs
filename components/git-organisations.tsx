import React from "react";
import { CommandSelector, CommandSelectorItem } from "./command-selector";
import useWorkspaceExec from "./hooks/use-workspace-exec";
import ItemsViewer, { Visualisation } from "./items-viewer";

export default function GitOrganizations(props: {
  visualisation: Visualisation;
  workspaceId: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const { value, onChange, workspaceId } = props;
  const organizations = useWorkspaceExec<CommandSelectorItem[]>(
    workspaceId,
    "gh",
    ["org", "list", "--limit", "100"],
    "",
    (response: string) => {
      if (!response) return [];
      const items = response.split("\n").map((item) => {
        const cmd: CommandSelectorItem = {
          id: item,
          title: item,
          description: "",
          slug: item,
        };
        return cmd;
      });

      return items.sort((a, b) => a.title.localeCompare(b.title));
    }
  );
  if (!organizations) return <div>Loading...</div>;
  return (
    <ItemsViewer
      visualisation={props.visualisation}
      value={value}
      placeholder="Git organisation"
      commands={organizations}
      onSelect={(command) => {
        onChange(command.id);
      }}
    />
  );
}
