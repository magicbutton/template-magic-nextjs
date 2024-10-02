"use client";

import { useContext, useEffect, useState } from "react";
import { WorkspaceContext, WorkspaceContextType } from "./workspacecontext";
import { debug } from "console";
import { set } from "date-fns";
import { MagicboxContext } from "@/app/koksmat/magicbox-context";

export const WorkspaceContextProvider = (props: { children: any }) => {
  const magicbox = useContext(MagicboxContext);
  const [kitchenRoot, setKitchenRoot] = useState<any>();
  const [workspaceId, setworkspaceId] = useState("");
  const [webPathname, setPathname] = useState("");
  const [appName, setappName] = useState("");
  const [treePathName, settreePathName] = useState("");
  const [webAppUrl, setwebAppUrl] = useState("");
  const workspace: WorkspaceContextType = {
    kitchenroot: kitchenRoot!,
    setWorkspaceId: function (workspaceId: string): void {
      setworkspaceId(workspaceId);
    },
    workspaceId,
    webPathname,
    setWebPathname: function (newWebPathName: string): void {
      // if (!appName) return;
      // debugger;
      // if (!newWebPathName.toLowerCase().startsWith("/" + appName)) return;
      // const newPath = newWebPathName.slice(appName.length + 1);
      if (webPathname === newWebPathName) return;
      setPathname(newWebPathName);
    },
    appName,
    setAppName: function (newAppName: string): void {
      if (appName === newAppName) return;
      setappName(newAppName);
    },
    setTreePathname: function (treePathname: string): void {
      settreePathName(treePathname);
    },
    treePathname: treePathName,
    webAppUrl: webAppUrl,
    setWebAppUrl: function (webAppUrl: string): void {
      setwebAppUrl(webAppUrl);
    },
  };

  useEffect(() => {
    if (!workspaceId) return;
    if (!magicbox.authtoken) return;
    const load = async () => {
      const request1 = new Request(
        `/api/exec/remote/${workspaceId}/koksmat/context/kitchenRoot`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${magicbox.authtoken}`,
          },
        }
      );

      const getKitchenRoot = await fetch(request1);

      const kitchenRoot = await getKitchenRoot.text().catch((e) => {
        return { e };
      });
      if (!kitchenRoot) return;

      setKitchenRoot((kitchenRoot as string).split("\n")[0]);
    };
    load();
  }, [workspaceId, magicbox.authtoken]);

  return (
    <WorkspaceContext.Provider value={workspace}>
      {props.children}
    </WorkspaceContext.Provider>
  );
};
