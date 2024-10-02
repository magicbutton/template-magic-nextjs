import React, { useEffect, useState } from "react";
import { CommandSelector, CommandSelectorItem } from "./command-selector";
import useWorkspaceExec from "./hooks/use-workspace-exec";
import ItemsViewer, { Visualisation } from "./items-viewer";
import { useSQLSelect3 } from "@/app/koksmat/usesqlselect3";
import { DatabaseProps } from "./dashboard-databases";

export interface Root {
  Result: Result[];
}

export interface Result {
  result: Result2;
}

export interface Result2 {
  database_overview: DatabaseOverview;
  tables: Table[];
  stored_procedures: string[];
}

export interface DatabaseOverview {
  tables: number;
  size_on_disk: string;
  total_records: number;
}

export interface Table {
  name: string;
  records: number;
  size: string;
}
export default function Databases(props: {
  visualisation: Visualisation;
  allowSwitch?: boolean;
  allowedVisualizations?: Visualisation[];
  value: string;
  onChange: (value: string) => void;
}) {
  const { value, onChange, allowSwitch, allowedVisualizations } = props;
  const [tables, settables] = useState<CommandSelectorItem[]>([]);

  const query = useSQLSelect3<DatabaseProps>(
    "mix",
    `
select  id

,name as title
,name as slug
,description 
from public.connection
ORDER BY name

    `
  );
  useEffect(() => {
    if (query && query.dataset && query.dataset.length > 0) {
      //setdbinfo(query.dataset[0].result);
      const items = query.dataset.map((item) => {
        const cmd: CommandSelectorItem = {
          id: item.title,
          title: item.title,
          description: item.description,
          children: <div></div>,
          slug: item.title,
        };
        return cmd;
      });

      items.sort((a: any, b: any) => a.title.localeCompare(b.title));
      settables(items);
    }
  }, [query.dataset]);
  return (
    <ItemsViewer
      allowSwitch={allowSwitch}
      visualisation={props.visualisation}
      allowedVisualizations={allowedVisualizations}
      value={value}
      placeholder="Databases"
      commands={tables ? tables : []}
      onSelect={(command) => {
        onChange(command.id);
      }}
    />
  );
}
