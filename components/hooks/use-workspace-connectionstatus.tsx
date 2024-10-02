"use client";

import { ConnectionStatusType } from "@/components/workspace-toolbar";
import { useEffect, useState } from "react";

export default function useWorkspaceConnectionStatus(workspaceid: string) {
  const [pingStatus, setpingStatus] = useState<any>();
  const [connectionStatus, setconnectionStatus] =
    useState<ConnectionStatusType>("unknown");
  useEffect(() => {
    const load = async () => {
      const pong = await fetch(`/api/autopilot/ping/${workspaceid}`);
      const pongJson = await pong.json().catch(() => {
        setconnectionStatus("disconnected");
        return {};
      });

      setconnectionStatus(pongJson.errormessage ? "disconnected" : "connected");

      setpingStatus(pongJson);
    };
    if (!workspaceid) return;
    load();
  }, [workspaceid]);

  return connectionStatus;
}
