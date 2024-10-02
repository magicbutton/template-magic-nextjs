import React from "react";
import { CommandSelector, CommandSelectorItem } from "./command-selector";
import useWorkspaceExec from "./hooks/use-workspace-exec";
import ItemsViewer, { Visualisation } from "./items-viewer";

export default function GitRepos(props: {
  visualisation: Visualisation;
  organisation: string;
  workspaceId: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const { value, onChange, workspaceId, organisation } = props;
  const organizations = useWorkspaceExec<CommandSelectorItem[]>(
    workspaceId,
    "gh",
    [
      "repo",
      "list",
      organisation,
      "--json",
      "name,description,url,isArchived,isFork,isPrivate,isTemplate",
    ],
    "",
    (response: string) => {
      if (!response) return [];
      const repos = JSON.parse(response);

      const items = repos.map((item: any) => {
        const cmd: CommandSelectorItem = {
          id: item.name,
          title: item.name,
          description: item.description,
          children: (
            <div>
              <a target="_blank" href="{item.url}">
                {item.url}
              </a>
            </div>
          ),
          slug: item.name,
        };
        return cmd;
      });

      return items.sort((a: any, b: any) => a.title.localeCompare(b.title));
    }
  );
  if (!organizations) return <div>Loading...</div>;
  return (
    <ItemsViewer
      visualisation={props.visualisation}
      value={value}
      placeholder="Git repos"
      commands={organisation ? organizations : []}
      onSelect={(command) => {
        onChange(command.id);
      }}
    />
  );
}
