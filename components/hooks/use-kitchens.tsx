"use client";

import { MagicboxContext } from "@/app/koksmat/magicbox-context";
import { log } from "@/lib/log";
import { useContext, useEffect, useState } from "react";

export interface Kitchen {
  name: string;
  title: string;
  stations: any;
  description: string;
  path: string;
  readme: string;
  tag: string;
}

export default function useKitchens(workspaceid: string) {
  const magicbox = useContext(MagicboxContext);
  const [response, setresponse] = useState<Kitchen[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!magicbox.authtoken) return;

      // post using fetch to get the connection status
      const request1 = new Request(`/api/autopilot/exec`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${magicbox.authtoken}`,
        },
        body: JSON.stringify({
          sessionid: workspaceid,
          action: "execute",
          command: "koksmat",
          args: ["kitchen", "list"],
        }),
      });
      const result = await fetch(request1);
      const response = await result.json();
      try {
        const body = JSON.parse(response.body);
        setresponse(body);
      } catch (error) {
        log("useKitchens : cannot parse", response.body);
      }
    };
    if (!workspaceid) return;
    load();
  }, [workspaceid, magicbox.authtoken]);

  return response;
}
