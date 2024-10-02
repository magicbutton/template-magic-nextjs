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
import { useSQLSelect3 } from "@/app/koksmat/usesqlselect3";
import { CommandSelectorItem } from "../command-selector";

export interface SqlQueryItemProps {
  name: string;
  href: string;
}
interface SqlQueryOptions {
  title?: string;
  [key: string]: any; // Add any additional options as key-value pairs
}

interface SqlQueryLookupHandlers {
  path: string;
  options?: SqlQueryOptions;
}

interface SqlQueryContextType {
  sqlQuerys: CommandSelectorItem[];
  setPath: (path: string) => void;
  items: SqlQueryItemProps[];
  getDropdownHandler: (path: string) => React.ReactNode | null;
}
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
const SqlQueryContext = createContext<SqlQueryContextType | null>(null);

export const useSqlQueryContext = (): SqlQueryContextType => {
  const context = useContext(SqlQueryContext);
  if (!context) {
    throw new Error(
      "useSqlQueryContext must be used within a SqlQueryProvider"
    );
  }
  return context;
};

interface SqlQueryProviderProps {
  children: ReactNode;
  lookupHandlers: UsePathLookupHook[];
  database: string;
}
interface Result {
  name: string
  sql: string
  description: string
  updated_at: Date
}
export const SqlQueryProvider: React.FC<SqlQueryProviderProps> = ({
  children,
  lookupHandlers,
  database
}) => {
  const [providers, setproviders] = useState<UsePathLookupHook[]>([]);
  const [items, setitems] = useState<SqlQueryItemProps[]>([]);
  const [sqlQuerys, setSqlQuerys] = useState<SqlQueryLookupHandlers[]>(
    []
  );

  const [queries, setqueries] = useState<CommandSelectorItem[]>([]);

  const query = useSQLSelect3<Result>(database, "select id,name,sql,description,updated_at,updated_by from sqlquery order by updated_at desc");
  useEffect(() => {


    if (query && query.dataset && query.dataset.length > 0) {
      //setdbinfo(query.dataset[0].result);
      const items = query.dataset.map((item: any) => {
        const cmd: CommandSelectorItem = {
          id: item.id,
          title: item.name,
          description: item.name + " last edited by " + item.updated_by + " at " + item.updated_at,
          timestamp: new Date(item.updated_at),
          author: item.updated_by,
          children: <HoverCard>
            <HoverCardTrigger>Hover</HoverCardTrigger>
            <HoverCardContent>

              {item.sql}
            </HoverCardContent>
          </HoverCard>
          ,
          slug: item.name,
        };
        return cmd;
      }).sort((a: any, b: any) => a.title.localeCompare(b.title));


      setqueries(items);
    }
  }, [query.dataset]);
  const registerSqlQueryLookupProvider = useCallback(
    (path: string, options: SqlQueryOptions = {}) => {
      setSqlQuerys((prevSqlQuerys) => {
        const existing = prevSqlQuerys.find((b) => b.path === path);
        if (existing) {
          return prevSqlQuerys.map((b) =>
            b.path === path ? { path, options } : b
          );
        }
        return [...prevSqlQuerys, { path, options }];
      });
    },
    []
  );

  const setPath = useCallback((pathname: string) => {
    const path = pathname.split("/").filter(Boolean);

    const items = path.map((_, i) => {
      const href = "/" + path.slice(0, i + 1).join("/");
      return {
        name: path[i],
        href,
      };
    });
    setitems(items);
  }, []);

  const getDropdownHandler = (path: string) => {
    const handler = lookupHandlers.find((provider) => {
      return provider.match(path);
    });
    return handler?.lookup;
  };

  return (
    <SqlQueryContext.Provider
      value={{
        sqlQuerys: queries,
        setPath,
        items,
        getDropdownHandler,
      }}
    >
      {children}
    </SqlQueryContext.Provider>
  );
};
