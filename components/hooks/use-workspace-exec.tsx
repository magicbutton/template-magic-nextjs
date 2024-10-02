"use client";

import { MagicboxContext } from "@/app/koksmat/magicbox-context";
import { log } from "@/lib/log";
import { useContext, useEffect, useState } from "react";

export default function useWorkspaceExec<T>(
  workspaceid: string,
  command: string,
  args: string[],
  cwd: string,
  parser: (response: string) => T
) {
  const magicbox = useContext(MagicboxContext);
  const [response, setresponse] = useState<T>();

  useEffect(() => {
    const load = async () => {
      // post using fetch to get the connection status
      const request1 = new Request(`/api/autopilot/exec`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${magicbox.authtoken}`,
        },
        method: "POST",
        body: JSON.stringify({
          sessionid: workspaceid,
          action: "execute",
          command,
          args,
          cwd,
        }),
      });
      const result = await fetch(request1);
      const response = await result.json();
      const parsed = parser(response.body);

      setresponse(parsed);
    };
    if (!workspaceid) return;
    load();
  }, [workspaceid, command, cwd]);

  return response;
}
